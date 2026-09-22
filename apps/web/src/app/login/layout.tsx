import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In & Create Account | SocialImpact",
  description: "Sign in to SocialImpact to post citizen complaints and track solutions.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
