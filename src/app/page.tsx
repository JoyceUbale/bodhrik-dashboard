import { SessionEvaluationsPanel } from "@/components/session-evaluations-panel"
import { SESSION_EVALUATIONS } from "@/lib/session-evaluations"

export default function Home() {
  return (
    <div className="flex flex-1 flex-col bg-background font-sans">
      <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
        <header className="flex flex-col gap-2">
          <p className="text-xs font-semibold tracking-widest text-primary uppercase">
            Bodhrik
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-balance text-foreground">
            Session evaluations
          </h1>
          <p className="max-w-2xl text-sm leading-relaxed text-pretty text-muted-foreground">
            Review coach-submitted evaluations for every tutoring session. Filter by
            student, narrow the date range, and sort to surface the sessions that need
            follow-up.
          </p>
        </header>

        <SessionEvaluationsPanel evaluations={SESSION_EVALUATIONS} />
      </main>
    </div>
  )
}
