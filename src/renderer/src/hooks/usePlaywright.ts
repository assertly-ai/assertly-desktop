import { useState } from 'react'

export const usePlaywright = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false)

  const runPlaywrightCode = async (code: string) => {
    try {
      setIsRunning(true)
      const result = (await window.api.executePlaywrightCode(code)) as {
        success: boolean
        data?: unknown
        error?: string
      }
      if (!result.success) {
        console.error('Error executing Playwright code:', result.error)
      }
      return result
    } catch (error) {
      console.error('Error calling executePlaywrightCode:', error)
      throw error
    } finally {
      setIsRunning(false)
    }
  }

  return {
    isRunning,
    runPlaywrightCode
  }
}
