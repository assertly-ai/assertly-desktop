import { Button } from '@components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import { BlockEditor } from '@renderer/components/BlockEditor/BlockEditor'
import { usePlaywright } from '@renderer/hooks/usePlaywright'
import { useScriptBlockStore } from '@renderer/store/scriptBlockStore'
import ScriptBlock from '@renderer/types/scriptBlock'
import { useEffect, useState } from 'react'
import { RiArrowDownLine, RiArrowUpLine, RiDeleteBin5Line, RiPlayLargeLine } from 'react-icons/ri'

export const Block = ({ block }: { block: ScriptBlock }) => {
  const { runPlaywrightCode } = usePlaywright()
  const { deleteScriptBlock, getScriptBlocksByScriptId, updateScriptBlock } = useScriptBlockStore()
  const scriptBlocks = getScriptBlocksByScriptId(block.scriptId)
  const [moveUp, setMoveUp] = useState(block.blockOrder === 0)
  const [moveDown, setMoveDown] = useState(block.blockOrder === scriptBlocks.length - 1)

  const handleRunCode = () => {
    if (block?.code) {
      runPlaywrightCode(block.code)
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
          <TabsContent value="text">
            <BlockEditor language="markdown" data={block} />
          </TabsContent>
        </Tabs>
      </div>
      <div className="flex flex-1 window-drag-region"></div>
    </div>
  )
}
