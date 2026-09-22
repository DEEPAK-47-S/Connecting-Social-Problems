import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Faculty & Lab Sign In — College Portal | Connecting Social Problem",
  description: "Academic Sign In for College Research Labs & Student Teams",
};

export default function CollegeLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
