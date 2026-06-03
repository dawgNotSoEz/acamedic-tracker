import { prisma } from "@/lib/prisma";
import { deleteResourceAction } from "../actions";

type Props = { params: { id: string } }

export default async function Page({ params }: Props) {
  const resource = await prisma.resource.findUnique({ where: { id: params.id }, include: { tags: { include: { tag: true } } } })
  if (!resource) return <div className="p-4">Resource not found</div>

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold">{resource.title}</h1>
      {resource.url && (
        <p className="text-sm text-blue-600"><a href={resource.url} target="_blank" rel="noreferrer">{resource.url}</a></p>
      )}
      <div className="text-sm text-gray-600">{resource.category} • {resource.difficulty}</div>
      <div className="mt-4 text-sm">{resource.content}</div>

      <div className="mt-4 flex gap-2">
        <a href={`/resources/${resource.id}/edit`} className="px-3 py-1 bg-yellow-600 text-white rounded">Edit</a>

        <form action={deleteResourceAction}>
          <input type="hidden" name="id" value={resource.id} />
          <button className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
        </form>
      </div>
    </div>
  )
}
