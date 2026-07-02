import type { Metadata } from "next";
import { companyList } from "@/lib/problems";
import CompaniesBrowser from "@/components/CompaniesBrowser";

export const metadata: Metadata = {
  title: "Companies",
  description: "Browse interview problems by the company that asks them.",
};

export default function CompaniesPage() {
  return (
    <div className="mx-auto max-w-content px-4 py-8 sm:px-6 sm:py-12">
      <h1 className="text-2xl font-bold tracking-tight text-fg sm:text-3xl">
        Browse by company
      </h1>
      <p className="mt-2 text-muted">
        {companyList.length} companies · tap one to see every problem it&apos;s known for.
      </p>
      <div className="mt-8">
        <CompaniesBrowser companies={companyList} />
      </div>
    </div>
  );
}
