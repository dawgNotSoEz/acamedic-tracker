import React from 'react'

export default function Button({ children, className = '', ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button {...props} className={`px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-sm font-medium ${className}`}>
      {children}
    </button>
  )
}
