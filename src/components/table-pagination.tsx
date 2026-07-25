"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"

export const PAGE_SIZE_OPTIONS = [5, 10, 25] as const

type Props = {
  page: number
  pageCount: number
  pageSize: number
  totalRows: number
  rangeStart: number
  rangeEnd: number
  disabled: boolean
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

const NAV_BUTTON =
  "inline-flex items-center gap-1 rounded-md border border-border bg-card px-2.5 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-40"

export function TablePagination({
  page,
  pageCount,
  pageSize,
  totalRows,
  rangeStart,
  rangeEnd,
  disabled,
  onPageChange,
  onPageSizeChange,
}: Props) {
  return (
    <div className="flex flex-col gap-4 border-t border-border px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
        <p className="text-xs text-muted-foreground" aria-live="polite">
          {disabled || totalRows === 0 ? (
            "No rows to display"
          ) : (
            <>
              Showing{" "}
              <span className="tabular font-medium text-foreground">
                {rangeStart}–{rangeEnd}
              </span>{" "}
              of{" "}
              <span className="tabular font-medium text-foreground">
                {totalRows}
              </span>{" "}
              evaluations
            </>
          )}
        </p>

        <div className="flex items-center gap-2">
          <label
            htmlFor="page-size"
            className="text-xs font-medium text-muted-foreground"
          >
            Rows per page
          </label>
          <select
            id="page-size"
            value={pageSize}
            disabled={disabled}
            onChange={(event) => onPageSizeChange(Number(event.target.value))}
            className="h-8 cursor-pointer rounded-md border border-border bg-input px-2 text-sm text-foreground transition-colors focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/35 disabled:opacity-40"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      <nav aria-label="Evaluations pagination" className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={disabled || page <= 1}
          className={NAV_BUTTON}
        >
          <ChevronLeft aria-hidden="true" className="size-4" />
          Previous
        </button>

        <ol className="flex items-center gap-1">
          {buildPageList(page, pageCount).map((item, index) =>
            item === "gap" ? (
              <li
                key={`gap-${index}`}
                aria-hidden="true"
                className="px-1 text-sm text-muted-foreground"
              >
                …
              </li>
            ) : (
              <li key={item}>
                <button
                  type="button"
                  onClick={() => onPageChange(item)}
                  disabled={disabled}
                  aria-current={item === page ? "page" : undefined}
                  className={`tabular inline-flex size-8 items-center justify-center rounded-md border text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 disabled:pointer-events-none disabled:opacity-40 ${
                    item === page
                      ? "border-primary bg-primary text-primary-foreground"
                      : "border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                >
                  {item}
                  <span className="sr-only">
                    {item === page ? " (current page)" : ""}
                  </span>
                </button>
              </li>
            ),
          )}
        </ol>

        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={disabled || page >= pageCount}
          className={NAV_BUTTON}
        >
          Next
          <ChevronRight aria-hidden="true" className="size-4" />
        </button>
      </nav>
    </div>
  )
}

/** Window of page numbers with ellipsis gaps for long ranges. */
function buildPageList(page: number, pageCount: number): (number | "gap")[] {
  if (pageCount <= 1) return [1]
  if (pageCount <= 7) {
    return Array.from({ length: pageCount }, (_, index) => index + 1)
  }

  const pages = new Set<number>([1, pageCount, page])
  if (page - 1 > 1) pages.add(page - 1)
  if (page + 1 < pageCount) pages.add(page + 1)

  const sorted = [...pages].sort((a, b) => a - b)
  const result: (number | "gap")[] = []

  sorted.forEach((value, index) => {
    if (index > 0 && value - sorted[index - 1] > 1) result.push("gap")
    result.push(value)
  })

  return result
}
