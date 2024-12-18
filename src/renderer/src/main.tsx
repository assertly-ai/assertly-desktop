import './globals.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import { createMemoryRouter, Navigate, RouterProvider } from 'react-router-dom'
import AppLayout from './AppLayout'
import { ScriptBuilder } from './pages/Scripts/ScriptBuilder'
import { ScriptList } from './pages/Scripts/ScriptList'
import { ScriptModules } from './pages/ScriptModules/ScriptModules'
import { Explore } from './pages/Explore/Explore'
import { ScriptModuleBuilder } from './pages/ScriptModules/ScriptModuleBuilder'
import { Settings } from './pages/Settings'
import { RiBardLine, RiCodeBlock, RiKey2Line, RiUser3Line } from 'react-icons/ri'
import { AISettings } from './pages/Settings/SettingsContent/AISettings'
import { EditorSettings } from './pages/Settings/SettingsContent/EditorSettings'
import { UserSettings } from './pages/Settings/SettingsContent/UserSettings'
import { SecretsSettings } from './pages/Settings/SettingsContent/SecretsSettings'
import { Documents } from './pages/Documents/Documents'
import { Bugs } from './pages/Bugs/Bugs'

export const router: ReturnType<typeof createMemoryRouter> = createMemoryRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '',
        element: <Navigate to={'/explore'} />
      },
      {
        path: 'explore',
        element: <Explore />
      },
      {
        path: 'documents',
        element: <Documents />
      },
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
        path: 'bugs',
        element: <Bugs />
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
            element: <UserSettings title={'User Settings'} icon={RiUser3Line} />
          },
          {
            path: 'ai',
            element: <AISettings title={'Configure AI'} icon={RiBardLine} />
          },
          {
            path: 'editor',
            element: <EditorSettings title={'Configure Editor'} icon={RiCodeBlock} />
          },
          {
            path: 'secrets',
            element: <SecretsSettings title={'Secret Variables'} icon={RiKey2Line} />
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
