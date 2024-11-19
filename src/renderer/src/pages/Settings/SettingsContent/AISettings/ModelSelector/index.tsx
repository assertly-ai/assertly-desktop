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
          <SelectTrigger>
            <SelectValue placeholder="Select a Model" />
          </SelectTrigger>
          <SelectContent>
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
