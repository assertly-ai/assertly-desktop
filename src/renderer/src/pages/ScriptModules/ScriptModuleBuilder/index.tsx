import { useParams } from 'react-router-dom'
import { ModuleBlocks } from './ModuleBlocks'
import { PanelLayout } from '@renderer/components/PanelLayout/PanelLayout'

export const ScriptModuleBuilder = () => {
  const { scriptModuleId } = useParams<{ scriptModuleId: string }>()

  return scriptModuleId ? (
    <PanelLayout
      leftPanelConfig={{
        defaultWidth: 600,
        minWidth: 400,
        maxWidth: 800
      }}
      hasPreview={true}
    >
      <ModuleBlocks scriptModuleId={Number(scriptModuleId)} />
    </PanelLayout>
  ) : null
}
