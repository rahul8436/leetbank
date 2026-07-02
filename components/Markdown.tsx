import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

/**
 * Renders trusted markdown coming from the dataset (descriptions, strategy text).
 * Code fences are rendered as pre-formatted blocks; the highlight.js theme in
 * globals styles anything with the `hljs` class, but plain fences read fine too.
 */
export default function Markdown({ children }: { children: string }) {
  return (
    <div className="prose max-w-none dark:prose-invert prose-pre:bg-[#0d0d14] prose-pre:text-gray-200 prose-pre:border prose-pre:border-border prose-headings:font-semibold">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}
