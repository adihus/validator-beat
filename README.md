# ValidatorBeat + ValOS: Experimental integration fork

> **Experimental fork, not the official ValidatorBeat service.** This is [adihus/validator-beat](https://github.com/adihus/validator-beat), forked from [ObolNetwork/validator-beat](https://github.com/ObolNetwork/validator-beat) to demonstrate how **ValOS self-assessment and assurance pathways** could be integrated into a broader Ethereum validator security platform. Original ValidatorBeat was built by **Obol in partnership with Lido**. Neither the fork nor its proposed pathways represent an endorsed Obol, Lido, or ValOS certification product.

## Purpose

The original [ValidatorBeat](https://validatorbeat.com/) asks six resilience questions, generates a six-slice pizza and a Stage 0–2 result, and provides a shareable URL. This fork explores how to go further:

1. **Public operator registry:** discoverable operator profiles with clearly labelled self-reported and independently assessed evidence.
2. **ValOS assessment pathways:** proposed *ValOS Essential* (working label “ValOS 1”) and *ValOS Comprehensive* (“ValOS 2”), based on the official, versioned ValOS controls. No new qualification is formally approved yet.
3. **Disclosure choices:** minimal (attributed result and scope), summary (pizza plus selected category information), and full safe disclosure (relevant non-sensitive answers). Privacy choice does not change the assessment result.
4. **Scoped badge pathway:** operators could voluntarily publish an attributable, dated ValOS **SELF-ASSESSED** statement. This is distinct from independent external assurance. Badge eligibility, issuance and revocation require future governance approval.
5. **Multi-standard support:** ValOS is the first proposed standards adapter, not the whole platform. Other recognised standards may be integrated with their own applicability, evidence and permission requirements.
6. **Future independent evidence:** independent assessor results and monitoring data could appear alongside operator declarations, with provenance made explicit.

The proposed pathway is:

```text
Existing ValidatorBeat 6-question pizza
  -> Optional ValOS Essential assessment
  -> Optional ValOS Comprehensive assessment
  -> Operator-selected public disclosure
  -> Scoped, explicitly self-assessed recognition
  -> Optional independent ValOS assurance
  -> Public operator profile and downstream security intelligence
```

**This is a proposed product roadmap.** The existing six-question assessment remains operational as an independent feature. Passing its six questions alone does not constitute ValOS certification.

## Current implementation status

| Capability | Status |
| --- | --- |
| Upstream six-question resilience rubric, pizza, share codes, cost-of-failure model | Preserved |
| Searchable static operator directory at `/operators/` | **Foundation implemented; no operators enrolled** |
| Public operator-profile pages built from YAML | **Foundation implemented** |
| Build-time schema validation and example profile | **Foundation implemented** |
| Optional data fields for proposed ValOS scope, disclosure and assessment provenance | **Data model only** |
| Operator identity validation and publishing consent | Not implemented |
| Actual ValOS 1 / 2 control questions, evaluation and eligibility | Not implemented |
| Official badges, independent assurance verification or revocation | Not implemented |
| External standards and ratings integration | Not implemented |

A fictional record exists only in `docs/examples/operator.example.yaml`. It is **not a real operator** and is not published in the registry.

## Key repository locations

- `lib/rubric/`, `lib/assessment/`, `hooks/useAssessment.ts`: existing six-question resilience assessment and Stage 0–2 scoring.
- `pages/operators/`, `components/operators/`: proposed publicly browseable operator registry and profiles.
- `data/operators/`: Git-tracked public operator declarations, currently empty.
- `lib/schemas/operator.ts`: public profile and proposed ValOS record validation.
- `lib/operators/data.ts`, `scripts/validate-operators.ts`: build-time public data loading and validation.
- `docs/VALOS-INTEGRATION.md`: architecture, limitations, and staged implementation roadmap.

## Data protection and evidence

The site is a static Next.js export without a backend. The proposed registry stores **only consented public declarations** in Git. Do not commit private security answers, credentials, IP addresses, signing-key material, sensitive diagrams or other exploitable details, even temporarily, because Git history persists.

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
