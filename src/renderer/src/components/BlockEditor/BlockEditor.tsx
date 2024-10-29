import { Editor, Monaco } from '@monaco-editor/react'
import { LoaderCircle } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import * as monaco from 'monaco-editor'
import ScriptBlock from '@renderer/types/scriptBlock'
import { useScriptBlockStore } from '@renderer/store/scriptBlockStore'

type PropType = { language: string; data: ScriptBlock }

export function BlockEditor({ language, data }: PropType) {
  const { updateScriptBlock } = useScriptBlockStore()
  const monacoRef = useRef<Monaco | null>(null)
  const editorWrapperRef = useRef(null)
  const [editorHeight, setEditorHeight] = useState<number>(100)
  const [maxHeight, setMaxHeight] = useState<number>(800)

  useEffect(() => {
    const calculateMaxHeight = () => {
      const viewportHeight = window.innerHeight
      const maxEditorHeight = viewportHeight
      setMaxHeight(maxEditorHeight)
    }

    calculateMaxHeight()
    window.addEventListener('resize', calculateMaxHeight)

    return () => {
      window.removeEventListener('resize', calculateMaxHeight)
    }
  }, [])

  const handleEditorDidMount = async (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    monacoRef.current = monaco

    editor.onDidContentSizeChange(() => {
      const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight)
      const lineCount = editor.getModel()?.getLineCount() || 1
      const contentHeight = Math.min(Math.max(lineHeight * lineCount + 30, 100), maxHeight)
      setEditorHeight(contentHeight)
    })

    const initialLineCount = editor.getModel()?.getLineCount() || 1
    const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight)
    const initialHeight = Math.min(Math.max(initialLineCount * lineHeight + 30, 100), maxHeight)
    setEditorHeight(initialHeight)
  }

  return (
    <div className="flex min-h-2 bg-transparent rounded-lg mt-0">
      <div
        ref={editorWrapperRef}
        className="w-full overflow-hidden rounded-lg border border-zinc-700"
        style={{ maxHeight: `${maxHeight}px` }}
      >
        <Editor
          height={`${editorHeight}px`}
          theme="vs-dark"
          defaultLanguage={language}
          onChange={(value) => {
            if (language === 'javascript') updateScriptBlock(data.id, { code: value })
            else updateScriptBlock(data.id, { instruction: value })
          }}
          onMount={handleEditorDidMount}
          loading={<LoaderCircle />}
          className="overflow-hidden rounded-lg"
          value={language === 'javascript' ? data?.code : data?.instruction}
          options={{
            padding: {
              top: 16,
              bottom: 16
            },
            minimap: {
              enabled: false
            },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            wordWrap: 'on',
            lineNumbers: 'on',
            fontSize: 14,
            folding: true,
            renderLineHighlight: 'all',
            renderWhitespace: 'none',
            fixedOverflowWidgets: true,
            roundedSelection: true,
            smoothScrolling: true
          }}
        />
      </div>
    </div>
  )
}
