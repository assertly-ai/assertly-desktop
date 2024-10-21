import { useTestStore } from '@renderer/store/testStore'
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
    <div>
      <ScrollArea className="relative h-[calc(100vh-80px)]">
        <nav className="flex flex-col space-y-2 py-4">
          {tests.map((test) => (
            <div
              key={test.id}
              className="bg-transparent flex justify-between items-center mx-2 pe-2 py-[0.2px] rounded hover:bg-gray-800 hover:bg-opacity-10 hover:shadow-sm transition"
              onMouseEnter={() => setHoveredTestId(test.id)} // Set hovered ID on mouse enter
              onMouseLeave={() => setHoveredTestId(null)} // Clear hovered ID on mouse leave
            >
              <Button className="flex justify-start w-full shadow-none p-1 px-3 text-black">
                <IoDocumentTextOutline />
                {test.name}
              </Button>
              {/* Show trash icon only if the current test ID is hovered */}
              {hoveredTestId === test.id && (
                <span className="cursor-pointer  hover:bg-[#ccc] p-[6px] rounded me-2">
                  <TestForm type="edit" data={test} />
                </span>
              )}
              {hoveredTestId === test.id && (
                <span
                  onClick={() => deleteTest(test.id)}
                  className="cursor-pointer  hover:bg-[#ccc] p-[6px] rounded"
                >
                  <FaRegTrashAlt className=" text-sm" />
                </span>
              )}
            </div>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}
