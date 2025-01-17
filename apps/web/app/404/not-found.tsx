
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export default function NotFound() {
  const [position, setPosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20
      const y = (e.clientY / window.innerHeight - 0.5) * 20
      setPosition({ x, y })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center">
        <motion.div
          animate={{
            x: position.x,
            y: position.y,
            rotate: position.x,
          }}
          transition={{ type: 'spring', stiffness: 150 }}
        >
          <h1 className="text-9xl font-bold text-white mb-4">404</h1>
        </motion.div>
        <h2 className="text-3xl text-gray-300 mb-8">ページが見つかりません</h2>
        <p className="text-gray-400 mb-8">
          お探しのページは移動または削除された可能性があります
        </p>
        <Link
          href="/"
          className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-200"
        >
          ホームに戻る
        </Link>
      </div>
    </div>
  )
}
