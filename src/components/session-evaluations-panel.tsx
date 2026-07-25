"use client"

import { useState } from "react"

import { EvaluationFilters, type Filters } from "@/components/evaluation-filters"
import {
  EvaluationsTable,
  type Sort,
  type SortKey,
  type TableView,
} from "@/components/evaluations-table"
import { TablePagination } from "@/components/table-pagination"
import {
  SEARCH_DEBOUNCE_MS,
  useDebouncedValue,
  useSessionEvaluations,
} from "@/lib/use-session-evaluations"

const EMPTY_FILTERS: Filters = { query: "", from: "", to: "", status: "all" }

export function SessionEvaluationsPanel() {
  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS)
  const [sort, setSort] = useState<Sort>({
    key: "sessionDate",
    direction: "desc",
  })
  const [pageSize, setPageSize] = useState(10)
  const [page, setPage] = useState(1)

  // Only the free-text search is debounced; date and status changes are
  // discrete, so they should apply immediately.
  const debouncedQuery = useDebouncedValue(filters.query, SEARCH_DEBOUNCE_MS)
  const isDebouncing = debouncedQuery !== filters.query

  const { data, error, isFetching, retry } = useSessionEvaluations({
    query: debouncedQuery,
    from: filters.from,
    to: filters.to,
    status: filters.status,
    sortKey: sort.key,
    direction: sort.direction,
    page,
    pageSize,
  })

  const hasActiveFilters =
    filters.query !== "" ||
    filters.from !== "" ||
    filters.to !== "" ||
    filters.status !== "all"

  // Skeletons cover both the in-flight request and the debounce gap, so typing
  // never leaves stale rows sitting under a new query.
  const isPending = isFetching || isDebouncing

  const view: TableView = error
    ? "error"
    : isPending || !data
      ? "loading"
      : data.totalUnfiltered === 0
        ? "no-data"
        : data.total === 0
          ? "no-results"
          : "rows"

  const rows = data?.rows ?? []
  const totalRows = data?.total ?? 0
  const pageCount = Math.max(1, Math.ceil(totalRows / pageSize))
  const start = (page - 1) * pageSize
  const showingRows = view === "rows"

  const handleSortChange = (key: SortKey) => {
    setSort((current) =>
      current.key === key
        ? { key, direction: current.direction === "asc" ? "desc" : "asc" }
        : { key, direction: key === "studentName" ? "asc" : "desc" },
    )
    setPage(1)
  }

  // Any change to the result set invalidates the current page offset.
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
        hasActiveFilters={hasActiveFilters}
        onReset={handleReset}
        resultCount={error ? null : (data?.total ?? null)}
        isFetching={isPending}
      />

      <EvaluationsTable
        rows={rows}
        view={view}
        errorMessage={error?.message}
        sort={sort}
        onSortChange={handleSortChange}
        onReset={handleReset}
        onRetry={retry}
        // Match the previous page's density so the table doesn't jump height.
        skeletonRows={Math.min(pageSize, Math.max(rows.length, 6))}
      />

      <TablePagination
        page={showingRows ? page : 1}
        pageCount={showingRows ? pageCount : 1}
        pageSize={pageSize}
        totalRows={showingRows ? totalRows : 0}
        rangeStart={showingRows ? start + 1 : 0}
        rangeEnd={showingRows ? Math.min(start + pageSize, totalRows) : 0}
        disabled={!showingRows}
        onPageChange={(next) => setPage(Math.min(Math.max(next, 1), pageCount))}
        onPageSizeChange={(size) => {
          setPageSize(size)
          setPage(1)
        }}
      />
    </section>
  )
}
