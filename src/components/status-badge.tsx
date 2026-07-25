import { CircleCheck, CircleDashed, CircleX, TriangleAlert } from "lucide-react"

import { STATUS_LABELS, type EvaluationStatus } from "@/lib/session-evaluations"

const STATUS_STYLES: Record<
  EvaluationStatus,
  { className: string; Icon: typeof CircleCheck }
> = {
  passed: {
    className: "bg-positive-muted text-positive border-positive/25",
    Icon: CircleCheck,
  },
  "needs-review": {
    className: "bg-accent-muted text-accent border-accent/25",
    Icon: TriangleAlert,
  },
  failed: {
    className: "bg-danger-muted text-danger border-danger/25",
    Icon: CircleX,
  },
  pending: {
    className: "bg-muted text-muted-foreground border-border",
    Icon: CircleDashed,
  },
}

export function StatusBadge({ status }: { status: EvaluationStatus }) {
  const { className, Icon } = STATUS_STYLES[status]

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium whitespace-nowrap ${className}`}
    >
      <Icon aria-hidden="true" className="size-3.5 shrink-0" />
      {STATUS_LABELS[status]}
    </span>
  )
}
