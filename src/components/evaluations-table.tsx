"use client"

import Link from "next/link"
import {
  ChevronDown,
  ChevronUp,
  ChevronsUpDown,
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
  isLoading: boolean
  isError: boolean
  sort: Sort
  onSortChange: (key: SortKey) => void
  hasActiveFilters: boolean
  onReset: () => void
  onRetry: () => void
}

export function EvaluationsTable({
  rows,
  isLoading,
  isError,
  sort,
  onSortChange,
  hasActiveFilters,
  onReset,
  onRetry,
}: Props) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left">
        <thead>
          <tr className="border-b border-border bg-muted/60">
            {COLUMNS.map((column) => {
              const isSorted = column.key !== null && sort.key === column.key

              return (
                <th
                  key={column.label}
                  scope="col"
                  className={`px-5 py-3 text-xs font-semibold tracking-wide text-muted-foreground uppercase ${
                    column.align === "right" ? "text-right" : ""
                  } ${column.className ?? ""}`}
                >
                  {column.key ? (
                    <button
                      type="button"
                      onClick={() => onSortChange(column.key as SortKey)}
                      className="group inline-flex items-center gap-1.5 rounded-sm uppercase transition-colors hover:text-foreground"
                    >
                      {column.label}
                      {isSorted ? (
                        sort.direction === "asc" ? (
                          <ChevronUp className="size-3.5" />
                        ) : (
                          <ChevronDown className="size-3.5" />
                        )
                      ) : (
                        <ChevronsUpDown className="size-3.5 opacity-40 group-hover:opacity-100" />
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
          {/* 1. ERROR STATE */}
          {isError ? (
            <tr>
              <td colSpan={6} className="p-12 text-center">
                <div className="flex flex-col items-center gap-3 text-rose-400">
                  <TriangleAlert className="size-8" />
                  <p className="text-sm font-medium">Failed to load session evaluations.</p>
                  <button
                    onClick={onRetry}
                    className="inline-flex items-center gap-2 rounded-md bg-rose-500/10 px-3 py-1.5 text-xs font-medium text-rose-400 hover:bg-rose-500/20"
                  >
                    <RotateCcw className="size-3.5" />
                    Try again
                  </button>
                </div>
              </td>
            </tr>
          ) : isLoading ? (
            /* 2. LOADING STATE (SKELETON ROWS) */
            Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx} className="border-b border-border">
                <td className={CELL}>
                  <div className="flex items-center gap-3">
                    <div className="size-9 animate-pulse rounded-full bg-muted" />
                    <div className="space-y-1.5">
                      <div className="h-4 w-28 animate-pulse rounded bg-muted" />
                      <div className="h-3 w-36 animate-pulse rounded bg-muted" />
                    </div>
                  </div>
                </td>
                <td className={CELL}>
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                </td>
                <td className={`${CELL} hidden lg:table-cell`}>
                  <div className="h-4 w-20 animate-pulse rounded bg-muted" />
                </td>
                <td className={`${CELL} hidden md:table-cell`}>
                  <div className="h-4 w-24 animate-pulse rounded bg-muted" />
                </td>
                <td className={CELL}>
                  <div className="ml-auto h-4 w-12 animate-pulse rounded bg-muted" />
                </td>
                <td className={CELL}>
                  <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
                </td>
              </tr>
            ))
          ) : rows.length === 0 ? (
            /* 3. EMPTY STATE */
            <tr>
              <td colSpan={6} className="p-12 text-center">
                <div className="flex flex-col items-center gap-3 text-muted-foreground">
                  <SearchX className="size-8 opacity-50" />
                  <p className="text-sm font-medium">
                    No evaluations match your search criteria.
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={onReset}
                      className="inline-flex items-center gap-1.5 rounded-md bg-muted px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted/80"
                    >
                      <RotateCcw className="size-3.5" />
                      Reset filters
                    </button>
                  )}
                </div>
              </td>
            </tr>
          ) : (
            /* 4. READY STATE */
            rows.map((row) => (
              <tr
                key={row.id}
                className="group border-b border-border last:border-0 transition-colors hover:bg-muted/50"
              >
                <td className={CELL}>
                  <div className="flex items-center gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-teal-500/10 text-xs font-semibold text-teal-400">
                      {initialsOf(row.studentName)}
                    </span>
                    <span className="flex min-w-0 flex-col">
                      <Link
                        href={`/sessions/${row.id}`}
                        className="font-medium text-foreground transition-colors group-hover:text-teal-400 hover:underline"
                      >
                        {row.studentName}
                      </Link>
                      <span className="truncate text-xs text-muted-foreground">
                        {row.studentEmail}
                      </span>
                    </span>
                  </div>
                </td>

                <td className={CELL}>
                  <Link href={`/sessions/${row.id}`} className="flex flex-col">
                    <span className="tabular text-foreground">
                      {formatSessionDate(row.sessionDate)}
                    </span>
                    <span className="tabular text-xs text-muted-foreground">
                      {row.durationMins} min · {row.id}
                    </span>
                  </Link>
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
          )}
        </tbody>
      </table>
    </div>
  )
}

function ScoreCell({ score }: { score: number | null }) {
  if (score === null) return <span className="text-sm text-muted-foreground">—</span>
  const tone = score >= 80 ? "text-emerald-400" : score >= 60 ? "text-amber-400" : "text-rose-400"
  return (
    <span className={`tabular font-mono text-sm font-semibold ${tone}`}>
      {score}/100
    </span>
  )
}