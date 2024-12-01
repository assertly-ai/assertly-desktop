import { cn } from '@renderer/lib/utils'
import { RiBox2Fill, RiPlanetLine, RiQuillPenLine, RiSettingsLine } from 'react-icons/ri'
import { NavLink } from 'react-router-dom'
import logoImage from '../assets/logo.png'

const NAV_ITEMS = [
  {
    path: '/explore',
    icon: RiPlanetLine,
    label: 'Explore'
  },
  {
    path: '/scripts',
    icon: RiQuillPenLine,
    label: 'Scripts'
  },
  {
    path: '/modules',
    icon: RiBox2Fill,
    label: 'Modules'
  },
  {
    path: '/settings',
    icon: RiSettingsLine,
    label: 'Settings'
  }
]

export const Sidebar = () => {
  return (
    <>
      <div className="flex h-screen">
        <div className="flex flex-col w-[70px] m-2 bg-white/5 rounded-md shadow-lg border border-white/5 z-50">
          <div className="flex flex-col items-center gap-2 p-2 pt-12">
            <NavLink
              key={'logo'}
              to={'/'}
              className={({ isActive }) =>
                cn(
                  'w-8 mb-6 text-md rounded-md  group relative flex items-center justify-center mb-6v bg-cover',
                  isActive && 'bg-white/10'
                )
              }
            >
              <span className="sr-only">A</span>
              <img src={logoImage} alt="Logo" className="w-full h-full object-cover rounded-md" />
            </NavLink>
            {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  cn(
                    'h-10 w-10 text-lg rounded-md hover:bg-white/10 group relative flex items-center justify-center ',
                    isActive && 'bg-white/10'
                  )
                }
              >
                {({ isActive }) => (
                  <>
                    <span className="sr-only">{label}</span>
                    <Icon className={cn('w-5 h-5', isActive ? 'text-white' : 'text-white/80')} />
                    <span className="absolute left-12 top-2 bg-neutral-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap">
                      {label}
                    </span>
                  </>
                )}
              </NavLink>
            ))}
          </div>
          <div className="flex flex-1 window-drag-region"></div>
          <div className="flex flex-col items-center py-2"></div>
        </div>
      </div>
    </>
  )
}
