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

// Helper function to safely read the score directly from SessionEvaluation
function getAverageScore(row: SessionEvaluation): number | null {
  return row.score
}

// Helper function to extract YYYY-MM-DD format from sessionDate
function getSessionDate(row: SessionEvaluation): string {
  const rawDate = row.sessionDate || ""
  return rawDate ? rawDate.split("T")[0] : ""
}

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
      const rowDate = getSessionDate(row)

      if (query && !row.studentName.toLowerCase().includes(query)) return false
      if (filters.from && rowDate < filters.from) return false
      if (filters.to && rowDate > filters.to) return false
      if (filters.status !== "all" && row.status !== filters.status) return false
      return true
    })

    const factor = sort.direction === "asc" ? 1 : -1

    return filtered.sort((a, b) => {
      if (sort.key === "score") {
        const scoreA = getAverageScore(a)
        const scoreB = getAverageScore(b)

        if (scoreA === null && scoreB === null) return 0
        if (scoreA === null) return 1
        if (scoreB === null) return -1
        return (scoreA - scoreB) * factor
      }

      if (sort.key === "sessionDate") {
        const dateA = getSessionDate(a)
        const dateB = getSessionDate(b)
        return dateA.localeCompare(dateB) * factor
      }

      if (sort.key === "studentName") {
        return a.studentName.localeCompare(b.studentName) * factor
      }

      return 0
    })
  }, [evaluations, filters, sort])

  const isReady = state === "ready"
  const totalRows = visibleRows.length
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize))

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