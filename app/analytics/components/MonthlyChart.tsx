"use client"

import React from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

type Props = { data: { date: string; hours: number }[] }

export default function MonthlyChart({ data }: Props) {
  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          <XAxis dataKey="date" tick={{ fontSize: 10 }} />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="hours" stroke="#10b981" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
