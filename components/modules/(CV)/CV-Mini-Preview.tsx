import { CV_MINI_PREVIEW_PROPS } from "@/types"

export function CVMiniPreview({ color }: CV_MINI_PREVIEW_PROPS) {
  return (
    <div
      className="flex h-full w-full flex-col overflow-hidden rounded-l-xl"
      style={{ backgroundColor: color }}
    >
      {/* Header del mini CV */}
      <div className="shrink-0 p-4 pb-2">
        <div className="mb-1.5 h-2 w-20 rounded-full bg-white/70" />
        <div className="mb-1 h-1.5 w-14 rounded-full bg-white/40" />
        <div className="h-1 w-10 rounded-full bg-white/30" />
      </div>
      {/* Body lines */}
      <div className="mx-2 mb-2 flex-1 space-y-1.5 rounded-md bg-white/10 p-2">
        {[75, 55, 85, 60, 70].map((w, i) => (
          <div
            key={i}
            className="h-0.5 rounded-full bg-white/40"
            style={{ width: `${w}%` }}
          />
        ))}
      </div>
    </div>
  )
}
