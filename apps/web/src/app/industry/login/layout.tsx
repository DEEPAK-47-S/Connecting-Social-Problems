import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Enterprise Sign In — Industry Partner Hub | SocialImpact",
  description: "Sign in to the SocialImpact Industry & CSR Innovation Hub",
};

export default function IndustryLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
