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
import { RiAiGenerate, RiEdit2Line, RiUser2Line } from 'react-icons/ri'
import { AISettings } from './pages/Settings/SettingsContent/AISettings'
import { EditorSettings } from './pages/Settings/SettingsContent/EditorSettings'
import { UserSettings } from './pages/Settings/SettingsContent/UserSettings'

const DEFAULT_PANEL_CONFIG = {
  defaultWidth: 600,
  minWidth: 400,
  maxWidth: 800
}

export const router: ReturnType<typeof createBrowserRouter> = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '',
        element: <Navigate to={'/explore'} />
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
            element: <Navigate to={'/settings/user'} />
          },
          {
            path: 'user',
            element: <UserSettings title={'User Settings'} icon={RiUser2Line} />
          },
          {
            path: 'ai',
            element: <AISettings title={'AI Settings'} icon={RiAiGenerate} />
          },
          {
            path: 'editor',
            element: <EditorSettings title={'Editor Settings'} icon={RiEdit2Line} />
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
