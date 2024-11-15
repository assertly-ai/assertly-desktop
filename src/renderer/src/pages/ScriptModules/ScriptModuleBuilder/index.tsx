import { PreviewPanelLayout } from '@renderer/components/PanelLayout/PreviewPanelLayout'
import { useParams } from 'react-router-dom'
import { ModuleBlocks } from './ModuleBlocks'

export const ScriptModuleBuilder = () => {
  const { scriptModuleId } = useParams<{ scriptModuleId: string }>()

  return scriptModuleId ? (
    <PreviewPanelLayout
      leftPanel={<ModuleBlocks scriptModuleId={Number(scriptModuleId)} />}
      leftPanelConfig={{
        defaultWidth: 600,
        minWidth: 400,
        maxWidth: 800
      }}
      hasPreview={true}
    />
  ) : null
}
