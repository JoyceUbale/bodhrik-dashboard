"use client"

import { CircleCheck, CircleDashed, CircleX, TriangleAlert } from "lucide-react"
import { STATUS_LABELS, type EvaluationStatus } from "@/lib/session-evaluations"

const STATUS_STYLES: Record<
  EvaluationStatus,
  { className: string; Icon: typeof CircleCheck }
> = {
  passed: {
    className: "bg-emerald-500/10 text-emerald-400 border-emerald-500/25",
    Icon: CircleCheck,
  },
  "needs-review": {
    className: "bg-amber-500/10 text-amber-400 border-amber-500/25",
    Icon: TriangleAlert,
  },
  failed: {
    className: "bg-rose-500/10 text-rose-400 border-rose-500/25",
    Icon: CircleX,
  },
  pending: {
    className: "bg-muted text-muted-foreground border-border",
    Icon: CircleDashed,
  },
}

export function StatusBadge({ status }: { status: EvaluationStatus }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.pending
  const { className, Icon } = style

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap ${className}`}
    >
      <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      {STATUS_LABELS[status] ?? "Pending"}
    </span>
  )
}