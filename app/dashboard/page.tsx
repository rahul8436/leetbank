import type { Metadata } from "next";
import { metaList } from "@/lib/problems";
import Dashboard from "@/components/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Track your interview prep progress across all 285 problems.",
};

export default function DashboardPage() {
  return <Dashboard problems={metaList} />;
}
