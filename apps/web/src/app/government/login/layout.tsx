import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administrative Sign In — Government & Municipal Portal | SocialImpact",
  description: "Administrative access for municipal authorities, civic commissioners & scheme directors",
};

export default function GovernmentLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
