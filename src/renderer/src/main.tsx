import './globals.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import AppLayout from './AppLayout'
import { ScriptBuilder } from './pages/Scripts/ScriptBuilder'
import { PanelLayout } from './components/PanelLayout/PanelLayout'
import { ScriptList } from './pages/Scripts/ScriptList'
import { ScriptModules } from './pages/ScriptModules/ScriptModules'
import { Explore } from './pages/Explore/Explore'
import { ScriptModuleBuilder } from './pages/ScriptModules/ScriptModuleBuilder'

const DEFAULT_PANEL_CONFIG = {
  defaultWidth: 400,
  minWidth: 250,
  maxWidth: 600
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <PanelLayout leftPanelConfig={DEFAULT_PANEL_CONFIG} hasPreview={true} />,
        children: [
          {
            path: '',
            element: <Navigate to={'/scripts'} />
          },
          {
            path: 'scripts',
            element: <ScriptList />
          },
          {
            path: 'modules',
            element: <ScriptModules />
          },
          {
            path: 'explore',
            element: <Explore />
          }
        ]
      },
      {
        path: 'scripts/:scriptId',
        element: <ScriptBuilder />
      },
      {
        path: 'modules/:scriptModuleId',
        element: <ScriptModuleBuilder />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
