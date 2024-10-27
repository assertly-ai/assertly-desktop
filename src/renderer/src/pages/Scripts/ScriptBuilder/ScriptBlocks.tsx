import { useScriptBlockStore } from '@renderer/store/scriptBlockStore'
import { Block } from './Block'
import { Button } from '@components/ui/button'
import { RiAddLine, RiCodeSSlashLine } from 'react-icons/ri'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip'

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
    <div className="w-full">
      <div className="flex justify-start items-center px-5 pr-2 py-2 text-purple-50 text-opacity-40">
        <div className="flex flex-1 gap-2 justify-start items-center">
          <RiCodeSSlashLine />
          <span className="text-md font-semibold text-purple-50 text-opacity-40">Blocks</span>
        </div>
        <div className="flex justify-start items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={'default'}
                  size={'icon'}
                  className="w-8 h-8 flex items-center shadow-none justify-center p-0 rounded-md transition text-purple-50 text-opacity-30 hover:text-opacity-60 border-none"
                  onClick={handleAddNewCodeBlock}
                >
                  <span className="text-lg font-semibold">
                    <RiAddLine />
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent
                side="left"
                align="center"
                sideOffset={-4}
                className="bg-[#1a1a1a] text-[10px] rounded-md p-2"
              >
                <p className="text-white">Add new block</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
      <div className="w-full">
        {scriptBlocks?.map((block) => <Block key={block?.id} block={block} />)}
      </div>
    </div>
  )
}
