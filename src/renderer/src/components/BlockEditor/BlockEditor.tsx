import { Editor, Monaco } from '@monaco-editor/react'
import { LoaderCircle } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import * as monaco from 'monaco-editor'
import ScriptBlock from '@renderer/types/scriptBlock'
import { useScriptBlockStore } from '@renderer/store/scriptBlockStore'
import { PLAY_WRIGHT_DEFINITIONS } from '@renderer/lib/constants'
import ScriptModuleBlock from '@renderer/types/scriptModuleBlock'
import { useScriptModuleBlockStore } from '@renderer/store/scriptModuleBlockStore'

type PropType = { index: number; language: string; data: ScriptBlock | ScriptModuleBlock }

export function BlockEditor({ language, data }: PropType) {
  const { updateScriptBlock } = useScriptBlockStore()
  const { updateScriptModuleBlock } = useScriptModuleBlockStore()
  const monacoRef = useRef<Monaco | null>(null)
  const editorWrapperRef = useRef(null)
  const [editorHeight, setEditorHeight] = useState<number>(100)

  const handleChange = (value: string | undefined) => {
    const updateBlock = 'scriptId' in data ? updateScriptBlock : updateScriptModuleBlock
    const key = language === 'javascript' ? 'code' : 'instruction'
    updateBlock(data.id, { [key]: value })
  }

  const handleEditorDidMount = async (
    editor: monaco.editor.IStandaloneCodeEditor,
    monaco: Monaco
  ) => {
    monacoRef.current = monaco

    editor.onDidContentSizeChange(() => {
      const contentHeight = editor.getContentHeight()
      setEditorHeight(contentHeight)
    })

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

      // console.log(data.id, monaco.editor.getEditors().at(index)?.addGlyphMarginWidget(''))
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
          key={data.id}
          theme="vs-dark"
          defaultLanguage={language}
          language={language}
          onChange={handleChange}
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
            glyphMargin: true,
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
