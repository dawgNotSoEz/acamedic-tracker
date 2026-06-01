import { prisma } from '../../../../lib/prisma'
import ResourceForm from '../../components/ResourceForm'

type Props = { params: { id: string } }

export default async function Page({ params }: Props) {
  const resource = await prisma.resource.findUnique({ where: { id: params.id }, include: { tags: { include: { tag: true } } } })
  if (!resource) return <div className="p-4">Resource not found</div>

  // @ts-expect-error serializing for client
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Resource</h1>
      <ResourceForm resource={resource} />
    </div>
  )
}
