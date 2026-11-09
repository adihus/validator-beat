# ValidatorBeat + ValOS: Experimental integration fork

> **Experimental fork, not the official ValidatorBeat service.** This is forked from [ObolNetwork/validator-beat](https://github.com/ObolNetwork/validator-beat) to demonstrate how **ValOS self-assessment and assurance pathways** could be integrated into a broader Ethereum validator security platform.

## Purpose

This fork of the original [ValidatorBeat](https://validatorbeat.com/) explores how to substantially and meaningfully integrate ValOS into ValidatorBeat, and proposes areas to extend ValidatorBeat:

1. **Public operator registry:** discoverable operator profiles with clearly labelled self-reported and independently assessed evidence.
2. **ValOS assessment pathways:** an interactive prototype offers **ValOS Lite** and **ValOS Full**, with example questions and illustrative grades. The intended production pathways must be derived from official, versioned ValOS controls and approved through the relevant governance process.
3. **Disclosure choices:** minimal (badge, grade, scope and status), summary (selected category information), and detailed (safe, non-sensitive answers). The operator also chooses whether to appear in the public directory. Disclosure does not affect the assessment grade.
4. **Six-month wallet-linked badge concept:** after either pathway, the prototype simulates a rated, explicitly **SELF-ASSESSED** badge tied to a supplied Ethereum address, with issue and expiry dates six months apart. Reassessment generates a new demo record referring to the previous one. Real immutable issuance, wallet proof, status tracking and governance approval are future work.
5. **Multi-standard support so ValidatorBeat remains standards-agnostic:** ValOS is the first proposed standards adapter. Other recognised standards may be integrated with their own applicability, evidence and permission requirements.
6. **Future independent evidence:** independent assessor results and monitoring data could appear alongside operator declarations, with provenance made explicit.

The proposed pathway is:

```text
Existing ValidatorBeat 6-question pizza
  -> Choose ValOS Lite OR ValOS Full
  -> Answer assessment questions and see an illustrative A–D rating
  -> Enter operator name and Ethereum address
  -> Select minimal / summary / detailed disclosure and opt-in listing
  -> Simulated six-month, wallet-linked SELF-ASSESSED badge
  -> Public-facing demo directory and operator profile
  -> Future on-chain verification and independent ValOS assurance
```

**This is a proposed product roadmap.** The existing six-question assessment remains operational as an independent feature. Passing its six questions alone does not constitute ValOS certification.

## Interactive mockup: `/valos-demo/`

The new [ValOS assessment prototype](pages/valos-demo.tsx) is implemented as a **native Next.js page** linked from the shared site header. It follows ValidatorBeat's existing cream/sage theme tokens, rather than embedding a disconnected HTML design. The existing six-slice assessment, share-code pages, methodology and cost-of-failure model are unchanged.

**Try the prototype:** run `yarn dev`, open `/valos-demo/`, select **Lite** (6 example questions) or **Full** (12 example questions), complete the questionnaire, review the A–D demo grade, then enter an operator name and an Ethereum address. Choose **minimal**, **summary** or **detailed** disclosure, toggle directory listing, and simulate badge issuance. The interface displays the issued badge/profile, a six-month expiry date and a demo record ID. The **Operator directory** tab shows fictional sample profiles plus listed badges created during the current browser session. You can start another assessment to issue a new mock badge with a reference to the previous badge.

**Scope of the mockup:** the sample questionnaire is *not* an official mapping of the ValOS specification; A–D scoring is illustrative, not a recognized certification or independent audit. The demo does not connect a wallet, verify ownership, mint a token, write to a blockchain, persist answers or badge records across refreshes, or synchronize the existing YAML-based `/operators/` directory. Example operator records are fictional. The Git-tracked registry remains separate from the demo directory.

**Proposed production badge semantics:** an issued on-chain attestation would be immutable and associated with a cryptographically verified operator wallet. The effective active/expired/superseded/revoked status would be determined by verification logic over the attestation history; updating an assessment should issue a *new* record, not mutate the old one. The exact rating rubric, validity and revocation policies, wallet identity model, public disclosures and issuance authority require approval before launch.

## Current implementation status

| Capability | Status |
| --- | --- |
| Upstream six-question resilience rubric, pizza, share codes, cost-of-failure model | Preserved |
| Searchable static operator directory at `/operators/` | **Foundation implemented; no operators enrolled** |
| Public operator-profile pages built from YAML | **Foundation implemented** |
| Build-time schema validation and example profile | **Foundation implemented** |
| Optional data fields for proposed ValOS scope, disclosure and assessment provenance | **Data model only** |
| Operator identity validation and publishing consent | Not implemented |
| ValOS Lite / Full interactive UI with 6 / 12 example questions | **Demo implemented** at `/valos-demo/` |
| Example A–D rating and results view | **Demo implemented**, not an official ValOS score |
| Wallet address field, six-month demo badge and reassessment history | **Browser-only simulation**; no wallet signature or on-chain transaction |
| Demo disclosure choices and fictional searchable operator list | **Demo implemented**, separate from `/operators/` |
| Official ValOS control mapping, evaluation and badge eligibility | Not implemented |
| Official badges, independent assurance verification or revocation | Not implemented |
| External standards and ratings integration | Not implemented |

A fictional record exists only in `docs/examples/operator.example.yaml`. It is **not a real operator** and is not published in the registry.

## Key repository locations

- `lib/rubric/`, `lib/assessment/`, `hooks/useAssessment.ts`: existing six-question resilience assessment and Stage 0–2 scoring.
- `pages/operators/`, `components/operators/`: proposed publicly browseable operator registry and profiles.
- `data/operators/`: Git-tracked public operator declarations, currently empty.
- `lib/schemas/operator.ts`: public profile and proposed ValOS record validation.
- `lib/operators/data.ts`, `scripts/validate-operators.ts`: build-time public data loading and validation.
- `pages/valos-demo.tsx`: interactive ValOS Lite / Full prototype, example scoring, six-month demo badge, disclosure selection, and fictional operator directory.
- `components/layout/SiteHeader.tsx`: header navigation to `/valos-demo/`.
- `docs/VALOS-INTEGRATION.md`: architecture, limitations, and staged implementation roadmap.

## Data protection and evidence

The site is a static Next.js export without a backend. The new prototype keeps its assessment answers and mock badge records in browser component state only; they are not persisted and disappear after a refresh. The proposed registry stores **only consented public declarations** in Git. Do not commit private security answers, credentials, IP addresses, signing-key material, sensitive diagrams or other exploitable details, even temporarily, because Git history persists.

A successful schema check is **not** a validation of operator identity or a security audit. The existing data model allows metadata for independently assessed reports, but formal verifier confirmation and governance workflows **must exist before any such claims are publicly accepted**.

Operators should be able to use the original pizza without registering. Unlisted operators must not be assumed insecure.

## Development

Node.js 24+ and Yarn 1:

```bash
yarn install --frozen-lockfile
yarn dev
yarn test
yarn lint
yarn validate-operators
yarn build
```

The fork should be deployed under its **own GitHub Pages project URL**, such as `https://adihus.github.io/validator-beat/`, never the upstream `validatorbeat.com` domain. Set `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_BASE_PATH` accordingly. The feature branch does not deploy automatically.

## Credits

- Original [ValidatorBeat](https://github.com/ObolNetwork/validator-beat), built by [Obol](https://obol.org/) in partnership with [Lido](https://lido.fi/).
- [ValOS specification](https://lidofinance.github.io/valos/valos-spec.html), [ValOS repository](https://github.com/lidofinance/valos).
- This independent fork is an experimental exploration of substantial ValOS self-assessment integration into a standards-neutral platform. Product ownership and the right to issue official ValOS badges remain separate governance matters.

The original repository's Apache-2.0 software licence and attribution are retained.
