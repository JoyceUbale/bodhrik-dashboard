"use client"

import Link from "next/link"
import { useParams } from "next/navigation"
import { ArrowLeft, Calendar, User, Clock } from "lucide-react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

import rawSessions from "@/data/sessions.json"
import { formatSessionDate, type RawSession } from "@/lib/session-evaluations"

export default function SessionDetailPage() {
  const params = useParams()
  const sessionId = params.id as string

  // Find the raw session data matching the URL id
  const session = (rawSessions as RawSession[]).find(
    (s) => s.id === sessionId
  )

  if (!session) {
    return (
      <main className="min-h-screen bg-background p-8 text-foreground flex flex-col items-center justify-center gap-4">
        <h1 className="text-xl font-semibold">Session not found</h1>
        <p className="text-sm text-muted-foreground">
          No evaluation data exists for session ID: {sessionId}
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Dashboard
        </Link>
      </main>
    )
  }

  // Format timestamps for the chart X-axis (e.g. "10:15")
  const chartData = session.timeSeriesMetrics.map((metric) => {
    const formattedTime = new Date(metric.timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })
    return {
      ...metric,
      timeLabel: formattedTime,
    }
  })

  return (
    <main className="min-h-screen bg-background p-8 text-foreground">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Navigation & Header */}
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-medium text-teal-400 hover:underline mb-4 transition-colors"
          >
            <ArrowLeft className="size-3.5" />
            Back to Dashboard
          </Link>
          <h1 className="text-2xl font-bold tracking-tight">
            Session Evaluation Metrics
          </h1>
          <p className="text-sm text-muted-foreground">
            Detailed time-series breakdown for engagement, clarity, and pacing.
          </p>
        </div>

        {/* Metadata Card */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 rounded-lg border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center gap-3">
            <User className="size-5 text-teal-400" />
            <div>
              <p className="text-xs text-muted-foreground">Student Name</p>
              <p className="text-sm font-semibold">{session.studentName}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="size-5 text-teal-400" />
            <div>
              <p className="text-xs text-muted-foreground">Session Date</p>
              <p className="text-sm font-semibold">
                {formatSessionDate(session.date)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Clock className="size-5 text-teal-400" />
            <div>
              <p className="text-xs text-muted-foreground">Data Points</p>
              <p className="text-sm font-semibold">
                {session.timeSeriesMetrics.length} intervals
              </p>
            </div>
          </div>
        </div>

        {/* Recharts Metrics Over Time Chart */}
        <div className="rounded-lg border border-border bg-card p-6 shadow-sm space-y-4">
          <h2 className="text-base font-semibold">Metrics Over Time</h2>
          <div className="h-[350px] w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis
                  dataKey="timeLabel"
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#18181b",
                    borderColor: "#27272a",
                    borderRadius: "0.5rem",
                    color: "#f4f4f5",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }} />
                <Line
                  type="monotone"
                  dataKey="engagementScore"
                  name="Engagement"
                  stroke="#2dd4bf" // Teal
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="clarityScore"
                  name="Clarity"
                  stroke="#3b82f6" // Blue
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="pacingScore"
                  name="Pacing"
                  stroke="#a855f7" // Purple
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </main>
  )
}