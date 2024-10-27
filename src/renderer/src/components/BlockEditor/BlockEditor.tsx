import { Editor, Monaco } from '@monaco-editor/react'
import { LoaderCircle } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import * as monaco from 'monaco-editor'
import { DEMO_CODE } from '@renderer/lib/constants'
import ScriptBlock from '@renderer/types/scriptBlock'
import { useScriptBlockStore } from '@renderer/store/scriptBlockStore'

export function BlockEditor({ language, data }: { language: string; data: ScriptBlock }) {
  const { updateScriptBlock } = useScriptBlockStore()
  const monacoRef = useRef<Monaco | null>(null)
  const editorWrapperRef = useRef(null)
  const [editorHeight, setEditorHeight] = useState<number>(100)
  const [maxHeight, setMaxHeight] = useState<number>(800)

  useEffect(() => {
    const calculateMaxHeight = () => {
      const viewportHeight = window.innerHeight
      const maxEditorHeight = viewportHeight
      console.log('max height', maxEditorHeight)

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

    // Add content height listener with dynamic resizing
    editor.onDidContentSizeChange(() => {
      const lineHeight = editor.getOption(monaco.editor.EditorOption.lineHeight)
      const lineCount = editor.getModel()?.getLineCount() || 1
      const contentHeight = Math.min(
        Math.max(
          lineHeight * lineCount + 30, // Add some padding
          100 // Minimum height
        ),
        maxHeight // Maximum height
      )
      setEditorHeight(contentHeight)
    })

    if (language === 'javascript') {
      try {
        if (data && data.code) {
          editor.setValue(data.code)
        } else {
          editor.setValue(DEMO_CODE)
        }
      } catch (e) {
        console.log(e)
        editor.setValue(DEMO_CODE)
      }
    }

    // Trigger initial height calculation
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
        style={{ maxHeight: `${maxHeight}px` }} // Add maxHeight to container
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
