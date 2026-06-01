import { prisma } from '../../../../lib/prisma'
import { deleteTaskAction, completeTaskAction } from '../../actions'

type Props = { params: { id: string } }

export default async function Page({ params }: Props) {
  const task = await prisma.task.findUnique({ where: { id: params.id } })
  if (!task) return <div className="p-4">Task not found</div>

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold">{task.title}</h1>
      <p className="text-sm text-gray-600">{task.description}</p>

      <div className="mt-4 flex gap-2">
        <form action={completeTaskAction}>
          <input type="hidden" name="id" value={task.id} />
          <button className="px-3 py-1 bg-green-600 text-white rounded">Mark Complete</button>
        </form>

        <form action={deleteTaskAction}>
          <input type="hidden" name="id" value={task.id} />
          <button className="px-3 py-1 bg-red-600 text-white rounded">Delete</button>
        </form>
      </div>
    </div>
  )
}
