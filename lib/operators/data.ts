import fs from "fs";
import path from "path";
import { operatorProfileSchema, type OperatorProfile } from "../schemas/operator";

// Build-time only: Git is the data store; the published site has no backend.
const yaml = require("js-yaml") as { load(input: string): unknown };
const OPERATOR_DIRECTORY = path.join(process.cwd(), "data", "operators");

export function readOperatorProfiles(): OperatorProfile[] {
  if (!fs.existsSync(OPERATOR_DIRECTORY)) return [];
  const filenames = fs
    .readdirSync(OPERATOR_DIRECTORY)
    .filter((name) => /\.ya?ml$/.test(name))
    .sort();

  const profiles = filenames.map((filename) => {
    const pathname = path.join(OPERATOR_DIRECTORY, filename);
    const raw = yaml.load(fs.readFileSync(pathname, "utf8"));
    const parsed = operatorProfileSchema.safeParse(raw);
    if (!parsed.success) {
      throw new Error(
        "Invalid operator profile " + filename + ": " + parsed.error.message,
      );
    }
    if (filename !== parsed.data.slug + ".yaml") {
      throw new Error("Operator slug must match the filename: " + filename);
    }
    return parsed.data;
  });

  const slugs = new Set<string>();
  for (const profile of profiles) {
    if (slugs.has(profile.slug)) {
      throw new Error("Duplicate operator slug: " + profile.slug);
    }
    slugs.add(profile.slug);
  }
  return profiles;
}
