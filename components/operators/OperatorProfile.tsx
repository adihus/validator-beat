import Link from "next/link";
import { Box } from "@obolnetwork/obol-ui";
import { computeStage, decodeShareCode } from "@lib/rubric";
import type { OperatorProfile as OperatorProfileData } from "@lib/schemas/operator";

const SCOPE_LABELS = { essential: "ValOS Essential (proposed)", comprehensive: "ValOS Comprehensive (proposed)" };
const DISCLOSURE_LABELS = { minimal: "Minimal", summary: "Summary", full: "Full safe disclosure" };

export function OperatorProfile({ operator }: { operator: OperatorProfileData }) {
  const answers = operator.validatorBeat ? decodeShareCode(operator.validatorBeat.shareCode) : null;
  const stage = answers ? computeStage(answers) : null;

  return (
    <Box as="main" id="main-content" css={{ maxWidth: 940, margin: "0 auto", padding: "48px 24px 96px", minHeight: "65vh" }}>
      <Box as="p" css={{ marginBottom: 28 }}><Link href="/operators/">← All operators</Link></Box>
      <Box as="p" css={{ color: "$textMiddle", fontSize: "$2" }}>PUBLIC OPERATOR DECLARATION · EXPERIMENTAL FORK</Box>
      <Box as="h1" css={{ fontSize: "clamp(30px, 5vw, 50px)", marginBottom: 12 }}>{operator.name}</Box>
      <Box as="p" css={{ maxWidth: 720, lineHeight: 1.6 }}>{operator.description ?? "No public description."}</Box>
      <Box as="p"><strong>Identity status:</strong> Not independently verified</Box>
      {operator.website && <Box as="p"><a href={operator.website} target="_blank" rel="noopener noreferrer">Operator website ↗</a></Box>}
      <Box as="section" css={{ borderTop: "1px solid $bg05", paddingTop: 24, marginTop: 32 }}>
        <Box as="h2" css={{ fontSize: "$4" }}>ValidatorBeat resilience</Box>
        <Box as="p">{stage === null ? "No resilience assessment published." : "Stage " + stage + " · Operator-declared, not independently verified"}</Box>
        {operator.validatorBeat && (
          <Box as="p">
            <a href={"https://validatorbeat.com/" + operator.validatorBeat.shareCode + "/"} target="_blank" rel="noopener noreferrer">
              View shared six-slice result ↗
            </a> · Declared {operator.validatorBeat.assessmentDate}
          </Box>
        )}
      </Box>
      <Box as="section" css={{ borderTop: "1px solid $bg05", paddingTop: 24, marginTop: 32 }}>
        <Box as="h2" css={{ fontSize: "$4" }}>ValOS assessment declarations</Box>
        <Box as="p" css={{ color: "$textMiddle", lineHeight: 1.6 }}>
          Proposed assessment levels have not been approved as official ValOS badges. A self-declaration is never an independent certification.
        </Box>
        {operator.valos.length === 0 ? (
          <Box as="p">No ValOS assessment records published.</Box>
        ) : (
          operator.valos.map((record, index) => (
            <Box key={record.pathway + "-" + index} css={{ border: "1px solid $bg05", borderRadius: "$3", padding: 20, margin: "12px 0" }}>
              <Box as="h3" css={{ fontSize: "$3" }}>{SCOPE_LABELS[record.pathway]}</Box>
              <Box as="p"><strong>Evidence status:</strong> {record.status === "self-declared" ? "Operator self-declaration" : "Independently assessed (evidence linked)"}</Box>
              <Box as="p"><strong>Disclosure:</strong> {DISCLOSURE_LABELS[record.disclosure]}</Box>
              <Box as="p">Standard version: {record.standardVersion} · Assessment date: {record.assessmentDate}</Box>
              {record.publicSummary && <Box as="p">{record.publicSummary}</Box>}
              {record.assessor && <Box as="p">Assessor: {record.assessor}</Box>}
              {record.evidenceUrl && <a href={record.evidenceUrl} target="_blank" rel="noopener noreferrer">Public supporting evidence ↗</a>}
            </Box>
          ))
        )}
      </Box>
    </Box>
  );
}
