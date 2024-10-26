import { TestList } from './TestList'
import { PanelLayout } from '@renderer/components/PanelLayout/PanelLayout'

export const Tests = () => {
  return (
    <PanelLayout
      leftPanel={<TestList />}
      leftPanelConfig={{
        defaultWidth: 300,
        minWidth: 250,
        maxWidth: 400
      }}
    />
  )
}
