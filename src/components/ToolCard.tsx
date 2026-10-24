import Link from "next/link";
import ToolIcon from "./ToolIcon";
import { categoryStyles, type Tool } from "@/lib/toolsData";

export default function ToolCard({ tool }: { tool: Tool }) {
  const style = categoryStyles[tool.category];
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="card group flex h-full flex-col gap-4 p-5 transition duration-200 hover:-translate-y-1 hover:shadow-lift"
    >
      <div className="flex items-start justify-between">
        <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${style.iconBg}`}>
          <ToolIcon name={tool.icon} className="h-6 w-6" />
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
            tool.ready ? "bg-glow-mint/70 text-teal-800" : "bg-glow-peach/70 text-glow-muted"
          }`}
        >
          {tool.ready ? "Live" : "Coming soon"}
        </span>
      </div>
      <div className="flex-1">
        <h3 className="text-base font-semibold leading-snug">{tool.name}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-glow-muted">{tool.description}</p>
      </div>
      <span className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${style.tag}`}>{tool.category}</span>
    </Link>
  );
}
