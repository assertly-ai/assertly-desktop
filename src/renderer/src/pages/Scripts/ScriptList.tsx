import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@components/ui/resizable'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip'
import { Table, TableBody, TableCell, TableRow } from '@components/ui/table'
import { useScriptStore } from '@renderer/store/scriptStore'
import Script from '@renderer/types/script'
import { useState } from 'react'
import { FaRegTrashAlt } from 'react-icons/fa'
import { FiEdit3, FiPlus } from 'react-icons/fi'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { RiQuillPenLine } from 'react-icons/ri'
import { Link } from 'react-router-dom'

export const ScriptList = () => {
  const { data: scripts, createScript, deleteScript, updateScript } = useScriptStore()
  const [, setHoveredScriptId] = useState<number | null>(null)
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
    <div className="h-full w-full">
      <ResizablePanelGroup direction="horizontal" className="min-h-[calc(100vh-2rem)] rounded-lg">
        <ResizablePanel defaultSize={60} minSize={40} maxSize={60} className="min-h-full">
          {/* Left Section - Scripts List */}
          <div className="flex flex-col gap-2 h-full p-2">
            {/* Header Section */}
            <div className="py-2 px-2 border-b border-white/5">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <RiQuillPenLine className="text-xl text-white/40" />
                  <h1 className="text-lg font-semibold text-white/40">Scripts</h1>
                </div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 p-0 text-white/40 hover:text-white/90 hover:bg-white/10 rounded-full [&_svg]:size-6"
                        onClick={() => {
                          if (!creatingNewScript) {
                            setCreatingNewScript(true)
                            setNewScriptName('')
                          }
                        }}
                      >
                        <FiPlus className="text-2xl text-white/40" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent side="left" className="bg-[#1a1a1a] text-[11px] rounded-lg p-2">
                      <p className="text-white">Start a new session</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </div>

            {/* Table Section */}
            <div className="bg-white/5 rounded-lg border border-white/5 overflow-hidden">
              <Table>
                <TableBody>
                  {creatingNewScript && (
                    <TableRow className="border-b border-white/10 hover:bg-white/5">
                      <TableCell className="px-4 py-2">
                        <TooltipProvider>
                          <Tooltip open={showErrorTooltip}>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-3">
                                <div className="rounded-md bg-white/10 p-2">
                                  <IoDocumentTextOutline className="text-white/90 text-base" />
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
                                  className="flex-1 bg-transparent border-none text-zinc-300 text-sm focus:ring-0 placeholder:text-white/50"
                                  placeholder="New Script Name"
                                />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent
                              side="bottom"
                              className="bg-[#1a1a1a] text-[11px] text-white/90 p-2 rounded-lg"
                            >
                              Script name cannot be empty
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </TableCell>
                      <TableCell className="px-4 py-2" />
                    </TableRow>
                  )}
                  {scripts.reverse().map((script: Script) => (
                    <TableRow
                      key={script.id}
                      onMouseEnter={() => setHoveredScriptId(script.id)}
                      onMouseLeave={() => setHoveredScriptId(null)}
                      className="border-b border-white/5 hover:bg-white/5"
                    >
                      <TableCell className="px-4 py-2">
                        {editableScriptId === script.id ? (
                          <div className="flex items-center gap-3">
                            <div className="rounded-md bg-white/10 p-2">
                              <IoDocumentTextOutline className="text-white/90 text-base" />
                            </div>
                            <Input
                              value={newScriptName}
                              onChange={handleNameChange}
                              onBlur={() => handleNameSave(script.id)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleNameSave(script.id)
                              }}
                              autoFocus
                              className="flex-1 bg-transparent border-none text-zinc-300 text-sm focus:ring-0"
                            />
                          </div>
                        ) : (
                          <Link
                            to={'/scripts/' + script.id}
                            className="flex items-center gap-3 text-zinc-300/90 hover:text-zinc-100 text-sm"
                          >
                            <div className="rounded-md bg-white/10 p-2">
                              <IoDocumentTextOutline className="text-base" />
                            </div>
                            {script.name}
                          </Link>
                        )}
                      </TableCell>
                      <TableCell className="px-4 py-2 text-right">
                        <div className="flex justify-end gap-1">
                          <button
                            onClick={() => handleEditClick(script.id, script.name)}
                            className="p-1.5 hover:bg-white/10 rounded-md text-white/60 hover:text-white/90 transition-colors"
                          >
                            <FiEdit3 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => deleteScript(script.id)}
                            className="p-1.5 hover:bg-white/10 rounded-md text-white/60 hover:text-white/90 transition-colors"
                          >
                            <FaRegTrashAlt className="h-3 w-3" />
                          </button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle className="" />

        <ResizablePanel defaultSize={40} minSize={30} className="min-h-full p-2">
          {/* Right Section */}
          <div className="h-full bg-white/5 rounded-lg border border-white/10 p-6">
            <div className="text-white/50 text-center">Select a script to view or edit</div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  )
}
