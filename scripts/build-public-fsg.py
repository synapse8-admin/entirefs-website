"""Extract only public FSG content; never export the acknowledgement receipt."""
import json
import re
import sys
import zipfile
import xml.etree.ElementTree as ET

NS = {"w": "http://schemas.openxmlformats.org/wordprocessingml/2006/main"}


def normalise(text):
    return re.sub(r"\s+", " ", text).strip()


def extract(path):
    with zipfile.ZipFile(path) as doc:
        root = ET.fromstring(doc.read("word/document.xml"))
    paragraphs = {
        i: normalise("".join(t.text or "" for t in p.findall(".//w:t", NS)))
        for i, p in enumerate(root.findall(".//w:body//w:p", NS))
    }
    boundary = next(i for i, text in paragraphs.items() if text == "Acknowledgement receipt")
    # Discard private text before preparing any public output.
    public = {i: text for i, text in paragraphs.items() if i < boundary and text}
    assert public[274] == "Complying compensation arrangements:"
    assert max(public) == 275
    return public


def build(public):
    used = {1}

    def text(i):
        used.add(i)
        return public[i]

    def paragraph(i):
        return {"type": "paragraph", "text": text(i)}

    def heading(i):
        return {"type": "heading", "text": text(i)}

    def listing(indices):
        return {"type": "list", "items": [text(i) for i in indices]}

    sections = []

    def section(id, title, label, blocks, panel=False):
        sections.append({"id": id, "title": title, "navLabel": label,
                         "panel": panel, "blocks": blocks})

    intro = [text(i) for i in [3, 4, 6, 7, 8, 9, 10, 12, 13]]
    disclosure = {"title": text(17), "text": text(18)}
    section("about-this-fsg", "About the Financial Services Guide", "About this FSG",
            [paragraph(i) for i in [44, 46, 48, 50]] +
            [listing(range(51, 61)), paragraph(62)])
    section("apex-and-entire", text(64), "Apex Macro & Entire Financial Services",
            [heading(66)] + [paragraph(i) for i in [67, 69, 71]] +
            [listing([72, 73])])
    section("approved-products", text(75), "Approved Product List",
            [paragraph(76), paragraph(77)])
    section("business-profile", text(85), "Business Profile",
            [listing(range(87, 92))], True)
    section("our-obligations", text(93), "Our obligations", [paragraph(95)])
    section("your-adviser", text(97), "Your adviser",
            [heading(99), paragraph(100), heading(102), paragraph(104), paragraph(106)])
    section("services", text(108), "Services",
            [paragraph(110), listing(range(111, 124)), heading(125), paragraph(126)])
    section("qualifications", text(128), "Qualifications",
            [listing(range(129, 137)), paragraph(137), heading(139),
             listing(range(140, 147)), paragraph(148)])
    section("before-advice", text(150), "Before receiving advice",
            [heading(152), paragraph(153), heading(155), paragraph(156),
             heading(158), paragraph(159)])
    section("provision-of-advice", text(163), "Provision of advice",
            [heading(165), paragraph(166), paragraph(168)])
    section("advice-documents", text(170), "Documents you may receive",
            [heading(172), paragraph(173), paragraph(174), heading(176),
             paragraph(177), paragraph(179), paragraph(181), listing(range(182, 188)),
             paragraph(189), paragraph(191), paragraph(193)])
    section("instructions", "Instructions for buying or selling financial products",
            "Buying & selling instructions", [heading(195), paragraph(196)])
    section("fees-remuneration", "Fees and remuneration", "Fees & remuneration",
            [heading(198), paragraph(199), heading(201), paragraph(202),
             heading(204), paragraph(205), heading(207), paragraph(208),
             paragraph(210), heading(212), paragraph(213), heading(215),
             paragraph(216), paragraph(218)])
    section("other-payments", text(220), "Other payments", [paragraph(221)])
    section("referral-fees", text(223), "Referral fees & commissions", [paragraph(224)])
    section("conflicts", text(226), "Conflicts of interest",
            [heading(228), paragraph(229)])
    section("additional-benefits", text(231), "Additional benefits", [paragraph(233)])
    # The user explicitly approved shortening this heading; body wording stays exact.
    text(235)
    section("fsg-privacy", "Privacy Policy", "Privacy",
            [paragraph(i) for i in [237, 239, 241, 243, 245, 247]])
    steps = []
    for start, extra in [(256, None), (257, 258), (259, None), (260, None)]:
        value = re.sub(r"^\d+\.\s*", "", text(start))
        if extra:
            value += " " + text(extra)
        steps.append(value)
    section("fsg-complaints", text(249), "Complaints",
            [paragraph(251), {"type": "ordered-list", "items": steps},
             paragraph(262), paragraph(263), paragraph(264),
             {"type": "contact", "items": [text(i) for i in range(266, 271)]},
             paragraph(272)])
    section("compensation", text(274), "Compensation arrangements",
            [paragraph(275)], True)
    assert used == set(public), f"Public source paragraphs omitted: {sorted(set(public) - used)}"
    return {"title": public[1], "introduction": intro, "disclosure": disclosure,
            "sections": sections}


if __name__ == "__main__":
    print(json.dumps(build(extract(sys.argv[1])), ensure_ascii=False, indent=2))