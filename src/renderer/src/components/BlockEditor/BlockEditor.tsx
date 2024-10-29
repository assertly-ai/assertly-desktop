import { Editor, Monaco } from '@monaco-editor/react'
import { LoaderCircle } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import * as monaco from 'monaco-editor'
import ScriptBlock from '@renderer/types/scriptBlock'
import { useScriptBlockStore } from '@renderer/store/scriptBlockStore'
import { PLAY_WRIGHT_DEFINITIONS } from '@renderer/lib/constants'

export function BlockEditor({ language, data }: { language: string; data: ScriptBlock }) {
  const { updateScriptBlock } = useScriptBlockStore()
  const monacoRef = useRef<Monaco | null>(null)
  const editorWrapperRef = useRef(null)
  const [editorHeight, setEditorHeight] = useState<number>(100)

  const handleEditorDidMount = async (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    monacoRef.current = monaco

    editor.onDidContentSizeChange(() => {
      const contentHeight = editor.getContentHeight()
      setEditorHeight(contentHeight)
    })

    if (language === 'javascript') {
      try {
        if (data && data.code) {
          editor.setValue(data.code)
        }
      } catch (e) {
        console.log(e)
      }
    }

    const initialHeight = editor.getContentHeight()
    setEditorHeight(initialHeight)
  }

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

  return (
    <div className="flex min-h-2 bg-transparent rounded-lg mt-0">
      <div
        ref={editorWrapperRef}
        className="w-full overflow-visible rounded-lg border border-zinc-700"
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
          className="overflow-visible rounded-lg"
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
            fontSize: 12,
            folding: true,
            renderLineHighlight: 'all',
            renderWhitespace: 'none',
            fixedOverflowWidgets: true,
            roundedSelection: true,
            smoothScrolling: true,
            scrollbar: {
              vertical: 'hidden',
              horizontal: 'hidden',
              handleMouseWheel: false
            },
            overviewRulerLanes: 0,
            overviewRulerBorder: false
          }}
        />
      </div>
    </div>
  )
}
