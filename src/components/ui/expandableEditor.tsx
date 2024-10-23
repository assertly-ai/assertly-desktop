import { Editor, Monaco } from '@monaco-editor/react'
import { LoaderCircle, PlayCircle } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import * as monaco from 'monaco-editor'
import { DEMO_CODE, PLAY_WRIGHT_DEFINITIONS } from '@renderer/lib/constants'

export default function ExpandableEditor({ language }: { language: string }) {
  const [value, setValue] = useState<string | undefined>(DEMO_CODE)
  const [editorHeight, setEditorheight] = useState('200px')
  const monacoRef = useRef<Monaco | null>(null)
  const [running, setRunning] = useState<boolean>(false)
  useEffect(() => {
    if (monacoRef.current && language === 'javascript') {
      const monaco = monacoRef.current

      // Configure JavaScript defaults before adding types
      monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
        target: monaco.languages.typescript.ScriptTarget.ESNext,
        allowNonTsExtensions: true,
        allowJs: true,
        checkJs: true,
        noEmit: true
      })

      // Enable built-in lib references
      monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true)

      // Add type definitions for Playwright
      monaco.languages.typescript.javascriptDefaults.addExtraLib(
        PLAY_WRIGHT_DEFINITIONS,
        'playwright.d.ts'
      )
    }
  }, [language, monacoRef.current])

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    monacoRef.current = monaco

    if (language === 'javascript') {
      // Set initial value after monaco is mounted
      editor.setValue(DEMO_CODE)
    }
  }

  const handleChange = (value: string | undefined, e: monaco.editor.IModelContentChangedEvent) => {
    setValue(value)
    adjustHeight(e?.changes?.[0]?.range?.endLineNumber)
  }

  const adjustHeight = (lineNumber: number | undefined) => {
    if (lineNumber) {
      setEditorheight(Math.min(400, Math.max(lineNumber * 10, 200)).toString() + 'px')
    }
  }

  async function runPlaywrightCode(code: string) {
    try {
      setRunning(true)
      const result = (await window.api.executePlaywrightCode(code)) as {
        success: boolean
        data?: unknown
        error?: string
      }
      if (!result.success) {
        console.error('Error executing Playwright code:', result.error)
      }
    } catch (error) {
      console.error('Error calling executePlaywrightCode:', error)
    } finally {
      setRunning(false)
    }
  }

  const handleRunCode = () => {
    if (value !== undefined) runPlaywrightCode(value)
  }

  return (
    <div className="flex min-h-2 bg-transparent rounded-sm overflow-hidden">
      <div className="max-w-16 flex p-1 rounded-l-sm bg-zinc-700 ">
        <button
          onClick={handleRunCode}
          className="flex h-10 w-10 border-none shadow-none items-center justify-center group-hover:bg-emerald-500"
        >
          {running ? (
            <LoaderCircle className="animate-spin transition-all text-emerald-400" size={30} />
          ) : (
            <PlayCircle className="hover:text-white transition-all text-emerald-500" size={30} />
          )}
        </button>
      </div>
      <div className="w-full p-0 m-0 overflow-hidden">
        <Editor
          height={editorHeight}
          theme="vs-dark"
          defaultLanguage={language}
          onChange={handleChange}
          onMount={handleEditorDidMount}
          loading={<LoaderCircle />}
          className="rounded-r-md overflow-hidden"
          value={value}
          options={{
            padding: {
              top: 10,
              bottom: 10
            },
            minimap: {
              enabled: false
            }
          }}
        />
      </div>
    </div>
  )
}
