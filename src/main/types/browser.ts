export interface AccessibilityNode {
  role?: string
  name?: string
  value?: string
  description?: string
  properties?: Record<string, unknown>
  children?: AccessibilityNode[]
  checked?: boolean
  pressed?: boolean
  level?: number
  expanded?: boolean
  selected?: boolean
  focused?: boolean
}
