import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Industry & CSR Innovation Partner Hub | Connecting Social Problem",
  description: "Enterprise CSR Grants, Scaling & Pilot Manufacturing for Verified Social Challenges",
};

export default function IndustryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
