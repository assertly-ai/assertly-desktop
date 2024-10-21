import { IoDocumentTextOutline } from 'react-icons/io5'
import { Button } from '../../../../components/ui/button'
import { ScrollArea } from '../../../../components/ui/scroll-area'

export const TestList = () => {
  return (
    <div>
      <ScrollArea className="relative h-[calc(100vh-80px)]">
        <nav className="flex flex-col space-y-2 py-4">
          {Array.from({ length: 12 }, (_, index) => (
            <Button
              key={index}
              className="bg-transparent shadow-none p-1 px-3 mx-2 rounded hover:bg-gray-800 hover:bg-opacity-10 hover:shadow-sm transition text-black flex justify-start"
            >
              <IoDocumentTextOutline />
              Navigation Item {index + 1}
            </Button>
          ))}
        </nav>
      </ScrollArea>
    </div>
  )
}
