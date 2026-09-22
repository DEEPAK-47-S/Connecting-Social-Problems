import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enterprise Sign In — Industry Partner Hub | Connecting Social Problem",
  description: "Sign in to the Connecting Social Problem Industry & CSR Innovation Hub",
};

export default function IndustryLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
