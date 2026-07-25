import { NextResponse } from "next/server"

import {
  SESSION_EVALUATIONS,
  STATUS_LABELS,
  type EvaluationStatus,
  type SessionEvaluation,
} from "@/lib/session-evaluations"

const SORT_KEYS = ["studentName", "sessionDate", "score"] as const
type SortKey = (typeof SORT_KEYS)[number]

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/

function isSortKey(value: string): value is SortKey {
  return (SORT_KEYS as readonly string[]).includes(value)
}

function isStatus(value: string): value is EvaluationStatus {
  return Object.hasOwn(STATUS_LABELS, value)
}

/**
 * Reject malformed input instead of silently coercing it, so a bad request
 * surfaces as an error the client can retry rather than as wrong results.
 */
function parseParams(url: URL) {
  const query = (url.searchParams.get("query") ?? "").trim().toLowerCase()
  const from = url.searchParams.get("from") ?? ""
  const to = url.searchParams.get("to") ?? ""
  const status = url.searchParams.get("status") ?? "all"
  const sortKey = url.searchParams.get("sortKey") ?? "sessionDate"
  const direction = url.searchParams.get("direction") ?? "desc"
  const page = Number(url.searchParams.get("page") ?? "1")
  const pageSize = Number(url.searchParams.get("pageSize") ?? "10")

  if (from && !ISO_DATE.test(from)) throw new Error(`Invalid "from" date: ${from}`)
  if (to && !ISO_DATE.test(to)) throw new Error(`Invalid "to" date: ${to}`)
  if (!isSortKey(sortKey)) throw new Error(`Unknown sort key: ${sortKey}`)
  if (direction !== "asc" && direction !== "desc") {
    throw new Error(`Unknown sort direction: ${direction}`)
  }
  if (status !== "all" && !isStatus(status)) {
    throw new Error(`Unknown status: ${status}`)
  }
  if (!Number.isInteger(page) || page < 1) {
    throw new Error(`Invalid page: ${page}`)
  }
  if (!Number.isInteger(pageSize) || pageSize < 1 || pageSize > 100) {
    throw new Error(`Invalid page size: ${pageSize}`)
  }

  return { query, from, to, status, sortKey, direction, page, pageSize }
}

function compare(a: SessionEvaluation, b: SessionEvaluation, sortKey: SortKey) {
  if (sortKey === "score") {
    // Pending rows (null score) always sort last, regardless of direction.
    if (a.score === null && b.score === null) return 0
    if (a.score === null) return 1
    if (b.score === null) return -1
    return a.score - b.score
  }
  return a[sortKey].localeCompare(b[sortKey])
}

export async function GET(request: Request) {
  try {
    const params = parseParams(new URL(request.url))

    // Stand-in for real I/O latency. Replace this whole block with a database
    // query and the client states keep working unchanged.
    await new Promise((resolve) => setTimeout(resolve, 320))

    const source = SESSION_EVALUATIONS

    const matched = source.filter((row) => {
      if (params.query && !row.studentName.toLowerCase().includes(params.query)) {
        return false
      }
      if (params.from && row.sessionDate < params.from) return false
      if (params.to && row.sessionDate > params.to) return false
      if (params.status !== "all" && row.status !== params.status) return false
      return true
    })

    const factor = params.direction === "asc" ? 1 : -1
    const sorted = [...matched].sort((a, b) => {
      const result = compare(a, b, params.sortKey)
      // Keep null scores pinned last by not flipping their comparison.
      if (params.sortKey === "score" && (a.score === null || b.score === null)) {
        return result
      }
      return result * factor
    })

    const start = (params.page - 1) * params.pageSize
    const rows = sorted.slice(start, start + params.pageSize)

    return NextResponse.json({
      rows,
      total: matched.length,
      // Lets the client tell "nothing exists yet" apart from "nothing matched".
      totalUnfiltered: source.length,
      page: params.page,
      pageSize: params.pageSize,
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to load evaluations."
    console.log("[v0] /api/evaluations failed:", message)
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
