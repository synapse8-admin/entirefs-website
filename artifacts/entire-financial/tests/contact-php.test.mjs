import assert from "node:assert/strict";
import { spawn, spawnSync } from "node:child_process";
import { once } from "node:events";
import { mkdtemp, mkdir, copyFile, writeFile, readFile, rm, access } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import net from "node:net";
import { test } from "node:test";

const phpAvailable = spawnSync("php", ["-v"], { stdio: "ignore" }).status === 0;

test("PHP contact request contract and SMTP wiring (isolated fake transport; no email)", { skip: !phpAvailable }, async (t) => {
  const dir = await mkdtemp(path.join(tmpdir(), "entire-contact-"));
  const root = path.join(dir, "public");
  await mkdir(path.join(root, "lib"), { recursive: true });
  await copyFile(new URL("../public/contact.php", import.meta.url), path.join(root, "contact.php"));
  // Stub only the transport, in an isolated copy; never modify the bundled vendor.
  await writeFile(path.join(root, "lib/Exception.php"), "<?php\n");
  await writeFile(path.join(root, "lib/SMTP.php"), "<?php\n");
  await writeFile(path.join(root, "lib/PHPMailer.php"), `<?php
namespace PHPMailer\\PHPMailer;
class PHPMailer extends \\stdClass {
    const ENCRYPTION_SMTPS = 'ssl';
    public function __construct($exceptions) {}
    public function isSMTP() { $this->smtp = true; }
    public function isHTML($html) { $this->html = $html; }
    public function setFrom($email, $name) { $this->from = [$email, $name]; }
    public function addAddress($email, $name) { $this->to = [$email, $name]; }
    public function addReplyTo($email, $name) { $this->reply = [$email, $name]; }
    public function send() {
        file_put_contents(__DIR__ . '/../mail-state.json', json_encode($this));
        return $this->Host !== 'reject.invalid';
    }
}
`);
  const socket = net.createServer();
  socket.listen(0, "127.0.0.1");
  await once(socket, "listening");
  const port = socket.address().port;
  await new Promise(resolve => socket.close(resolve));
  const server = spawn("php", ["-S", `127.0.0.1:${port}`, "-t", root], { stdio: "ignore" });
  t.after(async () => {
    server.kill();
    await once(server, "exit");
    await rm(dir, { recursive: true, force: true });
  });
  const endpoint = `http://127.0.0.1:${port}/contact.php`;
  for (let attempt = 0; attempt < 50; attempt++) {
    try { await fetch(endpoint); break; }
    catch { await new Promise(resolve => setTimeout(resolve, 50)); }
  }
  const values = {
    fullName: "Test Customer", email: "customer@example.invalid", phone: "0400 000 000",
    enquiryType: "superannuation", message: "This is a local automated test, not a real enquiry.",
    preferredContact: "email", bestTime: "morning", website: "",
  };
  const post = async (body, type = "application/json") => {
    const response = await fetch(endpoint, { method: "POST", headers: { "Content-Type": type }, body: typeof body === "string" ? body : JSON.stringify(body) });
    assert.match(response.headers.get("content-type"), /application\/json/);
    assert.equal(response.headers.get("cache-control"), "no-store");
    return { status: response.status, body: await response.json() };
  };
  await t.test("rejects unsupported methods, media types, malformed JSON and large bodies", async () => {
    for (const method of ["GET", "PUT", "OPTIONS"]) {
      const response = await fetch(endpoint, { method });
      assert.equal(response.status, 405);
      assert.equal(response.headers.get("allow"), "POST");
    }
    assert.equal((await post(values, "text/plain")).status, 415);
    for (const body of ["{", "null", "[]", '"string"']) assert.equal((await post(body)).status, 400);
    assert.equal((await post("x".repeat(32769))).status, 413);
  });
  await t.test("honeypot succeeds without configuration or any send", async () => {
    assert.deepEqual(await post({ website: "spam" }), { status: 200, body: { success: true } });
    await assert.rejects(access(path.join(root, "mail-state.json")));
  });
  await t.test("mirrors required fields and rejects injection, invalid enums, types and lengths", async () => {
    for (const key of Object.keys(values).filter(key => key !== "website")) {
      const result = await post({ ...values, [key]: "" });
      assert.equal(result.status, 422);
      assert.ok(result.body.errors[key]);
    }
    for (const change of [
      { email: "bad-email" }, { email: "test@example.invalid\r\nBcc: victim@example.invalid" },
      { preferredContact: "sms" }, { bestTime: "midnight" }, { enquiryType: "unknown" },
      { fullName: ["not a string"] }, { message: "short" }, { phone: "abcdefgh" },
      { message: "x".repeat(5001) },
    ]) assert.equal((await post({ ...values, ...change })).status, 422);
  });
  await t.test("valid request fails safely when config is missing", async () => {
    const result = await post(values);
    assert.equal(result.status, 503);
    assert.equal(result.body.success, false);
    assert.ok(!JSON.stringify(result.body).includes("SMTP"));
  });
  const config = (host, password = "test-only-not-real") => `<?php return [
    'smtp_host'=>'${host}', 'smtp_port'=>465, 'smtp_username'=>'forms@example.invalid',
    'smtp_password'=>'${password}', 'from_email'=>'forms@example.invalid',
    'from_name'=>'Website', 'to_email'=>'recipient@example.invalid', 'to_name'=>'Recipient',
  ];`;
  await t.test("unmodified sample cannot accidentally send with placeholder credentials", async () => {
    await copyFile(new URL("../contact-config.sample.php", import.meta.url), path.join(dir, "contact-config.php"));
    assert.equal((await post(values)).status, 503);
    await assert.rejects(access(path.join(root, "mail-state.json")));
  });
  await t.test("success requires send acceptance and uses authenticated verified SMTPS/465", async () => {
    await writeFile(path.join(dir, "contact-config.php"), config("smtp.example.invalid"));
    assert.deepEqual(await post(values), { status: 200, body: { success: true } });
    const state = JSON.parse(await readFile(path.join(root, "mail-state.json"), "utf8"));
    assert.equal(state.smtp, true);
    assert.equal(state.SMTPAuth, true);
    assert.equal(state.SMTPSecure, "ssl");
    assert.equal(state.Port, 465);
    assert.equal(state.Host, "smtp.example.invalid");
    assert.equal(state.Username, "forms@example.invalid");
    assert.equal(state.Password, "test-only-not-real");
    assert.deepEqual(state.SMTPOptions.ssl, { verify_peer: true, verify_peer_name: true, allow_self_signed: false });
    assert.deepEqual(state.from, ["forms@example.invalid", "Website"]);
    assert.deepEqual(state.to, ["recipient@example.invalid", "Recipient"]);
    assert.deepEqual(state.reply, ["customer@example.invalid", "Test Customer"]);
    assert.equal(state.html, false);
    assert.equal(state.Subject, "New enquiry from entirefs.com.au contact form");
    for (const [key, value] of Object.entries(values).filter(([key]) => key !== "website")) assert.ok(state.Body.includes(value), key);
    assert.ok(!/^website:/im.test(state.Body));
  });
  await t.test("SMTP rejection never returns success", async () => {
    await writeFile(path.join(dir, "contact-config.php"), config("reject.invalid"));
    const result = await post(values);
    assert.equal(result.status, 503);
    assert.equal(result.body.success, false);
  });
});

test("build contains PHP, library deny rule and no private/sample config", async () => {
  const dist = new URL("../../../dist/public/", import.meta.url);
  for (const file of ["contact.php", "lib/PHPMailer.php", "lib/SMTP.php", "lib/Exception.php", "lib/LICENSE", "lib/.htaccess"]) {
    assert.equal(await readFile(new URL(file, dist), "utf8"), await readFile(new URL(`../public/${file}`, import.meta.url), "utf8"));
  }
  assert.match(await readFile(new URL("lib/.htaccess", dist), "utf8"), /Require all denied/);
  await assert.rejects(access(new URL("contact-config.php", dist)));
  await assert.rejects(access(new URL("contact-config.sample.php", dist)));
});
