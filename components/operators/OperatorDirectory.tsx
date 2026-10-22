import { useMemo, useState } from "react";
import Link from "next/link";
import { Box } from "@obolnetwork/obol-ui";
import { computeStage, decodeShareCode } from "@lib/rubric";
import type { OperatorProfile } from "@lib/schemas/operator";

export function OperatorDirectory({ operators }: { operators: OperatorProfile[] }) {
  const [search, setSearch] = useState("");
  const matches = useMemo(
    () => operators.filter((operator) =>
      (operator.name + " " + (operator.description ?? "")).toLowerCase().includes(search.trim().toLowerCase()),
    ),
    [operators, search],
  );

  return (
    <Box as="main" id="main-content" css={{ maxWidth: 1080, margin: "0 auto", padding: "64px 24px 96px", minHeight: "65vh" }}>
      <Box as="p" css={{ color: "$textMiddle", fontWeight: 600, fontSize: "$2" }}>PUBLIC OPERATOR REGISTRY · EXPERIMENTAL FORK</Box>
      <Box as="h1" css={{ fontSize: "clamp(32px, 5vw, 56px)", lineHeight: 1.12, margin: "16px 0" }}>Explore validator operators</Box>
      <Box as="p" css={{ maxWidth: 740, color: "$textMiddle", fontSize: "$3", lineHeight: 1.65 }}>
        A proposed public home for operator-declared resilience results and clearly scoped security-assurance evidence.
        Self-assessments are declarations, not independent certification. Registry entries require review before publication.
      </Box>
      <Box css={{ margin: "30px 0" }}>
        <label htmlFor="operator-search" style={{ display: "block", marginBottom: 8, fontWeight: 600 }}>Search operators</label>
        <input id="operator-search" type="search" value={search} onChange={(e) => setSearch(e.target.value)}
          placeholder="Search names and descriptions" style={{ width: "100%", maxWidth: 520, padding: "14px 16px", borderRadius: 8, border: "1px solid #929e9e", background: "transparent", color: "inherit", fontSize: 16 }} />
      </Box>
      {operators.length === 0 ? (
        <Box css={{ border: "1px solid $bg05", borderRadius: "$3", padding: "32px", backgroundColor: "$bg02" }}>
          <Box as="h2" css={{ fontSize: "$4", margin: "0 0 8px" }}>No operator profiles published yet</Box>
          <Box as="p" css={{ color: "$textMiddle", margin: 0, lineHeight: 1.6 }}>
            This experimental fork currently contains no submitted operators. The registry structure is being developed.
            It does not imply any operator has completed or passed a ValOS assessment.
          </Box>
        </Box>
      ) : matches.length === 0 ? (
        <Box as="p" css={{ color: "$textMiddle" }}>No operators match that search.</Box>
      ) : (
        <Box css={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(270px, 1fr))", gap: 18 }}>
          {matches.map((operator) => {
            const answers = operator.validatorBeat ? decodeShareCode(operator.validatorBeat.shareCode) : null;
            const stage = answers ? computeStage(answers) : null;
            return (
              <Box key={operator.slug} css={{ border: "1px solid $bg05", borderRadius: "$3", padding: 24, backgroundColor: "$bg02" }}>
                <Box as="h2" css={{ fontSize: "$4", margin: "0 0 8px" }}>
                  <Link href={"/operators/" + operator.slug + "/"}>{operator.name}</Link>
                </Box>
                <Box as="p" css={{ color: "$textMiddle", lineHeight: 1.5 }}>{operator.description ?? "No public description."}</Box>
                <Box as="p" css={{ fontSize: "$2" }}>
                  ValidatorBeat: {stage === null ? "Not declared" : "Stage " + stage + " (self-declared)"}
                </Box>
                <Box as="p" css={{ fontSize: "$2" }}>
                  ValOS records: {operator.valos.length} (evidence status shown on profile)
                </Box>
                <Link href={"/operators/" + operator.slug + "/"}>View operator details →</Link>
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
