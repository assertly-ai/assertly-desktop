import { Button } from '@components/ui/button'
import React from 'react'
import { GoArrowLeft, GoArrowRight } from 'react-icons/go'
import { RiSettingsLine } from 'react-icons/ri'
import { useLocation, useNavigate } from 'react-router-dom'

export const WindowControls: React.FC = () => {
  const navigate = useNavigate()
  const location = useLocation()

  const [canGoBack, setCanGoBack] = React.useState(false)
  const [canGoForward, setCanGoForward] = React.useState(false)

  React.useEffect(() => {
    setCanGoBack(window.history.state?.idx > 0)
    setCanGoForward(window.history.state?.idx < window.history.length - 1)
  }, [location])

  return (
    <div className="flex justify-between items-center rounded-lg">
      <div className="flex h-10 w-full flex-1 window-drag-region"></div>
      <Button
        variant={'default'}
        size={'icon'}
        className="text-white text-opacity-40 text-xs [&_svg]:size-4"
      >
        <RiSettingsLine />
      </Button>
      <div className="flex items-center justify-center px-1.5 pr-1 py-1 text-zinc-700">
        <Button
          variant="default"
          size="icon"
          onClick={() => navigate(-1)}
          disabled={!canGoBack}
          className="rounded-lg hover:bg-white hover:bg-opacity-10 text-white hover:text-opacity-100 text-opacity-60 text-xl font-bold disabled:opacity-30"
        >
          <GoArrowLeft />
        </Button>
        <Button
          variant="default"
          size="icon"
          onClick={() => navigate(1)}
          disabled={!canGoForward}
          className="rounded-lg hover:bg-white hover:bg-opacity-10 text-white hover:text-opacity-100 text-opacity-60 text-xl font-bold disabled:opacity-30"
        >
          <GoArrowRight />
        </Button>
      </div>
    </div>
  )
}
