import ResourceForm from '../components/ResourceForm'

export default function Page() {
  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create Resource</h1>
      <ResourceForm />
    </div>
  )
}
