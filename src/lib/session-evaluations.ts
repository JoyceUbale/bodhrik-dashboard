export type EvaluationStatus = "passed" | "needs-review" | "failed" | "pending"

export type SessionEvaluation = {
  id: string
  studentName: string
  studentEmail: string
  sessionDate: string // ISO date (YYYY-MM-DD)
  durationMins: number
  evaluator: string
  focusArea: string
  score: number | null // 0-100, null while pending
  status: EvaluationStatus
}

export const STATUS_LABELS: Record<EvaluationStatus, string> = {
  passed: "Passed",
  "needs-review": "Needs review",
  failed: "Failed",
  pending: "Pending",
}

/**
 * Stand-in dataset. Replace with a real query (e.g. a database read in a
 * Server Component) and pass the rows into <SessionEvaluationsPanel />.
 */
export const SESSION_EVALUATIONS: SessionEvaluation[] = [
  {
    id: "EV-1084",
    studentName: "Amara Okafor",
    studentEmail: "amara.okafor@bodhrik.io",
    sessionDate: "2026-07-24",
    durationMins: 55,
    evaluator: "Dr. Lena Hart",
    focusArea: "Calculus II",
    score: 92,
    status: "passed",
  },
  {
    id: "EV-1083",
    studentName: "Rohan Mehta",
    studentEmail: "rohan.mehta@bodhrik.io",
    sessionDate: "2026-07-24",
    durationMins: 45,
    evaluator: "Marcus Bell",
    focusArea: "Essay Structure",
    score: 68,
    status: "needs-review",
  },
  {
    id: "EV-1082",
    studentName: "Sofia Reyes",
    studentEmail: "sofia.reyes@bodhrik.io",
    sessionDate: "2026-07-23",
    durationMins: 60,
    evaluator: "Dr. Lena Hart",
    focusArea: "Organic Chemistry",
    score: 88,
    status: "passed",
  },
  {
    id: "EV-1081",
    studentName: "Elias Novak",
    studentEmail: "elias.novak@bodhrik.io",
    sessionDate: "2026-07-23",
    durationMins: 30,
    evaluator: "Priya Raman",
    focusArea: "Reading Fluency",
    score: 41,
    status: "failed",
  },
  {
    id: "EV-1080",
    studentName: "Mei Tanaka",
    studentEmail: "mei.tanaka@bodhrik.io",
    sessionDate: "2026-07-22",
    durationMins: 50,
    evaluator: "Marcus Bell",
    focusArea: "Linear Algebra",
    score: null,
    status: "pending",
  },
  {
    id: "EV-1079",
    studentName: "Daniel Achebe",
    studentEmail: "daniel.achebe@bodhrik.io",
    sessionDate: "2026-07-21",
    durationMins: 55,
    evaluator: "Priya Raman",
    focusArea: "Physics Mechanics",
    score: 79,
    status: "passed",
  },
  {
    id: "EV-1078",
    studentName: "Hannah Lindqvist",
    studentEmail: "hannah.l@bodhrik.io",
    sessionDate: "2026-07-20",
    durationMins: 40,
    evaluator: "Dr. Lena Hart",
    focusArea: "Statistics",
    score: 64,
    status: "needs-review",
  },
  {
    id: "EV-1077",
    studentName: "Yusuf Karim",
    studentEmail: "yusuf.karim@bodhrik.io",
    sessionDate: "2026-07-19",
    durationMins: 60,
    evaluator: "Marcus Bell",
    focusArea: "Debate Prep",
    score: 95,
    status: "passed",
  },
  {
    id: "EV-1076",
    studentName: "Clara Bianchi",
    studentEmail: "clara.bianchi@bodhrik.io",
    sessionDate: "2026-07-18",
    durationMins: 45,
    evaluator: "Priya Raman",
    focusArea: "French Conversation",
    score: 83,
    status: "passed",
  },
  {
    id: "EV-1075",
    studentName: "Noah Fitzgerald",
    studentEmail: "noah.fitz@bodhrik.io",
    sessionDate: "2026-07-17",
    durationMins: 35,
    evaluator: "Dr. Lena Hart",
    focusArea: "Geometry Proofs",
    score: 52,
    status: "failed",
  },
  {
    id: "EV-1074",
    studentName: "Priya Anand",
    studentEmail: "priya.anand@bodhrik.io",
    sessionDate: "2026-07-16",
    durationMins: 50,
    evaluator: "Marcus Bell",
    focusArea: "Data Structures",
    score: 90,
    status: "passed",
  },
  {
    id: "EV-1073",
    studentName: "Tomas Silva",
    studentEmail: "tomas.silva@bodhrik.io",
    sessionDate: "2026-07-15",
    durationMins: 55,
    evaluator: "Priya Raman",
    focusArea: "Macroeconomics",
    score: null,
    status: "pending",
  },
  {
    id: "EV-1072",
    studentName: "Isabelle Moreau",
    studentEmail: "isabelle.m@bodhrik.io",
    sessionDate: "2026-07-14",
    durationMins: 60,
    evaluator: "Dr. Lena Hart",
    focusArea: "Thesis Review",
    score: 71,
    status: "needs-review",
  },
  {
    id: "EV-1071",
    studentName: "Kwame Asante",
    studentEmail: "kwame.asante@bodhrik.io",
    sessionDate: "2026-07-13",
    durationMins: 45,
    evaluator: "Marcus Bell",
    focusArea: "Trigonometry",
    score: 86,
    status: "passed",
  },
  {
    id: "EV-1070",
    studentName: "Lucia Fernandez",
    studentEmail: "lucia.f@bodhrik.io",
    sessionDate: "2026-07-11",
    durationMins: 30,
    evaluator: "Priya Raman",
    focusArea: "Spanish Grammar",
    score: 77,
    status: "passed",
  },
  {
    id: "EV-1069",
    studentName: "Oliver Grant",
    studentEmail: "oliver.grant@bodhrik.io",
    sessionDate: "2026-07-10",
    durationMins: 50,
    evaluator: "Dr. Lena Hart",
    focusArea: "Cell Biology",
    score: 59,
    status: "failed",
  },
  {
    id: "EV-1068",
    studentName: "Fatima Zahra",
    studentEmail: "fatima.zahra@bodhrik.io",
    sessionDate: "2026-07-09",
    durationMins: 55,
    evaluator: "Marcus Bell",
    focusArea: "Algorithm Design",
    score: 94,
    status: "passed",
  },
  {
    id: "EV-1067",
    studentName: "Henrik Larsen",
    studentEmail: "henrik.larsen@bodhrik.io",
    sessionDate: "2026-07-08",
    durationMins: 40,
    evaluator: "Priya Raman",
    focusArea: "Public Speaking",
    score: 66,
    status: "needs-review",
  },
  {
    id: "EV-1066",
    studentName: "Aisha Bello",
    studentEmail: "aisha.bello@bodhrik.io",
    sessionDate: "2026-07-07",
    durationMins: 60,
    evaluator: "Dr. Lena Hart",
    focusArea: "Differential Equations",
    score: 81,
    status: "passed",
  },
  {
    id: "EV-1065",
    studentName: "Julian Wolfe",
    studentEmail: "julian.wolfe@bodhrik.io",
    sessionDate: "2026-07-06",
    durationMins: 35,
    evaluator: "Marcus Bell",
    focusArea: "Study Habits",
    score: null,
    status: "pending",
  },
  {
    id: "EV-1064",
    studentName: "Nadia Petrov",
    studentEmail: "nadia.petrov@bodhrik.io",
    sessionDate: "2026-07-04",
    durationMins: 45,
    evaluator: "Priya Raman",
    focusArea: "World History",
    score: 89,
    status: "passed",
  },
  {
    id: "EV-1063",
    studentName: "Samuel Adeyemi",
    studentEmail: "samuel.a@bodhrik.io",
    sessionDate: "2026-07-02",
    durationMins: 50,
    evaluator: "Dr. Lena Hart",
    focusArea: "Probability",
    score: 73,
    status: "needs-review",
  },
]

export function initialsOf(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("")
}

export function formatSessionDate(iso: string) {
  // Parse as a plain calendar date so the label never shifts by timezone.
  const [year, month, day] = iso.split("-").map(Number)
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  })
}
