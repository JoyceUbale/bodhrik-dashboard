import useSWR from "swr"
import type { SessionEvaluation } from "@/lib/session-evaluations"
import type { Filters } from "@/components/evaluation-filters"

const fetcher = (url: string) =>
  fetch(url).then((res) => {
    if (!res.ok) throw new Error("Failed to load evaluations")
    return res.json()
  })

export function useSessionEvaluations(filters: Filters) {
  const params = new URLSearchParams()
  if (filters.query) params.set("query", filters.query)
  if (filters.from) params.set("from", filters.from)
  if (filters.to) params.set("to", filters.to)
  if (filters.status && filters.status !== "all") params.set("status", filters.status)

  const queryString = params.toString()
  const url = `/api/evaluations${queryString ? `?${queryString}` : ""}`
// Temporarily break the URL
// const url = `/api/evaluations-broken`

  const { data, error, isLoading, mutate } = useSWR<SessionEvaluation[]>(url, fetcher, {
    keepPreviousData: true,
  })

  return {
    evaluations: data || [],
    isLoading,
    isError: Boolean(error),
    mutate,
  }
}