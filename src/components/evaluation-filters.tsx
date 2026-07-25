"use client"

import { CalendarRange, RotateCcw, Search, X } from "lucide-react"

import { STATUS_LABELS, type EvaluationStatus } from "@/lib/session-evaluations"

export type TableState = "ready" | "loading" | "empty" | "error"

export type Filters = {
  query: string
  from: string
  to: string
  status: EvaluationStatus | "all"
}

const STATE_OPTIONS: { value: TableState; label: string }[] = [
  { value: "ready", label: "Data" },
  { value: "loading", label: "Loading" },
  { value: "empty", label: "Empty" },
  { value: "error", label: "Error" },
]

const FIELD =
  "h-10 w-full rounded-md border border-border bg-input text-sm text-foreground transition-colors placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/35"

const LABEL = "text-xs font-medium text-muted-foreground"

type Props = {
  filters: Filters
  onFiltersChange: (next: Filters) => void
  state: TableState
  onStateChange: (next: TableState) => void
  hasActiveFilters: boolean
  onReset: () => void
  resultCount: number
}

export function EvaluationFilters({
  filters,
  onFiltersChange,
  state,
  onStateChange,
  hasActiveFilters,
  onReset,
  resultCount,
}: Props) {
  const update = (patch: Partial<Filters>) =>
    onFiltersChange({ ...filters, ...patch })

  const invalidRange = Boolean(filters.from && filters.to && filters.from > filters.to)

  return (
    <div className="flex flex-col gap-5 border-b border-border p-5">
      <div className="flex flex-col gap-4">
        {/* Search + date range + status */}
        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-end">
          <div className="flex flex-col gap-1.5 sm:w-64">
            <label className={LABEL} htmlFor="student-search">
              Student name
            </label>
            <div className="relative">
              <Search
                aria-hidden="true"
                className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <input
                id="student-search"
                type="search"
                value={filters.query}
                onChange={(event) => update({ query: event.target.value })}
                placeholder="Search students…"
                autoComplete="off"
                className={`${FIELD} pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden`}
              />
              {filters.query ? (
                <button
                  type="button"
                  onClick={() => update({ query: "" })}
                  className="absolute top-1/2 right-2 grid size-6 -translate-y-1/2 place-items-center rounded-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
                >
                  <X aria-hidden="true" className="size-3.5" />
                  <span className="sr-only">Clear search</span>
                </button>
              ) : null}
            </div>
          </div>

          <fieldset className="flex flex-col gap-1.5">
            <legend className={`${LABEL} mb-1.5 flex items-center gap-1.5`}>
              <CalendarRange aria-hidden="true" className="size-3.5" />
              Session date range
            </legend>
            <div className="flex items-center gap-2">
              <input
                type="date"
                value={filters.from}
                max={filters.to || undefined}
                onChange={(event) => update({ from: event.target.value })}
                aria-label="From date"
                aria-invalid={invalidRange}
                className={`${FIELD} w-[9.5rem] px-3`}
              />
              <span aria-hidden="true" className="text-sm text-muted-foreground">
                –
              </span>
              <input
                type="date"
                value={filters.to}
                min={filters.from || undefined}
                onChange={(event) => update({ to: event.target.value })}
                aria-label="To date"
                aria-invalid={invalidRange}
                className={`${FIELD} w-[9.5rem] px-3`}
              />
            </div>
          </fieldset>

          <div className="flex flex-col gap-1.5 sm:w-44">
            <label className={LABEL} htmlFor="status-filter">
              Status
            </label>
            <select
              id="status-filter"
              value={filters.status}
              onChange={(event) =>
                update({ status: event.target.value as Filters["status"] })
              }
              className={`${FIELD} cursor-pointer px-3`}
            >
              <option value="all">All statuses</option>
              {Object.entries(STATUS_LABELS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Result summary + state preview + reset */}
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-3">
        <p aria-live="polite" className="text-xs text-muted-foreground">
          {invalidRange ? (
            <span className="text-danger">
              The start date must come before the end date.
            </span>
          ) : state === "ready" ? (
            <>
              <span className="tabular font-medium text-foreground">
                {resultCount}
              </span>{" "}
              {resultCount === 1 ? "evaluation" : "evaluations"} match the current
              filters
            </>
          ) : (
            <>Previewing the {state} state</>
          )}
        </p>

        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          {hasActiveFilters ? (
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40"
            >
              <RotateCcw aria-hidden="true" className="size-3.5" />
              Reset filters
            </button>
          ) : null}

          {/* State selector: preview the loading / empty / error renderings */}
          <span className={LABEL} id="state-selector-label">
            Table state
          </span>
          <div
            role="radiogroup"
            aria-labelledby="state-selector-label"
            className="inline-flex w-fit gap-1 rounded-md border border-border bg-muted p-1"
          >
            {STATE_OPTIONS.map((option) => {
              const active = state === option.value
              return (
                <button
                  key={option.value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => onStateChange(option.value)}
                  className={`rounded-sm px-2.5 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/40 ${
                    active
                      ? "bg-card text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {option.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
