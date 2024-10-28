import { Outlet } from 'react-router-dom'

const AppLayout = () => {
  return (
    <>
      <svg className="fixed -z-10 opacity-80 hidden">
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
        <div className="absolute inset-0 -z-5">
          <div
            className="absolute inset-0 bg-white"
            style={{ filter: 'url(#noise)', opacity: '0.15' }}
          />
        </div>
        <div className="relative z-10">
          <Outlet />
        </div>
      </div>
    </>
  )
}

export default AppLayout
