import { cn } from "@/lib"
import { TEMPLATE_MINI_CARD_PROPS } from "@/types"

export default function TemplateMiniCard({
  onSelect,
  selected,
  template,
}: TEMPLATE_MINI_CARD_PROPS) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border-2 bg-white transition-all",
        selected
          ? "border-[#D85A30] shadow-md shadow-[#D85A30]/10"
          : "border-border/60 hover:border-border"
      )}
    >
      {/* Mini preview del CV */}
      <div
        className="flex h-28 w-full flex-col"
        style={{ backgroundColor: template.color }}
      >
        <div className="shrink-0 p-3 pb-2">
          <div className="mb-1 h-1.5 w-16 rounded-full bg-white/70" />
          <div className="h-1 w-10 rounded-full bg-white/40" />
        </div>
        <div className="mx-2 mb-2 flex-1 space-y-1 rounded-md bg-white/10 p-2">
          {[60, 80, 50, 70].map((w, i) => (
            <div
              key={i}
              className="h-0.5 rounded-full bg-white/40"
              style={{ width: `${w}%` }}
            />
          ))}
        </div>
      </div>

      {/* Label + check */}
      <div className="flex items-center justify-between px-3 py-2">
        <span className="text-xs font-medium text-foreground">
          {template.label}
        </span>
        <div
          className={cn(
            "flex h-4 w-4 items-center justify-center rounded-full border-2 transition-all",
            selected
              ? "border-[#D85A30] bg-[#D85A30]"
              : "border-border/60 bg-transparent"
          )}
        >
          {selected && (
            <svg
              className="h-2.5 w-2.5 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M5 13l4 4L19 7"
              />
            </svg>
          )}
        </div>
      </div>
    </button>
  )
}
