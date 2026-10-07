import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import {
  getPageStructuredData,
  PAGE_SCHEMA_ID,
  SCHEMA_BASE_URL,
  serializeStructuredData,
  STRUCTURED_DATA_ROUTES,
} from "../src/lib/structured-data.ts";

const output = new URL("../../../dist/public/", import.meta.url);
const source = new URL("../", import.meta.url);

function schemas(html) {
  return [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)]
    .filter(([, attributes]) => attributes.includes('type="application/ld+json"'))
    .map(([, attributes, json]) => ({ attributes, data: JSON.parse(json) }));
}

test("Pre-rendered home exposes a linked business and website graph without JavaScript", async () => {
  for (const url of [new URL("index.html", output)]) {
    const blocks = schemas(await readFile(url, "utf8"));
    assert.equal(blocks.length, 2);
    const { data } = blocks[0];
    assert.equal(data["@context"], "https://schema.org");
    const [business, website] = data["@graph"];
    assert.deepEqual(business["@type"], ["Organization", "LocalBusiness", "FinancialService"]);
    assert.equal(business["@id"], `${SCHEMA_BASE_URL}/#organization`);
    assert.equal(website.publisher["@id"], business["@id"]);
    assert.equal(website["@type"], "WebSite");
    assert.equal(business.telephone, "+61421833372");
    assert.equal(business.email, "bevan@entirefs.com.au");
    assert.equal(business.address.addressLocality, "Clayton");
    assert.equal(business.address.postalCode, "3168");
    const contact = await readFile(new URL("src/pages/contact.tsx", source), "utf8");
    assert.ok(contact.includes('href="tel:0421833372"'));
    assert.ok(contact.includes(`mailto:${business.email}`));
    assert.ok(contact.includes("Suite 42/ 195 Wellington Road, Clayton, VIC, 3168 (Building 4)"));
    assert.equal(business.address.addressCountry, "AU");
    await readFile(new URL("public/favicon.png", source));
  }
});

for (const route of STRUCTURED_DATA_ROUTES) {
  test(`${route} has matching crawler-visible schema and resolvable graph references`, async () => {
    const html = await readFile(new URL(route === "/" ? "index.html" : `${route.slice(1)}/index.html`, output), "utf8");
    const blocks = schemas(html);
    assert.equal(blocks.length, 2);
    const page = blocks.find(({ attributes }) => attributes.includes(`id="${PAGE_SCHEMA_ID}"`));
    assert.deepEqual(page.data, getPageStructuredData(route));
    const nodes = blocks.flatMap(({ data }) => data["@graph"]);
    const ids = nodes.map((node) => node["@id"]);
    assert.equal(new Set(ids).size, ids.length);
    function checkReferences(value) {
      if (!value || typeof value !== "object") return;
      if (value["@id"]) assert.ok(ids.includes(value["@id"]), value["@id"]);
      for (const child of Object.values(value)) checkReferences(child);
    }
    checkReferences(page.data);
    const entity = page.data["@graph"][1];
    if (route === "/about") {
      assert.equal(entity["@type"], "Person");
      assert.equal(entity.name, "Bevan Heneric");
      assert.ok(entity.description.includes("more than 20 years"));
      assert.equal(entity.worksFor["@id"], `${SCHEMA_BASE_URL}/#organization`);
      assert.equal(entity.hasCredential, undefined);
      assert.equal(entity.memberOf, undefined);
    } else if (entity?.["@type"] === "Service") {
      assert.equal(entity["@type"], "Service");
      assert.equal(entity.url, `${SCHEMA_BASE_URL}${route}`);
      assert.equal(entity.provider["@id"], `${SCHEMA_BASE_URL}/#organization`);
    }
  });
}

test("normalizes paths and provides page entities only for public routes", () => {
  assert.deepEqual(getPageStructuredData("/about/?ref=example#bio"), getPageStructuredData("/about"));
  for (const route of ["/missing", "/toString"]) {
    assert.equal(getPageStructuredData(route), null);
  }
});

test("JSON serialization prevents script-tag injection while retaining valid JSON", () => {
  const input = { description: "</script><script>alert('x')</script>" };
  const json = serializeStructuredData(input);
  assert.ok(!json.includes("<"));
  assert.deepEqual(JSON.parse(json), input);
});