import type { GetStaticProps } from "next";
import { OperatorDirectory } from "@components/operators/OperatorDirectory";
import { SiteHeader } from "@components/layout/SiteHeader";
import { SiteFooter } from "@components/layout/SiteFooter";
import type { OperatorProfile } from "@lib/schemas/operator";
import { readOperatorProfiles } from "@lib/operators/data";

type Props = { operators: OperatorProfile[] };
export default function OperatorsPage({ operators }: Props) {
  return (
    <>
      <SiteHeader />
      <OperatorDirectory operators={operators} />
      <SiteFooter />
    </>
  );
}

export const getStaticProps: GetStaticProps<Props> = () => ({
  props: {
    operators: readOperatorProfiles(),
    title: "Operator registry (experimental)",
    description: "Browse public operator declarations and their security evidence. No self-assessment is an independent certification.",
  },
});
