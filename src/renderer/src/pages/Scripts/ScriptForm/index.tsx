import { useScriptStore } from '@renderer/store/scriptStore'
import { useState } from 'react'
import { FiEdit3, FiPlus } from 'react-icons/fi'
import { Button } from '../../../../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../../../../../components/ui/dialog'
import Script from '@renderer/types/script'

type PropType = {
  type?: string
  data?: Script
}

const ScriptForm = ({ type, data }: PropType) => {
  const [name, setName] = useState(data?.name || '')
  const { createScript, updateScript } = useScriptStore()
  const [isOpen, setIsOpen] = useState(false) // State to manage dialog visibility

  const handleSubmit = (e) => {
    e.preventDefault()
    if (type === 'edit' && data) {
      updateScript(data?.id, { name })
    } else {
      createScript({ name })
    }
    setName('') // Clear input field after submission
    setIsOpen(false) // Close the dialog
  }

  return (
    <div className="">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger>
          {type === 'edit' ? (
            <FiEdit3 className=" text-sm" />
          ) : (
            <Button
              variant={'default'}
              size={'icon'}
              className="w-8 h-8 flex items-center shadow-none justify-center p-0 rounded-md transition text-purple-50 text-opacity-30 hover:text-opacity-60 border-none"
            >
              <span className="text-lg font-semibold">
                <FiPlus />
              </span>
            </Button>
          )}
        </DialogTrigger>

        {/* Modal (Dialog) content */}
        <DialogContent
          className="bg-white p-6 rounded-md shadow-lg w-[400px] fixed top-1/4 left-56 z-50"
          style={{ overflowY: 'auto' }}
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-black">New Test</DialogTitle>
          </DialogHeader>

          {/* Form inside the modal */}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Test Name
              </label>
              <input
                id="name"
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-900 focus:border-gray-900 sm:text-sm"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <Button type="submit" className="bg-black text-white hover:bg-gray-900 transition">
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ScriptForm
