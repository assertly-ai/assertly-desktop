import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { ScrollArea } from '@components/ui/scroll-area'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip'
import { useScriptModuleStore } from '@renderer/store/scriptModuleStore'
import Script from '@renderer/types/script'
import { useState } from 'react'
import { FaRegTrashAlt } from 'react-icons/fa'
import { FiEdit3, FiPlus } from 'react-icons/fi'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { RiFolder2Fill, RiSearch2Line } from 'react-icons/ri'
import { Link } from 'react-router-dom'

export const ScriptModules = () => {
  const {
    data: scriptsModules,
    createScriptModule,
    deleteScriptModule,
    updateScriptModule
  } = useScriptModuleStore()
  const [hoveredScriptModuleId, setHoveredScriptModuleId] = useState<number | null>(null)
  const [editableScriptModuleId, setEditableScriptModuleId] = useState<number | null>(null)
  const [newScriptModuleName, setNewScriptModuleName] = useState<string>('')
  const [creatingNewScriptModule, setCreatingNewScriptModule] = useState<boolean>(false)
  const [showErrorTooltip, setShowErrorTooltip] = useState<boolean>(false)

  const handleEditClick = (scriptModuleId: number, scriptModuleName: string) => {
    setEditableScriptModuleId(scriptModuleId)
    setNewScriptModuleName(scriptModuleName)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewScriptModuleName(e.target.value)
    if (showErrorTooltip) setShowErrorTooltip(false)
  }

  const handleNameSave = (scriptModuleId: number) => {
    if (newScriptModuleName.trim())
      updateScriptModule(scriptModuleId, { name: newScriptModuleName })
    setEditableScriptModuleId(null)
  }

  const handleNewScriptModuleSave = (isKey?: boolean) => {
    if (newScriptModuleName.trim()) {
      createScriptModule({ name: newScriptModuleName })
      setCreatingNewScriptModule(false)
      setNewScriptModuleName('')
      setShowErrorTooltip(false)
    } else if (isKey) {
      setShowErrorTooltip(true)
    }
  }

  return (
    <>
      <div className="flex items-center px-3 py-1">
        <div className="flex justify-start items-center gap-1 flex-1 bg-white bg-opacity-[0.1] rounded-lg focus-visible:ring-0 focus-within:border-white border border-transparent focus-within:border-opacity-10  px-3 py-0.5">
          <span className="text-white text-opacity-20 text-sm">
            <RiSearch2Line />
          </span>
          <Input
            placeholder="Search scripts"
            className="text-white placeholder:text-md placeholder:text-white placeholder:text-opacity-20 placeholder:font-medium border-transparent rounded-lg focus-visible:ring-0 px-1.5"
          />
        </div>
      </div>

      <div className="flex justify-start items-center px-4 py-4 text-white text-opacity-40">
        <div className="flex flex-1 gap-2 justify-start items-center">
          <RiFolder2Fill />
          <span className="text-md font-medium text-white text-opacity-40">Modules</span>
        </div>
        <div className="flex justify-start items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={'default'}
                  size={'icon'}
                  disabled={creatingNewScriptModule}
                  className="w-6 h-6 flex items-center shadow-none justify-center p-0 rounded-md transition text-white text-opacity-30 hover:text-opacity-60 border-none"
                  onClick={() => {
                    if (!creatingNewScriptModule) {
                      setCreatingNewScriptModule(true)
                      setNewScriptModuleName('')
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
                className="bg-[#1a1a1a] text-[10px] rounded-md p-2"
              >
                <p className="text-white">Start a new Script Module</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      <div className="flex flex-col h-full py-1">
        <ScrollArea>
          <nav className="flex flex-col space-y-0.5 text-zinc-300 font-normal">
            {creatingNewScriptModule && (
              <TooltipProvider>
                <Tooltip open={showErrorTooltip}>
                  <TooltipTrigger asChild>
                    <div className="bg-transparent flex justify-between items-center mx-2 px-1 py-[0.2px] rounded-lg hover:bg-white hover:bg-opacity-10 hover:shadow-sm transition">
                      <div className="flex justify-start items-center gap-2.5 w-full shadow-none p-2 text-zinc-300 text-opacity-90 font-normal text-sm">
                        <div className="rounded-md bg-white bg-opacity-5 p-1.5">
                          <IoDocumentTextOutline />
                        </div>
                        <Input
                          value={newScriptModuleName}
                          onChange={handleNameChange}
                          onBlur={() => {
                            setShowErrorTooltip(false)
                            handleNewScriptModuleSave()
                            setCreatingNewScriptModule(false)
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleNewScriptModuleSave(true)
                          }}
                          autoFocus
                          className="flex-1 text-zinc-300 rounded-none placeholder:text-white  placeholder:text-opacity-50 text-opacity-90 font-normal text-sm p-0 mx-2 h-full border-none focus:ring-0 focus:outline-none"
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
            {scriptsModules.reverse().map((scriptModule: Script) => (
              <div
                key={scriptModule.id}
                className="bg-transparent flex justify-between items-center mx-2 px-1 py-[0.2px] rounded-lg hover:bg-white hover:bg-opacity-10 hover:shadow-sm transition"
                onMouseEnter={() => setHoveredScriptModuleId(scriptModule.id)}
                onMouseLeave={() => setHoveredScriptModuleId(null)}
              >
                {editableScriptModuleId === scriptModule.id ? (
                  <div className="flex justify-start items-center gap-2.5 w-full shadow-none p-2 text-zinc-200 text-opacity-90 font-normal text-sm">
                    <div className="rounded-md bg-white bg-opacity-5 p-1.5">
                      <IoDocumentTextOutline />
                    </div>
                    <Input
                      value={newScriptModuleName}
                      onChange={handleNameChange}
                      onBlur={() => handleNameSave(scriptModule.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleNameSave(scriptModule.id)
                      }}
                      autoFocus
                      className="flex-1 text-zinc-300 rounded-none placeholder:text-white placeholder:text-opacity-50 text-opacity-90 font-normal text-sm p-0 h-full border-none focus:ring-0 focus:outline-none"
                      style={{ boxShadow: 'none' }} // Remove any default box shadow
                    />
                  </div>
                ) : (
                  <Link
                    to={'/modules/' + scriptModule.id}
                    className="flex justify-start items-center gap-2.5 w-full shadow-none p-2 text-zinc-200 text-opacity-90 font-normal text-sm text-clip overflow-hidden whitespace-nowrap"
                  >
                    <div className="rounded-md bg-white bg-opacity-5 p-1.5">
                      <IoDocumentTextOutline />
                    </div>
                    {scriptModule.name}
                  </Link>
                )}
                {hoveredScriptModuleId === scriptModule.id && (
                  <span
                    onClick={() => handleEditClick(scriptModule.id, scriptModule.name)}
                    className="cursor-pointer hover:bg-white hover:bg-opacity-10 p-[6px] me-2 rounded"
                  >
                    <FiEdit3 className="text-sm" />
                  </span>
                )}
                {hoveredScriptModuleId === scriptModule.id && (
                  <span
                    onClick={() => deleteScriptModule(scriptModule.id)}
                    className="cursor-pointer hover:bg-white hover:bg-opacity-10 p-[6px] rounded"
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
