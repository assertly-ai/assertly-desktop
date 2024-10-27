import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { ScrollArea } from '@components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip'
import { useScriptStore } from '@renderer/store/scriptStore'
import Script from '@renderer/types/script'
import { useState } from 'react'
import { FaRegTrashAlt } from 'react-icons/fa'
import { FiEdit3, FiPlus } from 'react-icons/fi'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { RiQuillPenLine, RiSearch2Line } from 'react-icons/ri'
import { Link } from 'react-router-dom'

export const ScriptList = () => {
  const { data: scripts, createScript, deleteScript, updateScript } = useScriptStore()
  const [hoveredScriptId, setHoveredScriptId] = useState<number | null>(null)
  const [editableScriptId, setEditableScriptId] = useState<number | null>(null)
  const [newScriptName, setNewScriptName] = useState<string>('')
  const [creatingNewScript, setCreatingNewScript] = useState<boolean>(false)
  const [showErrorTooltip, setShowErrorTooltip] = useState<boolean>(false)

  const handleEditClick = (scriptId: number, scriptName: string) => {
    setEditableScriptId(scriptId)
    setNewScriptName(scriptName)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewScriptName(e.target.value)
    if (showErrorTooltip) setShowErrorTooltip(false)
  }

  const handleNameSave = (scriptId: number) => {
    if (newScriptName.trim()) updateScript(scriptId, { name: newScriptName })
    setEditableScriptId(null)
  }

  const handleNewScriptSave = (isKey?: boolean) => {
    if (newScriptName.trim()) {
      createScript({ name: newScriptName })
      setCreatingNewScript(false)
      setNewScriptName('')
      setShowErrorTooltip(false)
    } else if (isKey) {
      setShowErrorTooltip(true)
    }
  }

  return (
    <>
      <div className="flex items-center px-3 pr-0 py-1">
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

      <div className="flex justify-start items-center px-4 pr-0 py-3 text-purple-50 text-opacity-40">
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
                  disabled={creatingNewScript}
                  className="w-8 h-8 flex items-center shadow-none justify-center p-0 rounded-md transition text-purple-50 text-opacity-30 hover:text-opacity-60 border-none"
                  onClick={() => {
                    if (!creatingNewScript) {
                      setCreatingNewScript(true)
                      setNewScriptName('')
                    }
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
                sideOffset={-4}
                className="bg-[#1a1a1a] text-[10px] rounded-md p-2"
              >
                <p className="text-white">Start a new Script</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex flex-col h-full pr-0 py-1">
        <ScrollArea className="relative">
          <nav className="flex flex-col space-y-0.5 text-zinc-300 font-normal">
            {creatingNewScript && (
              <TooltipProvider>
                <Tooltip open={showErrorTooltip}>
                  <TooltipTrigger asChild>
                    <div className="bg-transparent flex justify-between items-center mx-2 mr-1 px-1 py-[0.2px] rounded-lg hover:bg-white hover:bg-opacity-10 hover:shadow-sm transition">
                      <div className="flex justify-start items-center gap-2.5 w-full shadow-none p-2 text-zinc-300 text-opacity-90 font-normal text-sm">
                        <div className="rounded-md bg-white bg-opacity-5 p-1.5">
                          <IoDocumentTextOutline />
                        </div>
                        <Input
                          value={newScriptName}
                          onChange={handleNameChange}
                          onBlur={() => {
                            setShowErrorTooltip(false)
                            handleNewScriptSave()
                            setCreatingNewScript(false)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleNewScriptSave(true)
                          }}
                          autoFocus
                          className="flex-1 text-zinc-300 rounded-none placeholder:text-purple-50  placeholder:text-opacity-50 text-opacity-90 font-normal text-sm p-0 mx-2 h-full border-none focus:ring-0 focus:outline-none"
                          placeholder="New Script Name"
                          style={{ boxShadow: 'none' }} // Remove any default box shadow
                        />
                      </div>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    align="end"
                    className="bg-[#1a1a1a80] text-[10px] text-white p-1 rounded-md"
                  >
                    Script name cannot be empty.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {scripts.reverse().map((script: Script) => (
              <div
                key={script.id}
                className="bg-transparent flex justify-between items-center mx-2 mr-1 px-1 py-[0.2px] rounded-lg hover:bg-white hover:bg-opacity-10 hover:shadow-sm transition"
                onMouseEnter={() => setHoveredScriptId(script.id)}
                onMouseLeave={() => setHoveredScriptId(null)}
              >
                {editableScriptId === script.id ? (
                  <div className="flex justify-start items-center gap-2.5 w-full shadow-none p-2 text-zinc-200 text-opacity-90 font-normal text-sm">
                    <div className="rounded-md bg-white bg-opacity-5 p-1.5">
                      <IoDocumentTextOutline />
                    </div>
                    <Input
                      value={newScriptName}
                      onChange={handleNameChange}
                      onBlur={() => handleNameSave(script.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleNameSave(script.id)
                      }}
                      autoFocus
                      className="flex-1 text-zinc-300 rounded-none placeholder:text-purple-50 placeholder:text-opacity-50 text-opacity-90 font-normal text-sm p-0 h-full border-none focus:ring-0 focus:outline-none"
                      style={{ boxShadow: 'none' }} // Remove any default box shadow
                    />
                  </div>
                ) : (
                  <Link
                    to={'/scripts/' + script.id}
                    className="flex justify-start items-center gap-2.5 w-full shadow-none p-2 text-zinc-200 text-opacity-90 font-normal text-sm text-clip overflow-hidden whitespace-nowrap"
                  >
                    <div className="rounded-md bg-white bg-opacity-5 p-1.5">
                      <IoDocumentTextOutline />
                    </div>
                    {script.name}
                  </Link>
                )}
                {hoveredScriptId === script.id && (
                  <span
                    onClick={() => handleEditClick(script.id, script.name)}
                    className="cursor-pointer hover:bg-purple-500 hover:bg-opacity-10 p-[6px] me-2 rounded"
                  >
                    <FiEdit3 className="text-sm" />
                  </span>
                )}
                {hoveredScriptId === script.id && (
                  <span
                    onClick={() => deleteScript(script.id)}
                    className="cursor-pointer hover:bg-purple-500 hover:bg-opacity-10 p-[6px] rounded"
                  >
                    <FaRegTrashAlt className="text-xs" />
                  </span>
                )}
              </div>
            ))}
          </nav>
        </ScrollArea>
      </div>
    </>
  )
}
