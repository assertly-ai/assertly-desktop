import { ScriptList } from './ScriptList'
import { PanelLayout } from '@renderer/components/PanelLayout/PanelLayout'

export const Scripts = () => {
  return (
    <PanelLayout
      leftPanel={<ScriptList />}
      leftPanelConfig={{
        defaultWidth: 300,
        minWidth: 250,
        maxWidth: 400
      }}
    />
  )
}