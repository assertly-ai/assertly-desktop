import { Test, useTestStore } from '@renderer/store/testStore'
import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { FiEdit3 } from 'react-icons/fi'
import { Button } from '../../../../../components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../../../../../components/ui/dialog'

type PropType = {
  type?: string
  data?: Test
}

const TestForm = ({ type, data }: PropType) => {
  const [name, setName] = useState(data?.name || '')
  const { createTest, updateTest } = useTestStore()
  const [isOpen, setIsOpen] = useState(false) // State to manage dialog visibility

  const handleSubmit = (e) => {
    e.preventDefault()
    if (type === 'edit' && data) {
      updateTest(data?.id, { name })
    } else {
      createTest({ name })
    }
    setName('') // Clear input field after submission
    setIsOpen(false) // Close the dialog
  }

  return (
    <div className="">
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          {type === 'edit' ? (
            <FiEdit3 className=" text-sm" />
          ) : (
            <Button className="w-8 h-8 flex items-center shadow-none justify-center p-0 rounded-md bg-[#ddd] text-[#303030] hover:bg-[#ccc] transition">
              {/* <Button className="w-8 h-8 flex items-center justify-center p-0 rounded-md bg-[#1a1a1a] text-[#f1f1f1] hover:bg-[#303030] transition"> */}
              <FaPlus />
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

export default TestForm
