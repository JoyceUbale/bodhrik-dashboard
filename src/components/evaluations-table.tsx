"use client"

import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
  ClipboardList,
  RotateCcw,
  SearchX,
  TriangleAlert,
} from "lucide-react"

import { StatusBadge } from "@/components/status-badge"
import {
  formatSessionDate,
  initialsOf,
  type SessionEvaluation,
} from "@/lib/session-evaluations"
import type { TableState } from "@/components/evaluation-filters"

export type SortKey = "studentName" | "sessionDate" | "score"
export type SortDirection = "asc" | "desc"
export type Sort = { key: SortKey; direction: SortDirection }

const COLUMNS: {
  key: SortKey | null
  label: string
  className?: string
  align?: "right"
}[] = [
  { key: "studentName", label: "Student" },
  { key: "sessionDate", label: "Session date" },
  { key: null, label: "Evaluator", className: "hidden lg:table-cell" },
  { key: null, label: "Focus area", className: "hidden md:table-cell" },
  { key: "score", label: "Score", align: "right" },
  { key: null, label: "Status" },
]

const CELL = "px-5 py-4 align-middle text-sm"

type Props = {
  rows: SessionEvaluation[]
  state: TableState
  sort: Sort
  onSortChange: (key: SortKey) => void
  hasActiveFilters: boolean
  onReset: () => void
  onRetry: () => void
}

export function EvaluationsTable({
  rows,
  state,
  sort,
  onSortChange,
  hasActiveFilters,
  onReset,
  onRetry,
}: Props) {
  const showBody = state === "ready" && rows.length > 0

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <caption className="sr-only">
          Session evaluations, sortable by student, session date, and score.
        </caption>

        <thead>
          <tr className="border-b border-border bg-muted/60">
            {COLUMNS.map((column) => {
              const isSorted = column.key !== null && sort.key === column.key
              const ariaSort = isSorted
                ? sort.direction === "asc"
                  ? "ascending"
                  : "descending"
                : undefined

              return (
                <th
                  key={column.label}
                  scope="col"
                  aria-sort={ariaSort}
                  className={`px-5 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase ${
                    column.align === "right" ? "text-right" : ""
                  } ${column.className ?? ""}`}
                >
                  {column.key ? (
                    <button
                      type="button"
                      onClick={() => onSortChange(column.key as SortKey)}
                      className={`group inline-flex items-center gap-1.5 rounded-sm uppercase transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 ${
                        isSorted ? "text-foreground" : ""
                      } ${column.align === "right" ? "flex-row-reverse" : ""}`}
                    >
                      {column.label}
                      {isSorted ? (
                        sort.direction === "asc" ? (
                          <ChevronUp aria-hidden="true" className="size-3.5" />
                        ) : (
                          <ChevronDown aria-hidden="true" className="size-3.5" />
                        )
                      ) : (
                        <ChevronsUpDown
                          aria-hidden="true"
                          className="size-3.5 opacity-40 transition-opacity group-hover:opacity-100"
                        />
                      )}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              )
            })}
          </tr>
        </thead>

        <tbody>
          {showBody
            ? rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border last:border-0 transition-colors hover:bg-muted/50"
                >
                  <td className={CELL}>
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="grid size-9 shrink-0 place-items-center rounded-full bg-teal-500/10 text-xs font-semibold text-teal-400"
                      >
                        {initialsOf(row.studentName)}
                      </span>
                      <span className="flex min-w-0 flex-col">
                        <span className="font-medium text-foreground">
                          {row.studentName}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {row.studentEmail}
                        </span>
                      </span>
                    </div>
                  </td>

                  <td className={CELL}>
                    <span className="flex flex-col">
                      <span className="tabular text-foreground">
                        {formatSessionDate(row.sessionDate)}
                      </span>
                      <span className="tabular text-xs text-muted-foreground">
                        {row.durationMins} min · {row.id}
                      </span>
                    </span>
                  </td>

                  <td className={`${CELL} hidden text-muted-foreground lg:table-cell`}>
                    {row.evaluator}
                  </td>

                  <td className={`${CELL} hidden md:table-cell`}>
                    <span className="inline-flex rounded-md border border-border bg-muted/50 px-2 py-1 text-xs text-muted-foreground">
                      {row.focusArea}
                    </span>
                  </td>

                  <td className={`${CELL} text-right`}>
                    <ScoreCell score={row.score} />
                  </td>

                  <td className={CELL}>
                    <StatusBadge status={row.status} />
                  </td>
                </tr>
              ))
            : null}
        </tbody>
      </table>
    </div>
  )
}

function ScoreCell({ score }: { score: number | null }) {
  if (score === null) {
    return <span className="text-sm text-muted-foreground">—</span>
  }

  const tone =
    score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-rose-400"
  const barBg =
    score >= 80 ? "bg-emerald-400" : score >= 60 ? "bg-amber-400" : "bg-rose-400"

  return (
    <span className="inline-flex flex-col items-end gap-1.5">
      <span className={`tabular font-mono text-sm font-semibold ${tone}`}>
        {score}
        <span className="text-xs font-normal text-muted-foreground">/100</span>
      </span>
      <span
        aria-hidden="true"
        className="h-1 w-16 overflow-hidden rounded-full bg-muted"
      >
        <span
          className={`block h-full rounded-full ${barBg}`}
          style={{ width: `${score}%` }}
        />
      </span>
    </span>
  )
}