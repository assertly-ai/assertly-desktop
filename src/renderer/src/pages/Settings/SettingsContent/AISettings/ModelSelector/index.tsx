import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@components/ui/select'

interface PropType {
  name: string
  value: string
  handleChange: (value: string) => void
  optionsList: string[]
}
export const ModulSelector = ({ name, value, handleChange, optionsList }: PropType) => {
  return (
    <div className="space-y-4">
      <span className="text-md text-gray-300">{name}</span>
      <div className="mt-2 flex items-center">
        <Select value={value} onValueChange={(v) => handleChange(v)}>
          <SelectTrigger
            className={`bg-transparent text-white placeholder:text-md placeholder:text-white placeholder:text-opacity-20 placeholder:font-medium border border-zinc-500 border-opacity-90 rounded-lg px-3 py-2 w-full hover:border-zinc-400 hover:border-opacity-90 focus:border-zinc-400 focus:border-opacity-90`}
          >
            <SelectValue placeholder="Select a Model" />
          </SelectTrigger>
          <SelectContent
            className={`bg-white/5 backdrop-blur-3xl text-white border  border-white/10`}
          >
            <SelectGroup>
              {optionsList.map((model) => (
                <SelectItem
                  key={model}
                  className="focus:bg-white/10 focus:text-white"
                  value={model}
                >
                  {model}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
