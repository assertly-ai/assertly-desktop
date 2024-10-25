import { Editor, Monaco } from '@monaco-editor/react'
import { LoaderCircle, PlayCircle } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import * as monaco from 'monaco-editor'
import { DEMO_CODE, PLAY_WRIGHT_DEFINITIONS } from '@renderer/lib/constants'
import { Test, useTestStore } from '@renderer/store/testStore'

export default function ExpandableEditor({ language, id }: { language: string; id: number }) {
  const [value, setValue] = useState<string | undefined>(DEMO_CODE)
  const { updateTest, getTest } = useTestStore()
  const monacoRef = useRef<Monaco | null>(null)
  const [running, setRunning] = useState<boolean>(false)

  const editorWrapperRef = useRef(null)
  const [editorHeight, setEditorHeight] = useState(200)
  const MIN_EDITOR_HEIGHT = 200
  const MAX_EDITOR_HEIGHT = window.innerHeight * 0.6
  useEffect(() => {
    const handleResize = () => {
      const maxHeight = window.innerHeight * 0.6
      setEditorHeight((prevHeight) => Math.min(prevHeight, maxHeight))
    }
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

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

  const handleEditorDidMount = async (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    editor.onDidContentSizeChange(() => {
      const contentHeight = Math.min(
        Math.max(editor.getContentHeight() * 0.6, MIN_EDITOR_HEIGHT),
        MAX_EDITOR_HEIGHT
      )
      setEditorHeight(contentHeight)
    })
    monacoRef.current = monaco
    if (language === 'javascript') {
      try {
        const test: Test = await getTest(id)
        if (test && test.code) {
          editor.setValue(test.code)
        } else {
          editor.setValue(DEMO_CODE)
        }
      } catch (e) {
        console.log('Error occurred while reading test with id: ', id)
        editor.setValue(DEMO_CODE)
      }
    }
  }

  const handleChange = (value: string | undefined) => {
    setValue(value)
    updateTest(id, { code: value })
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
      <div
        ref={editorWrapperRef}
        style={{
          width: '100%',
          height: `${editorHeight}px`, // Dynamic height based on content
          minHeight: `${MIN_EDITOR_HEIGHT}px`, // Minimum height
          maxHeight: `${MAX_EDITOR_HEIGHT}px`, // Max height limit
          // resize: 'vertical', // Make editor resizable
          overflow: 'hidden' // Prevent overflow
        }}
      >
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
