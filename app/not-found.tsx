import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto grid min-h-[60vh] max-w-content place-items-center px-4 text-center">
      <div>
        <div className="text-5xl">🔍</div>
        <h1 className="mt-4 text-2xl font-bold text-fg">Page not found</h1>
        <p className="mt-2 text-muted">
          That problem or page doesn&apos;t exist in the bank.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-soft"
        >
          Browse all problems
        </Link>
      </div>
    </div>
  );
}
