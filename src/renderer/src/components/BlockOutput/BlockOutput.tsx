import ScriptBlockResult from '@renderer/types/scriptBlockResult'

export function BlockOutput({ data }: { data: ScriptBlockResult[] }) {
  return (
    <div className="overflow-y-auto p-4 font-mono text-sm bg-zinc-700 rounded-lg inset-0 bg-noise bg-opacity-20 backdrop-blur-md">
      {data?.map((output) => (
        <div key={output.id} className={`mb-2  text-neutral-400`}>
          <span className="text-emerald-500 mr-2">$</span>
          <span className="whitespace-pre-wrap">{output.errorMessage}</span>
        </div>
      ))}
    </div>
  )
}
