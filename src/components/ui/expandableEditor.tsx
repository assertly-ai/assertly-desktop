import { Editor } from '@monaco-editor/react'
import { Loader, PlayCircle } from 'lucide-react'
import { useState } from 'react'

export default function ExpandableEditor({ language }: { language: string }) {
  const [value, setValue] = useState()
  const [editorHeight, setEditorheight] = useState('200px')

  const handleChange = (value, e) => {
    setValue(value)
    adjustHeight(e?.changes?.[0]?.range?.endLineNumber)
  }

  const adjustHeight = (lineNumber: number) => {
    setEditorheight(Math.min(690, Math.max(lineNumber * 22, 200)).toString() + 'px')
  }

  return (
    <div className="flex min-h-2 bg-transparent rounded-sm overflow-hidden">
      <div className="max-w-16 flex p-1 rounded-l-sm bg-zinc-700 ">
        <button className="flex h-10 w-10 border-none shadow-none items-center justify-center group-hover:bg-emerald-500">
          <PlayCircle className="hover:text-white transition text-emerald-500" size={30} />
        </button>
      </div>
      <div className="w-full p-0 m-0 overflow-hidden">
        <Editor
          height={editorHeight}
          theme="vs-dark"
          defaultLanguage={language}
          defaultValue="// Start coding here..."
          onChange={handleChange}
          loading={<Loader />}
          className="rounded-r-md overflow-hidden"
          value={value}
          options={{
            padding: {
              top: 10,
              bottom: 10
            }
          }}
        />
      </div>
    </div>
  )
}
