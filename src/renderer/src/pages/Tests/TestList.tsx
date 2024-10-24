import { Test, useTestStore } from '@renderer/store/testStore'
import { useState } from 'react'
import { FaRegTrashAlt } from 'react-icons/fa'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { Button } from '../../../../components/ui/button'
import { ScrollArea } from '../../../../components/ui/scroll-area'
import TestForm from './TestForm/index'

export const TestList = () => {
  const { data: tests, deleteTest } = useTestStore()
  const [hoveredTestId, setHoveredTestId] = useState<number | null>(null)

  return (
    <div className="flex flex-col h-full px-1 pr-0 py-2">
      <ScrollArea className="relative">
        <nav className="flex flex-col space-y-2 text-zinc-300 font-normal">
          {tests.map((test: Test) => (
            <>
              <div
                key={test.id}
                className="bg-transparent flex justify-between items-center mx-2 pe-2 py-[0.2px] rounded hover:bg-gray-800 hover:bg-opacity-10 hover:shadow-sm transition"
                onMouseEnter={() => setHoveredTestId(test.id)} // Set hovered ID on mouse enter
                onMouseLeave={() => setHoveredTestId(null)} // Clear hovered ID on mouse leave
              >
                <Button className="flex justify-start w-full shadow-none p-1 px-3 text-zinc-300 font-normal">
                  <IoDocumentTextOutline />
                  {test.name}
                </Button>
                {/* Show trash icon only if the current test ID is hovered */}
                {hoveredTestId === test.id && (
                  <span className="cursor-pointer  hover:bg-purple-500 hover:bg-opacity-10 p-[6px] rounded me-2">
                    <TestForm type="edit" data={test} />
                  </span>
                )}
                {hoveredTestId === test.id && (
                  <span
                    onClick={() => deleteTest(test.id)}
                    className="cursor-pointer hover:bg-purple-500 hover:bg-opacity-10 p-[6px] rounded"
                  >
                    <FaRegTrashAlt className="text-xs" />
                  </span>
                )}
              </div>
              {/* <TestBuilder id={test.id} /> */}
            </>
          ))}
        </nav>
      </ScrollArea>
      <div className="flex flex-1 window-drag-region"></div>
    </div>
  )
}
