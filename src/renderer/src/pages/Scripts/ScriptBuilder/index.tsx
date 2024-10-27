import { useParams } from 'react-router-dom'
import { ScriptBlocks } from './ScriptBlocks'
import { PreviewPanelLayout } from '@renderer/components/PanelLayout/PreviewPanelLayout'

export const ScriptBuilder = () => {
  const { scriptId } = useParams<{ scriptId: string }>()

  return scriptId ? (
    <PreviewPanelLayout
      leftPanel={<ScriptBlocks scriptId={Number(scriptId)} />}
      leftPanelConfig={{
        defaultWidth: 600,
        minWidth: 400,
        maxWidth: 800
      }}
      hasPreview={true}
    />
  ) : null
}
