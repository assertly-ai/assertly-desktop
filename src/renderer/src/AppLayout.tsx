import { Outlet } from 'react-router-dom'
import { Sidebar } from './components/Sidebar'

const AppLayout = () => {
  return (
    <>
      <svg className="fixed opacity-80 hidden -z-10">
        <filter id="noise">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.9"
            numOctaves="4"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
      </svg>

      <div className="w-screen h-screen backdrop-blur-lg">
        <div className="absolute inset-0 -z-10">
          <div
            className="absolute inset-0 bg-white"
            style={{ filter: 'url(#noise)', opacity: '0.15' }}
          />
        </div>
        <div className="flex z-10">
          <Sidebar />
          <div className="flex flex-1 w-full">
            <Outlet />
          </div>
        </div>
      </div>
    </>
  )
}

export default AppLayout
