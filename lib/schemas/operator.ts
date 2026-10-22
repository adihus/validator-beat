import { z } from "zod";
import { decodeShareCode } from "../rubric";

/**
 * Public declarations only. Never accept credentials, secret signing material,
 * infrastructure diagrams, or private control evidence in these Git-tracked records.
 * A schema-valid record is NOT an identity check or an independent security audit.
 */
const httpsUrl = z.string().url().refine((value) => value.startsWith("https://"), {
  message: "Public URLs must use HTTPS",
});
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Expected YYYY-MM-DD");

export const valosDeclarationSchema = z
  .object({
    pathway: z.enum(["essential", "comprehensive"]),
    status: z.enum(["self-declared", "independently-assessed"]),
    standardVersion: z.string().min(1).max(40),
    assessmentDate: isoDate,
    disclosure: z.enum(["minimal", "summary", "full"]),
    publicSummary: z.string().max(500).optional(),
    evidenceUrl: httpsUrl.optional(),
    assessor: z.string().min(2).max(120).optional(),
  })
  .strict()
  .superRefine((item, ctx) => {
    if (item.status === "independently-assessed" && (!item.assessor || !item.evidenceUrl)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Independent assessment requires a named assessor and public evidence link",
        path: ["status"],
      });
    }
  });

export const operatorProfileSchema = z
  .object({
    slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
    name: z.string().min(2).max(100),
    description: z.string().max(500).optional(),
    website: httpsUrl.optional(),
    // The existing 6-slice assessment remains a separate, operator-declared result.
    validatorBeat: z
      .object({
        shareCode: z.string().regex(/^[GYRU]{6}$/),
        assessmentDate: isoDate,
      })
      .strict()
      .optional(),
    identityStatus: z.literal("unverified").default("unverified"),
    valos: z.array(valosDeclarationSchema).default([]),
  })
  .strict()
  .superRefine((item, ctx) => {
    if (item.validatorBeat && !decodeShareCode(item.validatorBeat.shareCode)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid ValidatorBeat share code for the six-slice rubric",
        path: ["validatorBeat", "shareCode"],
      });
    }
  });

export type OperatorProfile = z.infer<typeof operatorProfileSchema>;
export type ValosDeclaration = z.infer<typeof valosDeclarationSchema>;
