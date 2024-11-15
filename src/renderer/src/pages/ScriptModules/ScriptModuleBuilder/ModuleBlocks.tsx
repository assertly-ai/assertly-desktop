import { Button } from '@components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@components/ui/tooltip'
import { useScriptModuleBlockStore } from '@renderer/store/scriptModuleBlockStore'
import { sortBy } from 'lodash'
import { useEffect, useState } from 'react'
import { FiPlus } from 'react-icons/fi'
import { ModuleBlock } from './ModuleBlock'

type PropType = { scriptModuleId: number }

export const ModuleBlocks = ({ scriptModuleId }: PropType) => {
  const { createScriptModuleBlock, getScriptModuleBlocksByModuleId } = useScriptModuleBlockStore()
  const moduleBlocks = getScriptModuleBlocksByModuleId(scriptModuleId)
  const [blockOrder, setBlockOrder] = useState<number>(0)

  const handleAddNewCodeBlock = () => {
    createScriptModuleBlock({
      code: '',
      scriptModuleId,
      instruction: '',
      blockOrder
    })
  }

  useEffect(() => {
    setBlockOrder(moduleBlocks.length)
    sortBy(moduleBlocks, [blockOrder])
  }, [moduleBlocks])

  return (
    <div className="w-full">
      <div className="flex justify-start items-center px-5 pr-2 py-2 text-white text-opacity-40">
        <div className="flex flex-1 gap-2 justify-start items-center">
          <span className="text-md font-medium text-white text-opacity-40">Module Blocks</span>
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
        {moduleBlocks?.map((block) => <ModuleBlock key={block?.id} block={block} />)}
      </div>
    </div>
  )
}
