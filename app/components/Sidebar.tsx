export default function Sidebar() {
  return (
    <nav className="bg-slate-800 p-4 rounded-lg">
      <div className="mb-6 text-sm text-slate-400">Navigation</div>
      <ul className="space-y-2">
        <li className="p-2 rounded hover:bg-slate-700"><a href="#" className="flex items-center gap-3"><span className="w-2 h-2 bg-green-500 rounded-full"/> Dashboard</a></li>
        <li className="p-2 rounded hover:bg-slate-700"><a href="#">Roadmaps</a></li>
        <li className="p-2 rounded hover:bg-slate-700"><a href="#">Tasks</a></li>
        <li className="p-2 rounded hover:bg-slate-700"><a href="#">Resources</a></li>
        <li className="p-2 rounded hover:bg-slate-700"><a href="#">Sessions</a></li>
        <li className="p-2 rounded hover:bg-slate-700"><a href="#">Analytics</a></li>
      </ul>
    </nav>
  )
}
