import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Button from '@/components/ui/button'

export default function ActiveSessionPanel({ task }: { task?: any }) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Active Session</CardTitle>
            {task ? <div className="text-sm text-slate-200">{task.title}</div> : <div className="text-slate-400 mt-2">No active session</div>}
          </div>
          {task && (
            <div className="text-right">
              <div className="text-2xl font-mono">25:00</div>
              <div className="mt-3 flex gap-2 justify-end">
                <Button className="bg-amber-500 hover:bg-amber-400">Pause</Button>
                <Button className="bg-red-600 hover:bg-red-500">Stop</Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
