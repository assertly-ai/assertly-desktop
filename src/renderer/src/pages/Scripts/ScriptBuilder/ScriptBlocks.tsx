import { useScriptBlockStore } from '@renderer/store/scriptBlockStore'
import { Block } from './Block'
import { Button } from '@components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip'
import { useEffect, useState } from 'react'
import { sortBy } from 'lodash'
import { FiPlus } from 'react-icons/fi'

type PropType = { scriptId: number }

export const ScriptBlocks = ({ scriptId }: PropType) => {
  const { createScriptBlock, getScriptBlocksByScriptId } = useScriptBlockStore()
  const scriptBlocks = getScriptBlocksByScriptId(scriptId)
  const [blockOrder, setBlockOrder] = useState<number>(0)
  const handleAddNewCodeBlock = () => {
    createScriptBlock({
      code: '',
      scriptId: scriptId,
      instruction: '',
      blockOrder: blockOrder
    })
  }
  useEffect(() => {
    setBlockOrder(scriptBlocks.length)
    sortBy(scriptBlocks, [blockOrder])
  }, [scriptBlocks])
  return (
    <div className="w-full">
      <div className="flex justify-start items-center px-2 py-2 text-white text-opacity-40">
        <div className="flex flex-1 gap-2 justify-start items-center">
          <span className="text-md font-medium text-white text-opacity-40">Script Blocks</span>
        </div>
        <div className="flex justify-start items-center">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant={'default'}
                  size={'icon'}
                  className="w-8 h-8 flex items-center shadow-none justify-center p-0 rounded-md transition text-white text-opacity-30 hover:text-opacity-60 border-none"
                  onClick={handleAddNewCodeBlock}
                >
                  <span className="text-lg font-semibold">
                    <FiPlus />
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
        {scriptBlocks?.map((block, index) => <Block key={block?.id} index={index} block={block} />)}
      </div>
    </div>
  )
}
