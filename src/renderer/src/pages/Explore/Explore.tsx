import { ExploratoryPreview } from './Preview'

export const Explore = () => {
  return (
    <div className="flex h-screen w-full">
      <div className="flex w-[400px] h-screen p-2 pl-0">
        <div className="w-full h-full bg-white/5 rounded-lg border border-white/5"> </div>
      </div>
      <ExploratoryPreview />
    </div>
  )
}
