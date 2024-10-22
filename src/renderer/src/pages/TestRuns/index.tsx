import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup
} from '../../../../components/ui/resizable'
import { TestRunList } from './TestRunList'

export const TestRuns = () => {
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={30} minSize={25} maxSize={40}>
        <TestRunList />
      </ResizablePanel>
      <ResizableHandle />
      {/* panel 2 */}
      <ResizablePanel></ResizablePanel>
    </ResizablePanelGroup>
  )
}
