import type { GetStaticPaths, GetStaticProps } from "next";
import { OperatorProfile } from "@components/operators/OperatorProfile";
import { SiteHeader } from "@components/layout/SiteHeader";
import { SiteFooter } from "@components/layout/SiteFooter";
import type { OperatorProfile as OperatorProfileData } from "@lib/schemas/operator";
import { readOperatorProfiles } from "@lib/operators/data";

type Props = { operator: OperatorProfileData };
export default function OperatorPage({ operator }: Props) {
  return (
    <>
      <SiteHeader />
      <OperatorProfile operator={operator} />
      <SiteFooter />
    </>
  );
}

export const getStaticPaths: GetStaticPaths = () => ({
  paths: readOperatorProfiles().map((operator) => ({ params: { slug: operator.slug } })),
  fallback: false,
});

export const getStaticProps: GetStaticProps<Props> = ({ params }) => {
  const operator = readOperatorProfiles().find((item) => item.slug === String(params?.slug));
  if (!operator) return { notFound: true };
  return {
    props: {
      operator,
      title: operator.name + " · Operator profile",
      description: "Public self-declarations and assessment evidence for " + operator.name,
    },
  };
};
