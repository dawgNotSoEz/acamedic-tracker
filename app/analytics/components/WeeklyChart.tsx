"use client"

import React from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

type Props = { data: { date: string; hours: number }[] }

export default function WeeklyChart({ data }: Props) {
  return (
    <div style={{ width: '100%', height: 240 }}>
      <ResponsiveContainer>
        <BarChart data={data}>
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="hours" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
