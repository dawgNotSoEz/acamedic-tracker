import { prisma } from '../../lib/prisma'
import Link from 'next/link'

export default async function Page() {
  const resources = await prisma.resource.findMany({ include: { tags: { include: { tag: true } } }, orderBy: { createdAt: 'desc' } })

  return (
    <div className="max-w-4xl mx-auto p-4">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Resources</h1>
        <Link href="/resources/create" className="px-3 py-1 bg-blue-600 text-white rounded">Create</Link>
      </div>

      <ul className="space-y-3">
        {resources.map((r) => (
          <li key={r.id} className="p-3 border rounded">
            <Link href={`/resources/${r.id}`} className="block text-lg font-medium">{r.title}</Link>
            <div className="text-sm text-gray-600">{r.category} • {r.difficulty}</div>
            <div className="text-xs text-gray-500 mt-2">{r.tags.map((t) => t.tag.name).join(', ')}</div>
          </li>
        ))}
      </ul>
    </div>
  )
}
