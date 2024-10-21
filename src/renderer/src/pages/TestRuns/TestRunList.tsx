import { FaPlus } from 'react-icons/fa6'
import { Button } from '../../../../components/ui/button'
import { ScrollArea } from '../../../../components/ui/scroll-area'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from '../../../../components/ui/tooltip'

export const TestRunList: React.FC = () => {
  return (
    <div>
      <div className="flex justify-between items-end p-4">
        <h1 className="text-white font-extrabold text-2xl">Tests</h1>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button className="w-8 h-8 flex items-center justify-center p-0 rounded-md bg-slate-200 text-slate-950 hover:bg-slate-500 hover:text-slate-50 transition">
                <FaPlus />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Add to library</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
      <ScrollArea className="relative h-[calc(100vh-80px)]">
        <nav className="flex flex-col space-y-2 px-5">
          {Array.from({ length: 12 }, (_, index) => (
            <Button
              key={index}
              className="bg-transparent shadow-none p-1 px-3 rounded hover:bg-gray-50 hover:bg-opacity-10 hover:shadow-sm transition text-white text-left"
            >
              Navigation Item {index + 1}
            </Button>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}
