import Sidebar from '../../components/Sidebar'
import RoadmapHeader from './RoadmapHeader'
import WeeksList from './WeeksList'
import TodaysTasks from './TodaysTasks'
import ActiveSessionPanel from './ActiveSessionPanel'

export default function RoadmapsHome() {
  const today = new Date()
  const dateStr = today.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })

  // Synthetic roadmap data
  const roadmaps = [
    {
      id: 'r1',
      title: 'Cybersecurity Speedrun',
      progress: 72,
      weeks: [
        { id: 'w1', number: 1, title: 'Intro & Basics', days: [{ id: 'd1', dayNumber: 1, date: today.toDateString(), tasks: [{ id: 't1', title: 'Review OWASP Top 10', status: 'IN_PROGRESS' }] }] },
        { id: 'w2', number: 2, title: 'Network Security', days: [] },
      ],
    },
    { id: 'r2', title: 'Blockchain Security', progress: 45, weeks: [] },
    { id: 'r3', title: 'DSA Preparation', progress: 58, weeks: [] },
    { id: 'r4', title: 'Full Stack Development', progress: 33, weeks: [] },
  ]

  const current = roadmaps[0]

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex gap-6 py-6">
          <aside className="w-56 md:w-44 lg:w-40">
            <Sidebar />
          </aside>

          <main className="flex-1">
            <header className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-semibold">{current.title}</h1>
                <div className="text-sm text-slate-400">{dateStr}</div>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-3 py-1 rounded bg-green-600 text-sm">Start Study Session</button>
              </div>
            </header>

            <section className="mb-6">
              <RoadmapHeader roadmap={current} />
            </section>

            <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-4">
                <WeeksList weeks={current.weeks} />

                <div className="bg-slate-800 rounded-lg p-4">
                  <h2 className="font-semibold mb-3">Today's Tasks</h2>
                  <TodaysTasks tasks={[{ id: 't1', title: 'Review OWASP Top 10', status: 'IN_PROGRESS' }, { id: 't2', title: 'Blockchain threat model', status: 'TODO' }, { id: 't3', title: 'Implement DSA practice set', status: 'TODO' }]} />
                </div>
              </div>

              <aside className="space-y-4">
                <ActiveSessionPanel task={{ id: 't1', title: 'Review OWASP Top 10' }} />
                <div className="bg-slate-800 rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Other Roadmaps</h3>
                  <ul className="space-y-2 text-sm text-slate-300">
                    {roadmaps.slice(1).map((r) => (
                      <li key={r.id} className="flex items-center justify-between">
                        <span>{r.title}</span>
                        <span className="text-slate-400">{r.progress}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </aside>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}
