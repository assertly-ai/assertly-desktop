import { Test, useTestStore } from '@renderer/store/testStore'
import { useState } from 'react'
import { FaRegTrashAlt } from 'react-icons/fa'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { ScrollArea } from '../../../../components/ui/scroll-area'
import { RiQuillPenLine, RiSearch2Line } from 'react-icons/ri'
import NewTestForm from './TestForm'
import { Input } from '@components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip'
import TestForm from './TestForm/index'
import { Link } from 'react-router-dom'

export const TestList = () => {
  const { data: tests, deleteTest } = useTestStore()
  const [hoveredTestId, setHoveredTestId] = useState<number | null>(null)

  return (
    <>
      <div className="flex items-center px-4 pr-3 py-2">
        <div className="flex justify-start items-center flex-1 bg-purple-50 bg-opacity-[0.08] rounded-lg focus-visible:ring-0 px-3 py-0.5">
          <span className="text-purple-50 text-opacity-20 text-sm">
            <RiSearch2Line />
          </span>
          <Input
            placeholder="Search"
            className="text-white placeholder:text-md placeholder:text-purple-50 placeholder:text-opacity-20 placeholder:font-medium border-transparent rounded-lg focus-visible:ring-0 px-1.5"
          ></Input>
        </div>
      </div>

      <div className="flex justify-start  items-center px-5 pr-2 py-2 text-purple-50 text-opacity-30">
        <div className="flex flex-1 gap-2 justify-start items-center">
          <RiQuillPenLine />
          <span className="text-md font-semibold text-purple-50 text-opacity-30">Scripts</span>
        </div>
        <div className="flex justify-start items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <NewTestForm />
              </TooltipTrigger>
              <TooltipContent
                side="bottom"
                align="center"
                sideOffset={8}
                className="bg-[#1a1a1a] rounded-md p-2"
              >
                <p className="text-white text-sm">Start a new Test</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="flex flex-col h-full pr-0 py-1">
        <ScrollArea className="relative">
          <nav className="flex flex-col space-y-0.5 text-zinc-300 font-normal">
            {tests.map((test: Test) => (
              <>
                <div
                  key={test.id}
                  className="bg-transparent flex justify-between items-center mx-2 pe-2 py-[0.2px] rounded-lg hover:bg-purple-300 hover:bg-opacity-5 hover:shadow-sm transition"
                  onMouseEnter={() => setHoveredTestId(test.id)} // Set hovered ID on mouse enter
                  onMouseLeave={() => setHoveredTestId(null)} // Clear hovered ID on mouse leave
                >
                  <Link
                    to={'/tests/' + test.id}
                    className="flex justify-start items-center gap-2 w-full shadow-none p-2 text-zinc-300 text-opacity-90 font-normal text-sm"
                  >
                    <div className="rounded-md bg-purple-500 bg-opacity-10 p-1">
                      <IoDocumentTextOutline />
                    </div>
                    {test.name}
                  </Link>
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
              </>
            ))}
          </nav>
        </ScrollArea>
        <div className="flex flex-1 window-drag-region"></div>
      </div>
    </>
  )
}
