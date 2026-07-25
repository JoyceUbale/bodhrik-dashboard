"use client"

import { useMemo, useState } from "react"
import { EvaluationFilters, type Filters } from "@/components/evaluation-filters"
import { EvaluationsTable, type Sort, type SortKey } from "@/components/evaluations-table"
import { TablePagination } from "@/components/table-pagination"
import { useSessionEvaluations } from "@/lib/use-session-evaluations"

const EMPTY_FILTERS: Filters = { query: "", from: "", to: "", status: "all" }

export function SessionEvaluationsPanel() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [sort, setSort] = useState<Sort>({ key: "sessionDate", direction: "desc" })
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  const { evaluations, isLoading, isError, mutate } = useSessionEvaluations(filters)

  const hasActiveFilters =
    filters.query !== "" ||
    filters.from !== "" ||
    filters.to !== "" ||
    filters.status !== "all"

  const sortedRows = useMemo(() => {
    const factor = sort.direction === "asc" ? 1 : -1
    return [...evaluations].sort((a, b) => {
      if (sort.key === "score") {
        if (a.score === null) return 1
        if (b.score === null) return -1
        return (a.score - b.score) * factor
      }
      if (sort.key === "sessionDate") {
        return a.sessionDate.localeCompare(b.sessionDate) * factor
      }
      if (sort.key === "studentName") {
        return a.studentName.localeCompare(b.studentName) * factor
      }
      return 0
    })
  }, [evaluations, sort])

  const totalRows = sortedRows.length
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize))
  const safePage = Math.min(page, pageCount)
  const start = (safePage - 1) * pageSize
  const pageRows = sortedRows.slice(start, start + pageSize)

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card shadow-sm">
      <EvaluationFilters
        filters={filters}
        onFiltersChange={(next) => {
          setFilters(next)
          setPage(1)
        }}
        hasActiveFilters={hasActiveFilters}
        onReset={() => {
          setFilters(EMPTY_FILTERS)
          setPage(1)
        }}
        resultCount={totalRows}
      />

      <EvaluationsTable
        rows={pageRows}
        isLoading={isLoading}
        isError={isError}
        sort={sort}
        onSortChange={(key: SortKey) => {
          setSort((current) =>
            current.key === key
              ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
              : { key, direction: key === "studentName" ? "asc" : "desc" }
          )
          setPage(1)
        }}
        hasActiveFilters={hasActiveFilters}
        onReset={() => {
          setFilters(EMPTY_FILTERS)
          setPage(1)
        }}
        onRetry={() => mutate()}
      />

      <TablePagination
        page={safePage}
        pageCount={pageCount}
        pageSize={pageSize}
        totalRows={totalRows}
        rangeStart={totalRows === 0 ? 0 : start + 1}
        rangeEnd={Math.min(start + pageSize, totalRows)}
        disabled={isLoading || totalRows === 0}
        onPageChange={(next) => setPage(Math.min(Math.max(next, 1), pageCount))}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
      />
    </section>
  )
}