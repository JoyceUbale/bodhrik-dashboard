import { NextResponse } from "next/server"
import rawSessions from "@/data/sessions.json"
import { type RawSession } from "@/lib/session-evaluations"

const EVALUATORS = [
  "Dr. Lena Hart",
  "Prof. Marcus Vance",
  "Dr. Sarah Jenkins",
  "Dr. Alan Turing",
  "Prof. Elena Rostova",
]

const FOCUS_AREAS = [
  "General Tutoring",
  "Calculus & Algebra",
  "Data Structures",
  "Physics Foundations",
  "Essay & Technical Writing",
  "Organic Chemistry",
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query")?.toLowerCase() || ""
  const from = searchParams.get("from") || ""
  const to = searchParams.get("to") || ""
  const status = searchParams.get("status") || "all"

  // Simulate network delay to demonstrate loading skeleton
  await new Promise((resolve) => setTimeout(resolve, 300))

  try {
    const sessions = rawSessions as RawSession[]

    const filtered = sessions.filter((session) => {
      const sessionDate = session.date.split("T")[0]

      if (query && !session.studentName.toLowerCase().includes(query)) {
        return false
      }
      if (from && sessionDate < from) return false
      if (to && sessionDate > to) return false
      
      // Calculate overall score to check status matching
      const avgScore = Math.round(
        session.timeSeriesMetrics.reduce(
          (acc, item) => acc + (item.engagementScore + item.clarityScore + item.pacingScore) / 3,
          0
        ) / session.timeSeriesMetrics.length
      )
      const computedStatus = avgScore >= 80 ? "passed" : avgScore >= 60 ? "needs_review" : "failed"

      if (status !== "all" && computedStatus !== status) return false

      return true
    })

    const transformed = filtered.map((session, index) => {
      const avgScore = Math.round(
        session.timeSeriesMetrics.reduce(
          (acc, item) => acc + (item.engagementScore + item.clarityScore + item.pacingScore) / 3,
          0
        ) / session.timeSeriesMetrics.length
      )
      const computedStatus = avgScore >= 80 ? "passed" : avgScore >= 60 ? "needs_review" : "failed"

      // Deterministically pick an evaluator and focus area based on index/ID
      const numId = parseInt(session.id.replace(/\D/g, ""), 10) || index
      const evaluator = EVALUATORS[numId % EVALUATORS.length]
      const focusArea = FOCUS_AREAS[numId % FOCUS_AREAS.length]

      return {
        id: session.id,
        studentName: session.studentName,
        studentEmail: `${session.studentName.toLowerCase().replace(/\s+/g, ".")}@bodhrik.io`,
        sessionDate: session.date,
        durationMins: 45,
        evaluator,
        focusArea,
        score: avgScore,
        status: computedStatus,
      }
    })

    return NextResponse.json(transformed)
  } catch {
    return NextResponse.json({ error: "Failed to fetch evaluations" }, { status: 500 })
  }
}