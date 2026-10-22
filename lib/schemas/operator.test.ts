import { operatorProfileSchema } from "./operator";

const base = {
  slug: "sample-operator",
  name: "Sample Operator",
  validatorBeat: { shareCode: "GYYGGY", assessmentDate: "2026-10-22" },
};

describe("public operator schema", () => {
  it("accepts a well-formed, explicitly unverified declaration", () => {
    const parsed = operatorProfileSchema.parse(base);
    expect(parsed.identityStatus).toBe("unverified");
    expect(parsed.valos).toEqual([]);
  });

  it("rejects an impossible six-slice share code", () => {
    expect(
      operatorProfileSchema.safeParse({
        ...base,
        validatorBeat: { shareCode: "GGGGGR", assessmentDate: "2026-10-22" },
      }).success,
    ).toBe(false);
  });

  it("rejects independent assurance claims with no assessor or evidence", () => {
    expect(
      operatorProfileSchema.safeParse({
        ...base,
        valos: [
          {
            pathway: "essential",
            status: "independently-assessed",
            standardVersion: "draft",
            assessmentDate: "2026-10-22",
            disclosure: "minimal",
          },
        ],
      }).success,
    ).toBe(false);
  });

  it("rejects unknown fields and non-HTTPS public links", () => {
    expect(operatorProfileSchema.safeParse({ ...base, privateKey: "DO-NOT-PUBLISH" }).success).toBe(false);
    expect(operatorProfileSchema.safeParse({ ...base, website: "http://example.org" }).success).toBe(false);
  });
});
