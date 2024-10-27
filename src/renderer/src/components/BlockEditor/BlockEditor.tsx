import { Editor, Monaco } from '@monaco-editor/react'
import { LoaderCircle } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import * as monaco from 'monaco-editor'
import { DEMO_CODE, PLAY_WRIGHT_DEFINITIONS } from '@renderer/lib/constants'
import ScriptBlock from '@renderer/types/scriptBlock'
import { useScriptBlockStore } from '@renderer/store/scriptBlockStore'

export function BlockEditor({ language, data }: { language: string; data: ScriptBlock }) {
  const { updateScriptBlock } = useScriptBlockStore()
  const monacoRef = useRef<Monaco | null>(null)
  const editorWrapperRef = useRef(null)
  const [editorHeight, setEditorHeight] = useState(200)
  const MIN_EDITOR_HEIGHT = 200
  const MAX_EDITOR_HEIGHT = window.innerHeight * 0.6

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
  }

  return (
    <div className="flex min-h-2 bg-transparent rounded-lg overflow-hidden mt-0">
      <div
        ref={editorWrapperRef}
        style={{
          width: '100%',
          height: `${editorHeight}px`, // Dynamic height based on content
          minHeight: `${MIN_EDITOR_HEIGHT}px`, // Minimum height
          maxHeight: `${MAX_EDITOR_HEIGHT}px`, // Max height limit
          overflow: 'hidden' // Prevent overflow
        }}
      >
        <Editor
          height={editorHeight}
          theme="vs-dark"
          defaultLanguage={language}
          onChange={(value) => {
            if (language === 'javascript') updateScriptBlock(data.id, { code: value })
            else updateScriptBlock(data.id, { instruction: value })
          }}
          onMount={handleEditorDidMount}
          loading={<LoaderCircle />}
          className="rounded-r-md overflow-hidden"
          value={language === 'javascript' ? data?.code : data?.instruction}
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
