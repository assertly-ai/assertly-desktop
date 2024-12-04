import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { Table, TableBody, TableCell, TableRow } from '@components/ui/table'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip'
import { useScriptModuleStore } from '@renderer/store/scriptModuleStore'
import ScriptModule from '@renderer/types/scriptModule'
import { useState, useMemo } from 'react'
import { FaRegTrashAlt } from 'react-icons/fa'
import { FiEdit3, FiPlus } from 'react-icons/fi'
import { IoDocumentTextOutline } from 'react-icons/io5'
import { RiBox2Fill } from 'react-icons/ri'
import { Link } from 'react-router-dom'

const ModuleHeader = ({ onNewModule }: { onNewModule: () => void }) => (
  <div className="py-1 px-2 border-b border-white/5">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <RiBox2Fill className="text-lg text-white/40" />
        <h1 className="text-md font-medium text-white/40">Modules</h1>
      </div>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 p-0 text-white/40 hover:text-white/90 hover:bg-white/10 rounded-full [&_svg]:size-5"
              onClick={onNewModule}
            >
              <FiPlus className="text-lg text-white/40" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="left" className="bg-[#1a1a1a] text-[11px] rounded-lg p-2">
            <p className="text-white">Create new module</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  </div>
)

const NewModuleRow = ({
  name,
  onChange,
  onBlur,
  onKeyDown,
  showError
}: {
  name: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: () => void
  onKeyDown: (e: React.KeyboardEvent) => void
  showError: boolean
}) => (
  <TableRow className="border-b border-white/10 hover:bg-white/5">
    <TableCell className="px-4 py-2">
      <TooltipProvider>
        <Tooltip open={showError}>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-3">
              <div className="rounded-md bg-white/10 p-2">
                <IoDocumentTextOutline className="text-white/90 text-base" />
              </div>
              <Input
                value={name}
                onChange={onChange}
                onBlur={onBlur}
                onKeyDown={onKeyDown}
                autoFocus
                className="flex-1 bg-transparent border-none text-zinc-300 text-sm focus:ring-0 placeholder:text-white/50"
                placeholder="New Module Name"
              />
            </div>
          </TooltipTrigger>
          <TooltipContent
            side="bottom"
            className="bg-[#1a1a1a] text-[11px] text-white/90 p-2 rounded-lg"
          >
            Module name cannot be empty
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </TableCell>
    <TableCell className="px-4 py-2" />
  </TableRow>
)

const ModuleRow = ({
  module,
  isEditing,
  editName,
  onEdit,
  onDelete,
  onNameChange,
  onNameSave
}: {
  module: ScriptModule
  isEditing: boolean
  editName: string
  onEdit: () => void
  onDelete: () => void
  onNameChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onNameSave: (e: React.KeyboardEvent | React.FocusEvent) => void
}) => (
  <TableRow className="border-b border-white/5 hover:bg-white/5">
    <TableCell className="px-4 py-2">
      {isEditing ? (
        <div className="flex items-center gap-3">
          <div className="rounded-md bg-white/10 p-2">
            <IoDocumentTextOutline className="text-white/90 text-base" />
          </div>
          <Input
            value={editName}
            onChange={onNameChange}
            onBlur={onNameSave}
            onKeyDown={(e) => e.key === 'Enter' && onNameSave(e)}
            autoFocus
            className="flex-1 bg-transparent border-none text-zinc-300 text-sm focus:ring-0"
          />
        </div>
      ) : (
        <Link
          to={`/modules/${module.id}`}
          className="flex items-center gap-3 text-zinc-300/90 hover:text-zinc-100 text-sm"
        >
          <div className="rounded-md bg-white/10 p-2">
            <IoDocumentTextOutline className="text-base" />
          </div>
          {module.name}
        </Link>
      )}
    </TableCell>
    <TableCell className="px-4 py-2 text-right">
      <div className="flex justify-end gap-1">
        <button
          onClick={onEdit}
          className="p-1.5 hover:bg-white/10 rounded-md text-white/60 hover:text-white/90 transition-colors"
        >
          <FiEdit3 className="h-3.5 w-3.5" />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 hover:bg-white/10 rounded-md text-white/60 hover:text-white/90 transition-colors"
        >
          <FaRegTrashAlt className="h-3 w-3" />
        </button>
      </div>
    </TableCell>
  </TableRow>
)

