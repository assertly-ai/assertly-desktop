import { Button } from '@components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import { BlockEditor } from '@renderer/components/BlockEditor/BlockEditor'
import { usePlaywright } from '@renderer/hooks/usePlaywright'
import { useScriptBlockStore } from '@renderer/store/scriptBlockStore'
import ScriptBlock from '@renderer/types/scriptBlock'
import { useEffect, useState } from 'react'
import { RiArrowDownLine, RiArrowUpLine, RiDeleteBin5Line, RiPlayLargeLine } from 'react-icons/ri'

type LogEntry = {
  id: string
  type: 'log' | 'error' | 'warn' | 'info'
  message: unknown[]
}

type PropType = { block: ScriptBlock }

export const Block = ({ block }: PropType) => {
  const { runPlaywrightCode } = usePlaywright()
  const { deleteScriptBlock, getScriptBlocksByScriptId, updateScriptBlock } = useScriptBlockStore()
  const scriptBlocks = getScriptBlocksByScriptId(block.scriptId)
  const [moveUp, setMoveUp] = useState(block.blockOrder === 0)
  const [moveDown, setMoveDown] = useState(block.blockOrder === scriptBlocks.length - 1)
  const [logs, setLogs] = useState<LogEntry[]>([])

  const handleRunCode = () => {
    if (block?.code) {
      setLogs([])
      runPlaywrightCode(block.code, block.id)
    }
  }

  const handleDelete = () => {
    deleteScriptBlock(block.id)
  }

  const handleMoveUp = () => {
    const [predecessorBlock] = scriptBlocks.filter((b) => b.blockOrder == block.blockOrder - 1)
    updateScriptBlock(predecessorBlock.id, { blockOrder: block.blockOrder })
    updateScriptBlock(block.id, { blockOrder: predecessorBlock.blockOrder })
  }

  const handleMoveDown = () => {
    const [successorBlock] = scriptBlocks.filter((b) => b.blockOrder == block.blockOrder + 1)
    updateScriptBlock(successorBlock.id, { blockOrder: block.blockOrder })
    updateScriptBlock(block.id, { blockOrder: successorBlock.blockOrder })
  }

  useEffect(() => {
    setMoveUp(block.blockOrder === 0 || scriptBlocks.length === 1)
    setMoveDown(block.blockOrder === scriptBlocks.length - 1 || scriptBlocks.length === 1)
  }, [scriptBlocks])

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
        <Tabs defaultValue="code" className="w-full p-2 pr-0">
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
                Text
              </TabsTrigger>
            </TabsList>
            <div className="flex justify-end items-center rounded bg-white bg-opacity-5">
              <Button
                disabled={moveUp}
                onClick={handleMoveUp}
                size={'icon'}
                variant={'default'}
                className="hover:bg-white hover:bg-opacity-5 text-white text-opacity-50"
              >
                <RiArrowUpLine />
              </Button>
              <Button
                disabled={moveDown}
                onClick={handleMoveDown}
                size={'icon'}
                variant={'default'}
                className="hover:bg-white hover:bg-opacity-5 text-white text-opacity-50"
              >
                <RiArrowDownLine />
              </Button>
              <Button
                size={'icon'}
                variant={'default'}
                className="hover:bg-white hover:bg-opacity-5 text-white text-opacity-50"
                onClick={handleDelete}
              >
                <RiDeleteBin5Line />
              </Button>
              <Button
                size={'icon'}
                variant={'default'}
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

      <div className="flex flex-1 window-drag-region"></div>
    </div>
  )
}
