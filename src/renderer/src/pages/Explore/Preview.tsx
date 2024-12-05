import { Button } from '@components/ui/button'
import { RiBugLine, RiFileCopy2Line, RiMagicLine } from 'react-icons/ri'
import { GoArrowLeft, GoArrowRight } from 'react-icons/go'
import { useEffect, useRef, useState } from 'react'

export const ExploratoryPreview = () => {
  const [currentUrl, setCurrentUrl] = useState('about:blank')
  const [editableUrl, setEditableUrl] = useState('about:blank')
  const urlInputRef = useRef<HTMLInputElement>(null)

  const handleUrlSubmit = () => {
    if (editableUrl !== currentUrl) {
      let finalUrl = editableUrl

      const isUrl =
        /^(http|https):\/\/[^ "]+$/.test(editableUrl) || /^[^ "]+\.[^ "]+$/.test(editableUrl)

      if (!isUrl) {
        const searchQuery = encodeURIComponent(editableUrl)
        finalUrl = `https://www.google.com/search?q=${searchQuery}`
      } else if (!editableUrl.startsWith('http://') && !editableUrl.startsWith('https://')) {
        finalUrl = `https://${editableUrl}`
      }

      window.electron.ipcRenderer.send('preview-navigate-to-url', {
        url: finalUrl,
        type: 'exploratory'
      })
    }
  }

  const handleNavigation = (direction: 'back' | 'forward') => {
    window.electron.ipcRenderer.send('preview-navigate', {
      direction,
      type: 'exploratory'
    })
  }

  const handleUrlKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleUrlSubmit()
    } else if (e.key === 'Escape') {
      setEditableUrl(currentUrl)
    }
  }

  useEffect(() => {
    const urlChangeHandler = (_: unknown, url: string) => {
      setCurrentUrl(url)
      setEditableUrl(url)
    }
    window.electron.ipcRenderer.on('preview-url-changed', urlChangeHandler)

    // Initialize preview
    window.electron.ipcRenderer.send('toggle-preview', {
      show: true,
      type: 'exploratory'
    })

    return () => {
      window.electron.ipcRenderer.send('toggle-preview', {
        show: false,
        type: 'exploratory'
      })
    }
  }, [])

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="flex items-center gap-1 p-2 pl-0">
        <div className="flex items-center h-8 px-4 gap-2 rounded-md bg-white/5 border border-white/5">
          <span className="text-xs text-white/90">{' Page #1'}</span>
        </div>
        <div className="flex-1 flex items-center h-8 px-2 gap-2 rounded-sm bg-white/5 border border-white/5">
          <input
            ref={urlInputRef}
            type="text"
            value={editableUrl}
            onChange={(e) => setEditableUrl(e.target.value)}
            onKeyDown={handleUrlKeyDown}
            onBlur={handleUrlSubmit}
            className="flex-1 bg-transparent text-xs text-white/90 focus:outline-none"
            placeholder="Enter URL or search..."
          />
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 [&_svg]:size-4 text-white/90 hover:bg-white/20 hover:text-white"
              onClick={() => handleNavigation('back')}
            >
              <GoArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 [&_svg]:size-4 text-white/90 hover:bg-white/20 hover:text-white"
              onClick={() => handleNavigation('forward')}
            >
              <GoArrowRight className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 [&_svg]:size-4 text-white/90 hover:bg-white/20 hover:text-white"
              onClick={() => navigator.clipboard.writeText(currentUrl)}
            >
              <RiFileCopy2Line className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 [&_svg]:size-4 text-white/90 hover:bg-white/20 hover:text-white"
              onClick={() => navigator.clipboard.writeText(currentUrl)}
            >
              <RiBugLine className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 [&_svg]:size-4 text-white/90 hover:bg-white/20 hover:text-white"
              onClick={() => navigator.clipboard.writeText(currentUrl)}
            >
              <RiMagicLine className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      {/* The preview window will be rendered here by the main process */}
      <div className="flex-1 rounded-lg border border-white/10 mx-2 mb-2" />
    </div>
  )
}
