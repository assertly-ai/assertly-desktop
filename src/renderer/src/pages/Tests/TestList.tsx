import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip'
import { Test, useTestStore } from '@renderer/store/testStore'
import { useState } from 'react'
import { FaRegTrashAlt } from 'react-icons/fa'
import { FiEdit3, FiPlus } from 'react-icons/fi'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { RiQuillPenLine, RiSearch2Line } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { ScrollArea } from '../../../../components/ui/scroll-area'

export const TestList = () => {
  const { data: tests, deleteTest, updateTest, createTest } = useTestStore()
  const [hoveredTestId, setHoveredTestId] = useState<number | null>(null)
  const [editableTestId, setEditableTestId] = useState<number | null>(null)
  const [newTestName, setNewTestName] = useState<string>('')
  const [creatingNewTest, setCreatingNewTest] = useState<boolean>(false)
  const [showErrorTooltip, setShowErrorTooltip] = useState<boolean>(false)

  const handleEditClick = (testId: number, testName: string) => {
    setEditableTestId(testId)
    setNewTestName(testName)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTestName(e.target.value)
    if (showErrorTooltip) setShowErrorTooltip(false)
  }

  const handleNameSave = (testId: number) => {
    if (newTestName.trim()) updateTest(testId, { name: newTestName })
    setEditableTestId(null)
  }

  const handleNewTestSave = (isKey?: boolean) => {
    if (newTestName.trim()) {
      createTest({ name: newTestName })
      setCreatingNewTest(false)
      setNewTestName('')
      setShowErrorTooltip(false)
    } else if (isKey) {
      setShowErrorTooltip(true)
    }
  }

  return (
    <>
      <div className="flex items-center px-4 pr-3 py-2">
        <div className="flex justify-start items-center flex-1 bg-purple-50 bg-opacity-[0.1] rounded-lg focus-visible:ring-0 px-3 py-0.5">
          <span className="text-purple-50 text-opacity-20 text-sm">
            <RiSearch2Line />
          </span>
          <Input
            placeholder="Search"
            className="text-white placeholder:text-md placeholder:text-purple-50 placeholder:text-opacity-20 placeholder:font-medium border-transparent rounded-lg focus-visible:ring-0 px-1.5"
          />
        </div>
      </div>

      <div className="flex justify-start items-center px-5 pr-2 py-2 text-purple-50 text-opacity-40">
        <div className="flex flex-1 gap-2 justify-start items-center">
          <RiQuillPenLine />
          <span className="text-md font-semibold text-purple-50 text-opacity-40">Scripts</span>
        </div>
        <div className="flex justify-start items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={'default'}
                  size={'icon'}
                  className="w-8 h-8 flex items-center shadow-none justify-center p-0 rounded-md transition text-purple-50 text-opacity-30 hover:text-opacity-60 border-none"
                  onClick={() => {
                    setCreatingNewTest(true)
                    setNewTestName('')
                  }}
                >
                  <span className="text-lg font-semibold">
                    <FiPlus />
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="left"
                align="center"
                
                sideOffset={-14}
                className="bg-[#1a1a1a] text-[10px] rounded-md p-2"
              >
                <p className="text-white">Start a new Test</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex flex-col h-full pr-0 py-1">
        <ScrollArea className="relative">
          <nav className="flex flex-col space-y-0.5 text-zinc-300 font-normal">
            {creatingNewTest && (
              <TooltipProvider>
                <Tooltip open={showErrorTooltip}>
                  <TooltipTrigger asChild>
                    <div className="flex justify-start items-center gap-2 w-full shadow-none p-2 text-zinc-300 text-opacity-90 font-normal text-sm">
                      <div className="rounded-md bg-purple-500 bg-opacity-10 p-1">
                        <IoDocumentTextOutline />
                      </div>
                      <Input
                        value={newTestName}
                        onChange={handleNameChange}
                        onBlur={() => {
                          setShowErrorTooltip(false)
                          handleNewTestSave()
                          setCreatingNewTest(false)
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleNewTestSave(true)
                        }}
                        autoFocus
                        className="w-full text-zinc-300 text-opacity-90 font-normal text-sm p-2 py-0 mx-2"
                        placeholder="New Test Name"
                      />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="end"
                    className="bg-[#1a1a1a80] text-[10px] text-white p-1 rounded-md"
                  >
                    Test name cannot be empty.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {tests.reverse().map((test: Test) => (
              <div
                key={test.id}
                className="bg-transparent flex justify-between items-center mx-2 mr-1 px-1 py-[0.2px] rounded-lg hover:bg-white hover:bg-opacity-10 hover:shadow-sm transition"
                onMouseEnter={() => setHoveredTestId(test.id)}
                onMouseLeave={() => setHoveredTestId(null)}
              >
                {editableTestId === test.id ? (
                  <div className="flex justify-start items-center gap-2 w-full shadow-none p-2 text-zinc-300 text-opacity-90 font-normal text-sm">
                    <div className="rounded-md bg-purple-500 bg-opacity-10 p-1">
                      <IoDocumentTextOutline />
                    </div>
                    <Input
                      value={newTestName}
                      onChange={handleNameChange}
                      onBlur={() => handleNameSave(test.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleNameSave(test.id)
                      }}
                      autoFocus
                      className="w-full text-zinc-300 text-opacity-90 font-normal text-sm p-2"
                    />
                  </div>
                ) : (
                  <Link
                    to={'/tests/' + test.id}
                    className="flex justify-start items-center gap-2 w-full shadow-none p-2 text-zinc-300 text-opacity-90 font-normal text-sm"
                  >
                    <div className="rounded-md bg-purple-500 bg-opacity-10 p-1">
                      <IoDocumentTextOutline />
                    </div>
                    {test.name}
                  </Link>
                )}
                {hoveredTestId === test.id && (
                  <span
                    onClick={() => handleEditClick(test.id, test.name)}
                    className="cursor-pointer hover:bg-purple-500 hover:bg-opacity-10 p-[6px] me-2 rounded"
                  >
                    <FiEdit3 className="text-sm" />
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
            ))}
          </nav>
        </ScrollArea>
        <div className="flex flex-1 window-drag-region"></div>
      </div>
    </>
  )
}
