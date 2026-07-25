import { SessionEvaluationsPanel } from "@/components/session-evaluations-panel"

export default function Home() {
  return (
    <main className="min-h-screen bg-background p-8 text-foreground">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <p className="text-xs font-semibold tracking-wider text-teal-400 uppercase">
            Bodhrik
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Session evaluations
          </h1>
          <p className="text-sm text-muted-foreground">
            Review coach-submitted evaluations for every tutoring session. Filter by student, narrow the date range, and sort to surface the sessions that need follow-up.
          </p>
        </div>

        <SessionEvaluationsPanel />
      </div>
    </main>
  )
}