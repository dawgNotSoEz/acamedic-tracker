import Link from 'next/link'
import { prisma } from '../../lib/prisma'

export default async function Page() {
  const roadmaps = await prisma.roadmap.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Roadmaps</h1>
        <Link href="/roadmaps/create" className="px-3 py-1 bg-blue-600 text-white rounded">Create</Link>
      </div>

      <ul className="space-y-3">
        {roadmaps.map((r) => (
          <li key={r.id} className="p-3 border rounded">
            <Link href={`/roadmaps/${r.id}`} className="block text-lg font-medium">{r.title}</Link>
            <div className="text-sm text-gray-600">{r.description}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
