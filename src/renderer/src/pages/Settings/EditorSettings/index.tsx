import { Outlet } from 'react-router-dom'

export const EditorSettings = () => {
  return (
    <div className="bg-opacity-30 overflow-y-scroll w-full">
      <Outlet />
    </div>
  )
}
