import { useScriptBlockStore } from '@renderer/store/scriptBlockStore'
import { Block } from './Block'
import { Button } from '@components/ui/button'
import { RiAddFill } from 'react-icons/ri'

export const ScriptBlocks = ({ scriptId }: { scriptId: number }) => {
  const { createScriptBlock, getScriptBlocksByScriptId } = useScriptBlockStore()
  const scriptBlocks = getScriptBlocksByScriptId(scriptId)
  const handleAddNewCodeBlock = () => {
    createScriptBlock({
      code: '',
      scriptId: scriptId,
      instruction: ''
    })
  }
  return (
    <div>
      <div className="flex">
        <Button onClick={handleAddNewCodeBlock}>
          <RiAddFill /> Code Block
        </Button>
      </div>
      <div>{scriptBlocks?.map((block) => <Block key={block?.id} block={block} />)}</div>
    </div>
  )
}
