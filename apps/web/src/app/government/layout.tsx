import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Government & Municipal Authority Hub | SocialImpact",
  description: "Official Municipal Sanctions, Scheme Alignment & Ground Grievance Verification",
};

export default function GovernmentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
