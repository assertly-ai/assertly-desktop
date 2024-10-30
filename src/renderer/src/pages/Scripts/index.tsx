import { usePanelStore } from '../../store/panelStore'
import { ScriptList } from './ScriptList'
import { PanelLayout } from '@renderer/components/PanelLayout/PanelLayout'

export const Scripts = () => {
  const { currentPanel } = usePanelStore()

  const renderPanel = () => {
    switch (currentPanel) {
      case 'scripts':
        return <ScriptList />
      case 'modules':
        return <ScriptList />
      case 'exploratory':
        return <ScriptList />
      default:
        return <ScriptList />
    }
  }

  return (
    <PanelLayout
      leftPanel={renderPanel()}
      leftPanelConfig={{
        defaultWidth: 400,
        minWidth: 250,
        maxWidth: 400
      }}
    />
  )
}
