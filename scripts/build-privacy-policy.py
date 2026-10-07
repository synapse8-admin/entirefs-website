"""Convert the approved Privacy Policy brief to content, excluding instructions."""
import json
import re
import sys


def clean(line):
    return line.replace("**", "").strip()


def build(raw):
    public = raw.split("\n# PRIVACY POLICY\n", 1)[1].split("\n## PAGE FOOTER / LEGAL DETAILS", 1)[0]
    intro, body = public.split("\n## Our Commitment to Your Privacy\n", 1)
    introduction = [clean(line) for line in intro.splitlines() if line.strip()]
    body = "## Our Commitment to Your Privacy\n" + body
    sections = []
    for part in re.split(r"^## ", body, flags=re.M)[1:]:
        title, content = part.split("\n", 1)
        # The OAIC link configuration is an instruction, not policy wording.
        content = content.split("\nLink the text:", 1)[0]
        blocks = []
        paragraph = []
        items = []

        def flush():
            if paragraph:
                if title == "Contact Us About Privacy" and paragraph[0].startswith(("Privacy Officer", "Phone:")):
                    blocks.append({"type": "contact", "items": list(paragraph)})
                else:
                    blocks.append({"type": "paragraph", "text": " ".join(paragraph)})
                paragraph.clear()
            if items:
                blocks.append({"type": "list", "items": list(items)})
                items.clear()

        for line in content.splitlines():
            line = clean(line)
            if not line:
                flush()
            elif line.startswith("- "):
                if paragraph:
                    flush()
                items.append(line[2:])
            else:
                if items:
                    flush()
                paragraph.append(line)
        flush()
        sections.append({
            "id": re.sub(r"[^a-z0-9]+", "-", title.lower()).strip("-"),
            "title": title,
            "blocks": blocks,
        })
    legal = raw.split("At the end of the policy content, include a subtle legal information block:", 1)[1]
    legal = legal.split("\nStyle this information", 1)[0]
    return {
        "title": "Privacy Policy",
        "eyebrow": "Entire Financial Services",
        "intro": "We respect your privacy and are committed to protecting the personal information you share with us.",
        "metaTitle": "Privacy Policy | Entire Financial Services",
        "metaDescription": "Read the Entire Financial Services Privacy Policy and learn how we collect, use, protect and manage your personal information.",
        "introduction": introduction,
        "sections": sections,
        "legal": [clean(line) for line in legal.splitlines() if line.strip()],
    }


if __name__ == "__main__":
    with open(sys.argv[1]) as source:
        print(json.dumps(build(source.read()), ensure_ascii=False, indent=2))