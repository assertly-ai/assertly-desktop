import './globals.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './AppLayout'
import { Scripts } from './pages/Scripts'
import { ScriptBuilder } from './pages/Scripts/ScriptBuilder'

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        path: '',
        element: <Scripts />
      },
      {
        path: 'scripts/:scriptId',
        element: <ScriptBuilder />
      }
    ]
  }
])

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
)
