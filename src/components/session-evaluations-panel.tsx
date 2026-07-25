"use client"

import { useMemo, useState } from "react"

import {
  EvaluationFilters,
  type Filters,
  type TableState,
} from "@/components/evaluation-filters"
import {
  EvaluationsTable,
  type Sort,
  type SortKey,
} from "@/components/evaluations-table"
import { TablePagination } from "@/components/table-pagination"
import type { SessionEvaluation } from "@/lib/session-evaluations"

const EMPTY_FILTERS: Filters = { query: "", from: "", to: "", status: "all" }

export function SessionEvaluationsPanel({
  evaluations,
}: {
  evaluations: SessionEvaluation[]
}) {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [state, setState] = useState<TableState>("ready")
  const [sort, setSort] = useState<Sort>({
    key: "sessionDate",
    direction: "desc",
  })
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  const hasActiveFilters =
    filters.query !== "" ||
    filters.from !== "" ||
    filters.to !== "" ||
    filters.status !== "all"

  const visibleRows = useMemo(() => {
    const query = filters.query.trim().toLowerCase()

    const filtered = evaluations.filter((row) => {
      if (query && !row.studentName.toLowerCase().includes(query)) return false
      if (filters.from && row.sessionDate < filters.from) return false
      if (filters.to && row.sessionDate > filters.to) return false
      if (filters.status !== "all" && row.status !== filters.status) return false
      return true
    })

    const factor = sort.direction === "asc" ? 1 : -1

    return filtered.sort((a, b) => {
      if (sort.key === "score") {
        // Pending rows (null score) always sort last.
        if (a.score === null && b.score === null) return 0
        if (a.score === null) return 1
        if (b.score === null) return -1
        return (a.score - b.score) * factor
      }

      return a[sort.key].localeCompare(b[sort.key]) * factor
    })
  }, [evaluations, filters, sort])

  const isReady = state === "ready"
  const totalRows = visibleRows.length
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize))

  // Derived during render so a shrinking result set can never leave the view
  // stranded on an out-of-range page.
  const safePage = Math.min(page, pageCount)
  const start = (safePage - 1) * pageSize
  const pageRows = visibleRows.slice(start, start + pageSize)

  const handleSortChange = (key: SortKey) => {
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: key === "studentName" ? "asc" : "desc" },
    )
    setPage(1)
  }

  const handleFiltersChange = (next: Filters) => {
    setFilters(next)
    setPage(1)
  }

  const handleReset = () => {
    setFilters(EMPTY_FILTERS)
    setPage(1)
  }

  return (
    <section
      aria-label="Session evaluations"
      className="overflow-hidden rounded-lg border border-border bg-card shadow-sm"
    >
      <EvaluationFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        state={state}
        onStateChange={setState}
        hasActiveFilters={hasActiveFilters}
        onReset={handleReset}
        resultCount={totalRows}
      />

      <EvaluationsTable
        rows={pageRows}
        state={state}
        sort={sort}
        onSortChange={handleSortChange}
        hasActiveFilters={hasActiveFilters}
        onReset={handleReset}
        onRetry={() => setState("ready")}
      />

      <TablePagination
        page={isReady ? safePage : 1}
        pageCount={isReady ? pageCount : 1}
        pageSize={pageSize}
        totalRows={isReady ? totalRows : 0}
        rangeStart={totalRows === 0 ? 0 : start + 1}
        rangeEnd={Math.min(start + pageSize, totalRows)}
        disabled={!isReady || totalRows === 0}
        onPageChange={(next) => setPage(Math.min(Math.max(next, 1), pageCount))}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
      />
    </section>
  )
}
