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

export type SortKey = "studentName" | "sessionDate" | "score"
export type SortDirection = "asc" | "desc"
export type Sort = { key: SortKey; direction: SortDirection }

/**
 * What the table body should render. Derived from the fetch lifecycle and the
 * response payload — never set by hand.
 */
export type TableView =
  | "loading"
  | "error"
  /** The system holds zero evaluations at all. */
  | "no-data"
  /** Evaluations exist, but none match the active filters. */
  | "no-results"
  | "rows"

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
  view: TableView
  errorMessage?: string
  sort: Sort
  onSortChange: (key: SortKey) => void
  onReset: () => void
  onRetry: () => void
  /** Skeleton row count, kept stable across transitions to avoid layout jumps. */
  skeletonRows?: number
}

export function EvaluationsTable({
  rows,
  view,
  errorMessage,
  sort,
  onSortChange,
  onReset,
  onRetry,
  skeletonRows = 6,
}: Props) {
  // Sorting is meaningless unless there are rows to reorder.
  const sortingDisabled = view !== "rows"

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
                      disabled={sortingDisabled}
                      className={`group inline-flex items-center gap-1.5 rounded-sm uppercase transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:text-muted-foreground ${
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

        <tbody aria-busy={view === "loading"}>
          {view === "loading" ? <LoadingRows count={skeletonRows} /> : null}

          {view === "error" ? (
            <StateRow
              Icon={TriangleAlert}
              tone="danger"
              title="Couldn’t load evaluations"
              description={
                errorMessage ??
                "The request to the evaluations service failed. Check your connection and try again."
              }
              action={
                <button
                  type="button"
                  onClick={onRetry}
                  className="inline-flex items-center gap-2 rounded-md bg-primary px-3.5 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
                >
                  <RotateCcw aria-hidden="true" className="size-4" />
                  Retry
                </button>
              }
            />
          ) : null}

          {view === "no-data" ? (
            <StateRow
              Icon={ClipboardList}
              tone="muted"
              title="No evaluations yet"
              description="Once coaches submit their first session evaluations, they’ll appear here."
            />
          ) : null}

          {view === "no-results" ? (
            <StateRow
              Icon={SearchX}
              tone="muted"
              title="No matching evaluations"
              description="No evaluations match your search criteria. Try clearing filters."
              action={
                <button
                  type="button"
                  onClick={onReset}
                  className="inline-flex items-center gap-2 rounded-md border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                >
                  <RotateCcw aria-hidden="true" className="size-4" />
                  Reset filters
                </button>
              }
            />
          ) : null}

          {view === "rows"
            ? rows.map((row) => (
                <tr
                  key={row.id}
                  className="border-b border-border last:border-0 transition-colors hover:bg-muted/50"
                >
                  <td className={CELL}>
                    <div className="flex items-center gap-3">
                      <span
                        aria-hidden="true"
                        className="grid size-9 shrink-0 place-items-center rounded-full bg-primary-muted text-xs font-semibold text-primary"
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
                    <span className="inline-flex rounded-md border border-border bg-muted px-2 py-1 text-xs text-muted-foreground">
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
    score >= 80 ? "text-positive" : score >= 60 ? "text-accent" : "text-danger"

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
          className={`block h-full rounded-full ${
            score >= 80
              ? "bg-positive"
              : score >= 60
                ? "bg-accent"
                : "bg-danger"
          }`}
          style={{ width: `${score}%` }}
        />
      </span>
    </span>
  )
}

function LoadingRows({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <tr key={index} className="border-b border-border last:border-0">
          <td className={CELL}>
            <div className="flex items-center gap-3">
              <span className="shimmer size-9 shrink-0 rounded-full" />
              <span className="flex flex-col gap-2">
                <span className="shimmer block h-3.5 w-32 rounded-sm" />
                <span className="shimmer block h-2.5 w-40 rounded-sm" />
              </span>
            </div>
            {index === 0 ? (
              <span className="sr-only">Loading evaluations…</span>
            ) : null}
          </td>
          <td className={CELL}>
            <span className="flex flex-col gap-2">
              <span className="shimmer block h-3.5 w-24 rounded-sm" />
              <span className="shimmer block h-2.5 w-20 rounded-sm" />
            </span>
          </td>
          <td className={`${CELL} hidden lg:table-cell`}>
            <span className="shimmer block h-3.5 w-24 rounded-sm" />
          </td>
          <td className={`${CELL} hidden md:table-cell`}>
            <span className="shimmer block h-6 w-28 rounded-md" />
          </td>
          <td className={CELL}>
            <span className="shimmer ml-auto block h-3.5 w-14 rounded-sm" />
          </td>
          <td className={CELL}>
            <span className="shimmer block h-7 w-24 rounded-full" />
          </td>
        </tr>
      ))}
    </>
  )
}

function StateRow({
  Icon,
  tone,
  title,
  description,
  action,
}: {
  Icon: typeof TriangleAlert
  tone: "danger" | "muted"
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <tr>
      <td colSpan={COLUMNS.length} className="px-5 py-16">
        <div className="mx-auto flex max-w-sm flex-col items-center gap-3 text-center">
          <span
            className={`grid size-11 place-items-center rounded-full ${
              tone === "danger"
                ? "bg-danger-muted text-danger"
                : "bg-muted text-muted-foreground"
            }`}
          >
            <Icon aria-hidden="true" className="size-5" />
          </span>
          <span className="flex flex-col gap-1">
            <span className="text-sm font-semibold text-foreground">{title}</span>
            <span className="text-sm leading-relaxed text-muted-foreground">
              {description}
            </span>
          </span>
          {action}
        </div>
      </td>
    </tr>
  )
}
