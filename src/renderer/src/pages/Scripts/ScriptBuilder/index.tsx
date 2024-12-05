import { useParams } from 'react-router-dom'
import { ScriptBlocks } from './ScriptBlocks'
import { PanelLayout } from '@renderer/components/PanelLayout/PanelLayout'

export const ScriptBuilder = () => {
  const { scriptId } = useParams<{ scriptId: string }>()

  return scriptId ? (
    <PanelLayout
      leftPanelConfig={{
        defaultWidth: 600,
        minWidth: 400,
        maxWidth: 800
      }}
    >
      <ScriptBlocks scriptId={Number(scriptId)} />
    </PanelLayout>
  ) : null
}
