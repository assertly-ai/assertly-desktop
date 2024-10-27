import { useParams } from 'react-router-dom'
import { ScriptBlocks } from './ScriptBlocks'
import { PanelLayout } from '@renderer/components/PanelLayout/PanelLayout'
import { useEffect } from 'react'

export const ScriptBuilder = () => {
  const { scriptId } = useParams<{ scriptId: string }>()
  useEffect(() => {
    console.log('script id' + scriptId)
  }, [])
  return scriptId ? (
    <PanelLayout
      leftPanel={<ScriptBlocks scriptId={Number(scriptId)} />}
      leftPanelConfig={{
        defaultWidth: 600,
        minWidth: 400,
        maxWidth: 800
      }}
    />
  ) : null
}
