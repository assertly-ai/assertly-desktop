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
import { Settings } from './pages/Settings'
import { AISettings } from './pages/Settings/AISettings'
import { APIKeys } from './pages/Settings/AISettings/APIKeys'
import { EditorSettings } from './pages/Settings/EditorSettings'
import { Theme } from './pages/Settings/EditorSettings/Theme'

const DEFAULT_PANEL_CONFIG = {
  defaultWidth: 600,
  minWidth: 400,
  maxWidth: 800
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '',
        element: <Navigate to={'/scripts'} />
      },
      // Explore page with panel layout
      {
        path: 'explore',
        element: (
          <PanelLayout leftPanelConfig={DEFAULT_PANEL_CONFIG} hasPreview={true}>
            <Explore />
          </PanelLayout>
        )
      },
      // Other pages without panel layout
      {
        path: 'scripts',
        element: <ScriptList />
      },
      {
        path: 'scripts/:scriptId',
        element: <ScriptBuilder />
      },
      {
        path: 'modules/:scriptModuleId',
        element: <ScriptModuleBuilder />
      },
      {
        path: 'modules',
        element: <ScriptModules />
      },
      {
        path: 'settings',
        element: <Settings />,
        children: [
          {
            path: '',
            element: <Navigate to={'/settings/ai/api-keys'} />
          },
          {
            path: 'ai',
            element: <AISettings />,
            children: [
              {
                path: 'api-keys',
                element: <APIKeys />
              }
            ]
          },
          {
            path: 'editor',
            element: <EditorSettings />,
            children: [
              {
                path: 'theme',
                element: <Theme />
              }
            ]
          }
        ]
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
