import { Editor, Monaco } from '@monaco-editor/react'
import { Loader, PlayCircle } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import * as monaco from 'monaco-editor'

export default function ExpandableEditor({ language }: { language: string }) {
  const [value, setValue] = useState<string | undefined>()
  const [editorHeight, setEditorheight] = useState('200px')
  const monacoRef = useRef<Monaco | null>(null)

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
        `type Unboxed<T> = T extends Promise<infer U> ? U : T;
        
        declare namespace playwright {
            type Buffer = any;
            type URL = string;
            type ElementHandle = any;
            type Frame = any;
            type BrowserContext = any;
            type Response = any;
            type Request = any;
            type Worker = any;
            type Route = any;
            type WebSocket = any;
            type Locator = any;
            type FrameLocator = any;
            type Dialog = any;
            type ConsoleMessage = any;
            type Download = any;
            type FileChooser = any;
            type Video = any;
            type APIRequestContext = any;
            type JSHandle = any;
            type PageFunction0<R> = string | (() => R | Promise<R>);
            type PageFunction<Arg, R> = string | ((arg: Unboxed<Arg>) => R | Promise<R>);
            type PageFunctionOn<On, Arg2, R> = string | ((on: On, arg2: Unboxed<Arg2>) => R | Promise<R>);

            // Rest of your existing interfaces...
            interface Mouse {
                click(x: number, y: number, options?: any): Promise<void>;
                move(x: number, y: number, options?: any): Promise<void>;
                down(options?: any): Promise<void>;
                up(options?: any): Promise<void>;
            }

            interface Keyboard {
                down(key: string): Promise<void>;
                up(key: string): Promise<void>;
                press(key: string, options?: { delay?: number }): Promise<void>;
                type(text: string, options?: { delay?: number }): Promise<void>;
            }

            interface Touchscreen {
                tap(x: number, y: number): Promise<void>;
            }

            interface Page {
                goto(
                url: string,
                options?: {
                    timeout?: number;
                    waitUntil?: 'load' | 'domcontentloaded' | 'networkidle' | 'commit';
                }
                ): Promise<Response | null>;

                url(): string;
                title(): Promise<string>;
                content(): Promise<string>;

                click(
                selector: string,
                options?: {
                    button?: 'left' | 'right' | 'middle';
                    clickCount?: number;
                    delay?: number;
                    force?: boolean;
                    timeout?: number;
                }
                ): Promise<void>;

                fill(
                selector: string,
                value: string,
                options?: {
                    force?: boolean;
                    timeout?: number;
                }
                ): Promise<void>;

                type(
                selector: string,
                text: string,
                options?: {
                    delay?: number;
                    timeout?: number;
                }
                ): Promise<void>;

                press(
                selector: string,
                key: string,
                options?: {
                    delay?: number;
                    timeout?: number;
                }
                ): Promise<void>;

                evaluate<T>(pageFunction: PageFunction<any, T>, arg?: any): Promise<T>;
                evaluateHandle(pageFunction: PageFunction<any, any>, arg?: any): Promise<JSHandle>;

                $(selector: string): Promise<ElementHandle | null>;
                $$(selector: string): Promise<ElementHandle[]>;
                locator(selector: string): Locator;

                screenshot(options?: {
                path?: string;
                fullPage?: boolean;
                clip?: { x: number; y: number; width: number; height: number };
                type?: 'png' | 'jpeg';
                quality?: number;
                }): Promise<Buffer>;

                frame(frameSelector: string | { name?: string; url?: string | RegExp }): Frame | null;
                frames(): Frame[];
                mainFrame(): Frame;

                waitForLoadState(state?: 'load' | 'domcontentloaded' | 'networkidle'): Promise<void>;
                waitForSelector(selector: string, options?: { timeout?: number }): Promise<ElementHandle | null>;
                waitForTimeout(timeout: number): Promise<void>;
                setViewportSize(size: { width: number; height: number }): Promise<void>;

                keyboard: Keyboard;
                mouse: Mouse;
                touchscreen: Touchscreen;

                close(options?: { runBeforeUnload?: boolean }): Promise<void>;
            }
        }
        
        declare const page: playwright.Page;`,
        'playwright.d.ts'
      )
    }
  }, [language])

  const handleEditorDidMount = (editor: monaco.editor.IStandaloneCodeEditor, monaco: Monaco) => {
    monacoRef.current = monaco

    if (language === 'javascript') {
      // Set initial value after monaco is mounted
      editor.setValue(`// Playwright test code
// The 'page' object is available with autocomplete
await page.goto('https://example.com');
// Try typing 'page.' to see autocomplete suggestions
`)
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
          onChange={handleChange}
          onMount={handleEditorDidMount}
          loading={<Loader />}
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
