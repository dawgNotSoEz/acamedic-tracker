import { prisma } from '../../../../lib/prisma'
import TaskForm from '../../components/TaskForm'

type Props = { params: { id: string } }

export default async function Page({ params }: Props) {
  const task = await prisma.task.findUnique({ where: { id: params.id } })
  if (!task) return <div className="p-4">Task not found</div>

  // Prisma Date objects / enums are serializable here for client component props
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Task</h1>
      {/* @ts-expect-error Server -> Client prop serialization */}
      <TaskForm task={task} />
    </div>
  )
}
