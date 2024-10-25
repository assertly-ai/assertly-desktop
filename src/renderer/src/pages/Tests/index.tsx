import { TestList } from './TestList'
import { PanelLayout } from '@renderer/components/PanelLayout/PanelLayout'

export const Tests = () => {
  return <PanelLayout leftPanel={<TestList />} defaultLeftSize={20} defaultRightSize={80} />
}
