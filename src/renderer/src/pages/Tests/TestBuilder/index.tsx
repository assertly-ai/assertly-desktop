import { Tabs, TabsContent, TabsList, TabsTrigger } from '@components/ui/tabs'
import ExpandableEditor from '@components/ui/expandableEditor'

export const TestBuilder = ({ id }: { id: number }): JSX.Element => {
  return (
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
        <ExpandableEditor language="javascript" id={id} />
      </TabsContent>
      <TabsContent value="text">
        <ExpandableEditor language="markdown" id={id} />
      </TabsContent>
    </Tabs>
  )
}
