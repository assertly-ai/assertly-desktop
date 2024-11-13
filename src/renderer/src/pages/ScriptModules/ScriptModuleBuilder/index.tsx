import { PreviewPanelLayout } from '@renderer/components/PanelLayout/PreviewPanelLayout'
import { useParams } from 'react-router-dom'
import { ScriptModuleBlock } from './ScriptModuleBlocks'

export const ScriptModuleBuilder = () => {
  const { scriptModuleId } = useParams<{ scriptModuleId: string }>()

  return scriptModuleId ? (
    <PreviewPanelLayout
      leftPanel={<ScriptModuleBlock scriptModuleId={Number(scriptModuleId)} />}
      leftPanelConfig={{
        defaultWidth: 700,
        minWidth: 400,
        maxWidth: 800
      }}
      hasPreview={true}
    />
  ) : null
}
