import { cn } from '@renderer/lib/utils'
import { useEffect } from 'react'
import { RiBox2Fill, RiQuillPenLine, RiSearchEyeLine } from 'react-icons/ri'
import { useLocation, useNavigate } from 'react-router-dom'

const PANELS = [
  { id: 'explore', Icon: RiSearchEyeLine, path: '/explore' },
  { id: 'scripts', Icon: RiQuillPenLine, path: '/scripts' },
  { id: 'modules', Icon: RiBox2Fill, path: '/modules' }
]

export const PanelSwitcher = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname

  useEffect(() => {
    const handlePanelScroll = (e: CustomEvent<{ direction: 'next' | 'prev' }>) => {
      const currentIndex = PANELS.findIndex((panel) => panel.path === currentPath)

      if (e.detail.direction === 'next' && currentIndex < PANELS.length - 1) {
        navigate(PANELS[currentIndex + 1].path)
      } else if (e.detail.direction === 'prev' && currentIndex > 0) {
        navigate(PANELS[currentIndex - 1].path)
      }
    }

    window.addEventListener('panel-scroll', handlePanelScroll as EventListener)

    return () => {
      window.removeEventListener('panel-scroll', handlePanelScroll as EventListener)
    }
  }, [navigate, currentPath])

  return (
    <div className="flex gap-4 justify-center p-2 m-2 rounded-md">
      {PANELS.map(({ id, Icon, path }) => (
        <button
          key={id}
          onClick={() => navigate(path)}
          className={cn(
            'p-2.5 rounded-md hover:bg-white/20',
            currentPath === path && 'bg-white/10'
          )}
        >
          <Icon
            className={`transition-all duration-300 ${
              currentPath === path ? 'text-white scale-125' : 'text-white/50 hover:text-white/40'
            }`}
          />
        </button>
      ))}
    </div>
  )
}
