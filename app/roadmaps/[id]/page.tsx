import { prisma } from '../../../../lib/prisma'
import WeekForm from '../components/WeekForm'
import DayForm from '../components/DayForm'

type Props = { params: { id: string } }

export default async function Page({ params }: Props) {
  const roadmap = await prisma.roadmap.findUnique({ where: { id: params.id }, include: { weeks: { include: { days: { include: { tasks: true } } } } } })
  if (!roadmap) return <div className="p-4">Roadmap not found</div>

  // fetch tasks that are unassigned or belong to this roadmap
  const tasks = await prisma.task.findMany({ where: { OR: [{ roadmapId: roadmap.id }, { roadmapId: null }] }, select: { id: true, title: true } })

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{roadmap.title}</h1>
      <p className="text-sm text-gray-600 mb-6">{roadmap.description}</p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Add Week</h2>
        {/* @ts-expect-error Server -> Client */}
        <WeekForm roadmapId={roadmap.id} />
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Weeks</h2>
        <div className="space-y-6">
          {roadmap.weeks.sort((a,b)=> a.number - b.number).map((week) => (
            <div key={week.id} className="p-3 border rounded">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium">Week {week.number} {week.title && `— ${week.title}`}</div>
                  <div className="text-sm text-gray-500">{week.startDate?.toDateString()} — {week.endDate?.toDateString()}</div>
                </div>
                <div>
                  {/* Add day form and assign tasks */}
                </div>
              </div>

              <div className="mt-4">
                <h3 className="font-semibold">Days</h3>
                <div className="space-y-3 mt-2">
                  {week.days.sort((a,b)=> a.dayNumber - b.dayNumber).map((day) => (
                    <div key={day.id} className="p-2 border rounded">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Day {day.dayNumber} {day.title && `— ${day.title}`}</div>
                          <div className="text-sm text-gray-500">{day.date?.toDateString()}</div>
                        </div>
                        <div className="text-sm text-gray-600">Tasks: {day.tasks.length}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Add Day / Assign Task</h4>
                  {/* @ts-expect-error Server -> Client */}
                  <DayForm weekId={week.id} tasks={tasks} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
