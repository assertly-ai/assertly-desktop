import ExpandableEditor from '@components/ui/expandableEditor'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import ScriptBlock from '@renderer/types/scriptBlock'

export const Block = ({ block }: { block: ScriptBlock }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="flex">
        <Tabs defaultValue="code" className="w-full p-2 ">
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
          <TabsContent value="code">
            <ExpandableEditor language="javascript" data={block} />
          </TabsContent>
          <TabsContent value="text">
            <ExpandableEditor language="markdown" data={block} />
          </TabsContent>
        </Tabs>
      </div>
      <div className="flex flex-1 window-drag-region"></div>
    </div>
  )
}