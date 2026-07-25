import rawSessions from "@/data/sessions.json"

export type EvaluationStatus = "passed" | "needs-review" | "failed" | "pending"

export type TimeSeriesMetric = {
  timestamp: string
  engagementScore: number
  clarityScore: number
  pacingScore: number
}

export type RawSession = {
  id: string
  studentName: string
  date: string
  timeSeriesMetrics: TimeSeriesMetric[]
}

export type SessionEvaluation = {
  id: string
  studentName: string
  studentEmail: string
  sessionDate: string
  durationMins: number
  evaluator: string
  focusArea: string
  score: number | null
  status: EvaluationStatus
}

export const STATUS_LABELS: Record<EvaluationStatus, string> = {
  passed: "Passed",
  "needs-review": "Needs review",
  failed: "Failed",
  pending: "Pending",
}

export function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function formatSessionDate(iso: string) {
  if (!iso) return ""
  const dateObj = new Date(iso)
  return dateObj.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

// Transform raw sessions.json into formatted evaluations
export const EVALUATIONS_DATA: SessionEvaluation[] = (rawSessions as RawSession[]).map(
  (session) => {
    // Calculate average overall score across timeSeriesMetrics
    const avgScore = Math.round(
      session.timeSeriesMetrics.reduce((acc, curr) => {
        const itemAvg = (curr.engagementScore + curr.clarityScore + curr.pacingScore) / 3
        return acc + itemAvg
      }, 0) / session.timeSeriesMetrics.length
    )

    // Assign status dynamically based on average score thresholds
    let status: EvaluationStatus = "passed"
    if (avgScore < 70) {
      status = "failed"
    } else if (avgScore < 80) {
      status = "needs-review"
    }

    // Generate fallback email based on student name
    const email = `${session.studentName.toLowerCase().replace(/\s+/g, ".")}@bodhrik.io`

    return {
      id: session.id,
      studentName: session.studentName,
      studentEmail: email,
      sessionDate: session.date,
      durationMins: 45, // 4 x 15min slots
      evaluator: "Dr. Lena Hart",
      focusArea: "General Tutoring",
      score: avgScore,
      status: status,
    }
  }
)