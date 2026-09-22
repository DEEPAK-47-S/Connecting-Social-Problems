import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "College & University R&D Hub | Connecting Social Problem",
  description: "Academic Research & Capstone Project Intake for Citizen Challenges",
};

export default function CollegeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
