import { getAnalytics } from './actions'
import KPIGrid from './components/KPIGrid'
import WeeklyChart from './components/WeeklyChart'
import MonthlyChart from './components/MonthlyChart'
import CategoryChart from './components/CategoryChart'

export default async function Page() {
  const data = await getAnalytics()

  const weeklyHours = data.weekly.reduce((s: number, d: any) => s + d.hours, 0)
  const monthlyHours = data.monthly.reduce((s: number, d: any) => s + d.hours, 0)

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Analytics</h1>

      <KPIGrid totalStudyHours={data.totalStudyHours} weeklyHours={weeklyHours} monthlyHours={monthlyHours} taskCompletion={data.taskCompletion} currentStreak={data.currentStreak} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-4 border rounded bg-white">
          <h2 className="font-semibold mb-2">Weekly (last 7 days)</h2>
          {/* @ts-expect-error Server -> Client */}
          <WeeklyChart data={data.weekly} />
        </div>

        <div className="p-4 border rounded bg-white">
          <h2 className="font-semibold mb-2">Monthly (last 30 days)</h2>
          {/* @ts-expect-error Server -> Client */}
          <MonthlyChart data={data.monthly} />
        </div>
      </div>

      <div className="mt-6 p-4 border rounded bg-white">
        <h2 className="font-semibold mb-2">Hours by Category</h2>
        {/* @ts-expect-error Server -> Client */}
        <CategoryChart data={data.hoursByCategory} />
      </div>
    </div>
  )
}
