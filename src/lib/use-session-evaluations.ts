"use client"

import { useEffect, useState } from "react"
import useSWR from "swr"

import type { SessionEvaluation } from "@/lib/session-evaluations"

export type EvaluationsResponse = {
  rows: SessionEvaluation[]
  total: number
  totalUnfiltered: number
  page: number
  pageSize: number
}

export type EvaluationsQuery = {
  query: string
  from: string
  to: string
  status: string
  sortKey: string
  direction: string
  page: number
  pageSize: number
}

/** Debounce window for the student search box. */
export const SEARCH_DEBOUNCE_MS = 250

async function fetchEvaluations(url: string): Promise<EvaluationsResponse> {
  const response = await fetch(url)

  if (!response.ok) {
    // Prefer the API's message so the retry UI can explain what went wrong.
    const detail = await response
      .json()
      .then((body: { error?: string }) => body.error)
      .catch(() => null)
    throw new Error(detail ?? `Request failed with status ${response.status}`)
  }

  const body: unknown = await response.json()

  if (
    typeof body !== "object" ||
    body === null ||
    !Array.isArray((body as EvaluationsResponse).rows)
  ) {
    throw new Error("The evaluations service returned an unexpected response.")
  }

  return body as EvaluationsResponse
}

/** Debounces a rapidly changing value (the search input). */
export function useDebouncedValue<T>(value: T, delayMs: number) {
  const [debounced, setDebounced] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delayMs)
    return () => clearTimeout(timer)
  }, [value, delayMs])

  return debounced
}

function buildUrl(params: EvaluationsQuery) {
  const search = new URLSearchParams({
    query: params.query,
    from: params.from,
    to: params.to,
    status: params.status,
    sortKey: params.sortKey,
    direction: params.direction,
    page: String(params.page),
    pageSize: String(params.pageSize),
  })
  return `/api/evaluations?${search.toString()}`
}

export function useSessionEvaluations(params: EvaluationsQuery) {
  const { data, error, isLoading, isValidating, mutate } = useSWR(
    buildUrl(params),
    fetchEvaluations,
    {
      keepPreviousData: true,
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    },
  )

  return {
    data,
    error: error as Error | undefined,
    // isValidating covers key changes (new filters, sort, page) as well as an
    // explicit retry, so the skeleton shows on every genuine transition.
    isFetching: isLoading || isValidating,
    retry: () => mutate(),
  }
}
