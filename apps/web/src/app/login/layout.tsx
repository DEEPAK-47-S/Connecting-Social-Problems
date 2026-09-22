import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In & Create Account | Connecting Social Problem",
  description: "Sign in to Connecting Social Problem to post citizen complaints and track solutions.",
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
