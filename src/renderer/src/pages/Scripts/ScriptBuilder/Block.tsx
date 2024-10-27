import { Button } from '@components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import { BlockEditor } from '@renderer/components/BlockEditor/BlockEditor'
import { usePlaywright } from '@renderer/hooks/usePlaywright'
import { useScriptBlockStore } from '@renderer/store/scriptBlockStore'
import ScriptBlock from '@renderer/types/scriptBlock'
import { RiArrowDownLine, RiArrowUpLine, RiDeleteBin5Line, RiPlayLargeLine } from 'react-icons/ri'

export const Block = ({ block }: { block: ScriptBlock }) => {
  const { runPlaywrightCode } = usePlaywright()
  const { deleteScriptBlock } = useScriptBlockStore()

  const handleRunCode = () => {
    if (block?.code) {
      runPlaywrightCode(block.code)
    }
  }

  const handleDelete = () => {
    deleteScriptBlock(block.id)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex">
        <Tabs defaultValue="code" className="w-full p-2 ">
          <div className="flex justify-between items-center px-1">
            <TabsList className="bg-zinc-800">
              <TabsTrigger
                value="code"
                className="text-zinc-100 data-[state=active]:bg-zinc-600 data-[state=active]:text-zinc-100"
              >
                Code
              </TabsTrigger>
              <TabsTrigger
                value="text"
                className="text-zinc-100 data-[state=active]:bg-zinc-600 data-[state=active]:text-zinc-100"
              >
                Text
              </TabsTrigger>
            </TabsList>
            <div className="flex justify-end items-center rounded bg-white bg-opacity-5">
              <Button
                size={'icon'}
                variant={'default'}
                className="hover:bg-white hover:bg-opacity-5 text-white text-opacity-50"
              >
                <RiArrowUpLine />
              </Button>
              <Button
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
