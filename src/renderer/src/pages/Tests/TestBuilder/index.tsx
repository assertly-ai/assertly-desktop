import { useParams } from 'react-router-dom'
import { ScriptBlocks } from './ScriptBlocks'
import { PanelLayout } from '@renderer/components/PanelLayout/PanelLayout'

export const TestBuilder = () => {
  const { testId } = useParams<{ testId: string }>()

  return testId ? (
    <PanelLayout
      leftPanel={<ScriptBlocks testId={testId} />}
      defaultLeftSize={40}
      defaultRightSize={60}
    />
  ) : null
}