export const ScriptModules = () => {
  const {
    data: modules,
    createScriptModule,
    deleteScriptModule,
    updateScriptModule
  } = useScriptModuleStore()
  const [editableModuleId, setEditableModuleId] = useState<number | null>(null)
  const [newModuleName, setNewModuleName] = useState('')
  const [creatingNewModule, setCreatingNewModule] = useState(false)
  const [showErrorTooltip, setShowErrorTooltip] = useState(false)

  // Memoize reversed modules to prevent unnecessary re-renders
  const reversedModules = useMemo(() => [...modules].reverse(), [modules])

  const handleNewModule = () => {
    if (!creatingNewModule) {
      setCreatingNewModule(true)
      setNewModuleName('')
    }
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewModuleName(e.target.value)
    if (showErrorTooltip) setShowErrorTooltip(false)
  }

  const handleNewModuleSave = (isKey?: boolean) => {
    if (newModuleName.trim()) {
      createScriptModule({ name: newModuleName })
      setCreatingNewModule(false)
      setNewModuleName('')
      setShowErrorTooltip(false)
    } else if (isKey) {
      setShowErrorTooltip(true)
    }
  }

  const handleEditClick = (moduleId: number, moduleName: string) => {
    setEditableModuleId(moduleId)
    setNewModuleName(moduleName)
  }

  const handleNameSave = (moduleId: number) => {
    if (newModuleName.trim()) {
      updateScriptModule(moduleId, { name: newModuleName })
    }
    setEditableModuleId(null)
  }

  return (
    <div className="h-full w-full">
      <div className="flex flex-col gap-2 h-full p-2 pr-4">
        {/* Header Section */}
        <div className="py-1 px-2 border-b border-white/5">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <RiBox2Fill className="text-lg text-white/40" />
              <h1 className="text-md font-medium text-white/40">Script Modules</h1>
            </div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 p-0 text-white/40 hover:text-white/90 hover:bg-white/10 rounded-full [&_svg]:size-5"
                    onClick={() => {
                      if (!creatingNewModule) {
                        setCreatingNewModule(true)
                        setNewModuleName('')
                      }
                    }}
                  >
                    <FiPlus className="text-lg text-white/40" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="left" className="bg-[#1a1a1a] text-[11px] rounded-lg p-2">
                  <p className="text-white">Create new module</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Table Section */}
        <div className="bg-white/5 rounded-lg border border-white/5 overflow-hidden my-1">
          <Table>
            <TableBody>
              {creatingNewModule && (
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
                              value={newModuleName}
                              onChange={handleNameChange}
                              onBlur={() => {
                                setShowErrorTooltip(false)
                                handleNewModuleSave()
                                setCreatingNewModule(false)
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleNewModuleSave(true)
                              }}
                              autoFocus
                              className="flex-1 bg-transparent border-none text-zinc-300 text-sm focus:ring-0 placeholder:text-white/50"
                              placeholder="New Module Name"
                            />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent
                          side="bottom"
                          className="bg-[#1a1a1a] text-[11px] text-white/90 p-2 rounded-lg"
                        >
                          Module name cannot be empty
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell className="px-4 py-2" />
                </TableRow>
              )}
              {modules.reverse().map((module: ScriptModule) => (
                <TableRow
                  key={module.id}
                  onMouseEnter={() => setHoveredModuleId(module.id)}
                  onMouseLeave={() => setHoveredModuleId(null)}
                  className="border-b border-white/5 hover:bg-white/5"
                >
                  <TableCell className="px-4 py-2">
                    {editableModuleId === module.id ? (
                      <div className="flex items-center gap-3">
                        <div className="rounded-md bg-white/10 p-2">
                          <IoDocumentTextOutline className="text-white/90 text-base" />
                        </div>
                        <Input
                          value={newModuleName}
                          onChange={handleNameChange}
                          onBlur={() => handleNameSave(module.id)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleNameSave(module.id)
                          }}
                          autoFocus
                          className="flex-1 bg-transparent border-none text-zinc-300 text-sm focus:ring-0"
                        />
                      </div>
                    ) : (
                      <Link
                        to={'/modules/' + module.id}
                        className="flex items-center gap-3 text-zinc-300/90 hover:text-zinc-100 text-sm"
                      >
                        <div className="rounded-md bg-white/10 p-2">
                          <IoDocumentTextOutline className="text-base" />
                        </div>
                        {module.name}
                      </Link>
                    )}
                  </TableCell>
                  <TableCell className="px-4 py-2 text-right">
                    <div className="flex justify-end gap-1">
                      <button
                        onClick={() => handleEditClick(module.id, module.name)}
                        className="p-1.5 hover:bg-white/10 rounded-md text-white/60 hover:text-white/90 transition-colors"
                      >
                        <FiEdit3 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => deleteScriptModule(module.id)}
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
    </div>
  )
}
