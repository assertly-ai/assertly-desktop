import React, { useState } from 'react'
import { Button } from '../../../../components/ui/button'

const LayoutSlider: React.FC = () => {
  const [width, setWidth] = useState<number>(30) // Width in percentage

  const handleMouseMove = (e: MouseEvent): void => {
    const newWidth = Math.min((e.clientX / window.innerWidth) * 100, 50) // Limit to 50%
    setWidth(newWidth)
  }

  const handleMouseUp = (): void => {
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  }

  const handleMouseDown = (): void => {
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <div className="flex h-screen w-screen">
      <div style={{ width: `${width}%` }}>
        <div className="flex justify-between items-center p-4">
          <h1 className="text-white font-bold text-lg">Tests</h1>
          <Button>Add New</Button>
        </div>
        {/* Content for the left div */}
        <div className="relative h-[calc(100vh-80px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent">
          <nav className="flex flex-col space-y-2 p-4">
            {Array.from({ length: 12 }, (_, index) => (
              <div
                key={index}
                className="bg-blue-600 p-3 rounded hover:bg-blue-700 transition text-white"
              >
                Navigation Item {index + 1}
              </div>
            ))}
          </nav>
        </div>
      </div>
      <div className="cursor-col-resize bg-gray-500 w-0.5" onMouseDown={handleMouseDown} />
      <div className="flex-1"></div>
    </div>
  )
}

export default LayoutSlider
