import { getActiveSession, listSessions } from './actions'
import ActiveSession from './components/ActiveSession'
import Link from 'next/link'

export default async function Page() {
  const active = await getActiveSession()
  const recent = await listSessions({ limit: 20 })

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Study Sessions</h1>

      {/* @ts-expect-error server -> client */}
      <ActiveSession session={active} />

      <section className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Recent Sessions</h2>
        <ul className="space-y-3">
          {recent.map((s) => (
            <li key={s.id} className="p-3 border rounded">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{s.notes ?? '(no note)'}</div>
                  <div className="text-sm text-gray-600">Status: {s.status} • Duration: {s.durationMins ?? s.accumulatedMins} mins</div>
                </div>
                <div>
                  <Link href={`/study-sessions/${s.id}`} className="px-3 py-1 bg-gray-200 rounded">View</Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
