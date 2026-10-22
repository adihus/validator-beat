# ValidatorBeat + ValOS: architecture and roadmap

**Experimental fork. No official ValOS 1 or ValOS 2 qualification currently exists.**

## Principles

- Preserve the original six-slice ValidatorBeat rubric and its six-character share URLs. Resilience stages are not ValOS compliance ratings.
- Make ValidatorBeat a standards-neutral platform where ValOS is the first proposed substantial integration.
- Separate **assessment scope**, **disclosure level**, **operator identity verification**, and **independent control assurance**. None implies the others.
- Never publish private operator security details to Git, including in deleted commits.
- Keep all claims and evidence traceable, versioned, accurately attributed, and subject to appropriate review.

## Architecture

```text
Existing pizza (unchanged)            Future standards adapters
      |                             ValOS 1 / ValOS 2 / others
      |                                        |
      +----------------+-----------------------+
                       |
              Common assessment records
                - standard and version
                - scope and applicability
                - self-reported answers
                - disclosure preference
                - evidence provenance
                       |
              Human-reviewed public submission
                       |
              Static operator registry
                       |
              Future independent assurance and rating data
```

## Current registry implementation

- `data/operators/<slug>.yaml`: public opt-in operator declaration, not secrets.
- `lib/schemas/operator.ts`: strict Zod metadata schema with allowable assurance and disclosure labels.
- `lib/operators/data.ts`: build-time YAML loader and slug uniqueness validation.
- `scripts/validate-operators.ts`: fail-fast validation task.
- `pages/operators/index.tsx` and `components/operators/OperatorDirectory.tsx`: searchable public list.
- `pages/operators/[slug].tsx` and `components/operators/OperatorProfile.tsx`: profile generated for each accepted record.

The directory is intentionally empty. No real operator identities or assurance decisions are fabricated.

## Planned ValOS assessment model

- **ValOS Essential / ValOS 1 (proposed):** limited set of actual essential ValOS controls, with scope and applicability documented, subject to ValOS governance approval.
- **ValOS Comprehensive / ValOS 2 (proposed):** broader applicable controls with specific evidence requirements. Not a substitute for independent assessment.
- **Disclosure:** minimal, summary, and full *safe* disclosure. Screening removes sensitive security evidence before any Git submission.
- **Recognition:** any self-assessment badge must prominently say *self-assessed*, identify the operator, date, standard version, scope and validity. Independent certification needs independently evaluated evidence and separate rules.

## Roadmap

1. Static registry and public-only schema (**this branch**).
2. Consent, public operator-authorisation checks, human publishing review, historical profile amendments.
3. Shared standards-adapter API and versioned ValOS control maps based on the official specification.
4. Actual ValOS Essential / Comprehensive assessment interfaces and scoring according to approved criteria.
5. Safe disclosure preview, attributable self-declaration record, badge issuance and expiry/revocation rules.
6. Independent assessor confirmations, optional other standards, and external analytics integration.

All published operator records are untrusted declarations until operator identity and third-party evidence can be verified. A linked assessment report is not automatically an accepted independent audit.
