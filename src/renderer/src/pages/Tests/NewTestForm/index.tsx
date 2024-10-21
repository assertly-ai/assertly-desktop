import { useState } from 'react'
import { FaPlus } from 'react-icons/fa'
import { Button } from '../../../../../components/ui/button' // Assuming you have shadcn components installed
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '../../../../../components/ui/dialog'

const NewTestForm = () => {
  const [name, setName] = useState('')

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-8 h-8 flex items-center justify-center p-0 rounded-md bg-[#1a1a1a] text-[#f1f1f1] hover:bg-[#303030] transition">
          <FaPlus />
        </Button>
      </DialogTrigger>

      {/* Modal (Dialog) content */}
      <DialogContent className="bg-white p-6 rounded-md shadow-lg w-[400px]">
        <DialogHeader>
          <DialogTitle className="text-lg font-bold text-black">New Test</DialogTitle>
        </DialogHeader>

        {/* Form inside the modal */}
        <form
          onSubmit={(e) => {
            e.preventDefault()
            console.log('Form submitted with name:', name)
          }}
          className="flex flex-col space-y-4"
        >
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              id="name"
              type="text"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <Button type="submit" className="bg-indigo-600 text-white hover:bg-indigo-500 transition">
            Submit
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default NewTestForm
