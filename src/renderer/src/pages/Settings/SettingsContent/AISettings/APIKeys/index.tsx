import { Input } from '@components/ui/input'

export const APIKeys = () => {
  return (
    <div className="p-10">
      <div className="w-full flex justify-start mb-6">
        <span className="text-xl font-bold text-neutral-300">API Keys</span>
      </div>
      <div className="space-y-4">
        <div>
          <span className="text-lg text-gray-300">OPEN AI Keys</span>
          <div className="mt-2">
            <Input
              className="w-full text-white placeholder:text-md placeholder:text-white placeholder:text-opacity-20 placeholder:font-medium border-b border-zinc-600 rounded-lg focus-visible:ring-0 px-3 py-2 "
              placeholder="API Key"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
