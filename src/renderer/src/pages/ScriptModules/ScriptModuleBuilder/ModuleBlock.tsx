import { Button } from '@components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import { BlockEditor } from '@renderer/components/BlockEditor/BlockEditor'
import { usePlaywright } from '@renderer/hooks/usePlaywright'
import { useScriptModuleBlockStore } from '@renderer/store/scriptModuleBlockStore'
import ScriptModuleBlock from '@renderer/types/scriptModuleBlock'
import { useEffect, useState } from 'react'
import { RiArrowDownLine, RiArrowUpLine, RiDeleteBin5Line, RiPlayLargeLine } from 'react-icons/ri'

type LogEntry = {
  id: string
  type: 'log' | 'error' | 'warn' | 'info'
  message: unknown[]
}

type PropType = { block: ScriptModuleBlock }

export const ModuleBlock = ({ block }: PropType) => {
  const { runPlaywrightCode } = usePlaywright()
  const { deleteScriptModuleBlock, getScriptModuleBlocksByModuleId, updateScriptModuleBlock } =
    useScriptModuleBlockStore()
  const moduleBlocks = getScriptModuleBlocksByModuleId(block.scriptModuleId)
  const [moveUpDisabled, setMoveUpDisabled] = useState(block.blockOrder === 0)
  const [moveDownDisabled, setMoveDownDisabled] = useState(
    block.blockOrder === moduleBlocks.length - 1
  )
  const [logs, setLogs] = useState<LogEntry[]>([])

  const handleRunCode = () => {
    if (block?.code) {
      setLogs([])
      runPlaywrightCode(block.code, block.id)
    }
  }

  const handleDelete = () => {
    deleteScriptModuleBlock(block.id)
  }

  const handleMoveUp = () => {
    const [predecessorBlock] = moduleBlocks.filter((b) => b.blockOrder == block.blockOrder - 1)
    updateScriptModuleBlock(predecessorBlock.id, { blockOrder: block.blockOrder })
    updateScriptModuleBlock(block.id, { blockOrder: predecessorBlock.blockOrder })
  }

  const handleMoveDown = () => {
    const [successorBlock] = moduleBlocks.filter((b) => b.blockOrder == block.blockOrder + 1)
    updateScriptModuleBlock(successorBlock.id, { blockOrder: block.blockOrder })
    updateScriptModuleBlock(block.id, { blockOrder: successorBlock.blockOrder })
  }

  useEffect(() => {
    setMoveUpDisabled(block.blockOrder === 0 || moduleBlocks.length === 1)
    setMoveDownDisabled(block.blockOrder === moduleBlocks.length - 1 || moduleBlocks.length === 1)
  }, [moduleBlocks])

  useEffect(() => {
    const handleLogs = (_: unknown, data: { blockId: number; log: LogEntry }) => {
      if (data.blockId === block.id) {
        setLogs((prev) => {
          if (prev.some((log) => log.id === data.log.id)) {
            return prev
          }
          return [...prev, data.log]
        })
      }
    }

    window.electron.ipcRenderer.on('block-log', handleLogs)

    return () => {
      window.electron.ipcRenderer.removeListener('block-log', handleLogs)
    }
  }, [block.id])

  return (
    <div className="flex flex-col h-full">
      <div className="flex">
        <Tabs defaultValue="code" className="w-full p-1">
          <div className="flex justify-between items-center px-1">
            <TabsList className="bg-white bg-opacity-5 rounded-md">
              <TabsTrigger
                value="code"
                className="text-zinc-100 data-[state=active]:bg-white data-[state=active]:bg-opacity-20 data-[state=active]:text-zinc-100"
              >
                Code
              </TabsTrigger>
              <TabsTrigger
                value="text"
                className="text-zinc-100 data-[state=active]:bg-white data-[state=active]:bg-opacity-20 data-[state=active]:text-zinc-100"
              >
                Instructions
              </TabsTrigger>
            </TabsList>
            <div className="flex justify-end items-center rounded bg-white bg-opacity-5">
              <Button
                disabled={moveUpDisabled}
                onClick={handleMoveUp}
                size={'icon'}
                variant={'ghost'}
                className="hover:bg-white hover:bg-opacity-5 text-white text-opacity-50"
              >
                <RiArrowUpLine />
              </Button>
              <Button
                disabled={moveDownDisabled}
                onClick={handleMoveDown}
                size={'icon'}
                variant={'ghost'}
                className="hover:bg-white hover:bg-opacity-5 text-white text-opacity-50"
              >
                <RiArrowDownLine />
              </Button>
              <Button
                size={'icon'}
                variant={'ghost'}
                className="hover:bg-white hover:bg-opacity-5 text-white text-opacity-50"
                onClick={handleDelete}
              >
                <RiDeleteBin5Line />
              </Button>
              <Button
                size={'icon'}
                variant={'ghost'}
                className="hover:bg-white hover:bg-opacity-5 text-green-500 text-opacity-80"
                onClick={handleRunCode}
              >
                <RiPlayLargeLine />
              </Button>
            </div>
          </div>
          <TabsContent value="code" className="mt-1">
            <BlockEditor language="javascript" data={block} />
          </TabsContent>
          <TabsContent value="text" className="mt-1">
            <BlockEditor language="markdown" data={block} />
          </TabsContent>
        </Tabs>
      </div>

      {logs.length > 0 && (
        <div className="px-2 pr-0">
          <div className="bg-black bg-opacity-20 p-4 rounded-md max-h-[200px] overflow-y-auto">
            {logs.map((log, index) => (
              <div
                key={index}
                className={`font-mono text-xs mb-1 ${
                  log.type === 'error'
                    ? 'text-red-400'
                    : log.type === 'warn'
                      ? 'text-yellow-400'
                      : 'text-white/80'
                }`}
              >
                {log.message
                  .map((msg) =>
                    typeof msg === 'object' ? JSON.stringify(msg, null, 2) : String(msg)
                  )
                  .join(' ')}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
