// ──────────────────────────────────────
// Tabs component types
// ──────────────────────────────────────

export interface TabItem {
  id: string
  title: string
  slotName: string
  disabled?: boolean
}

export interface TabsProps {
  modelValue?: number
  ariaLabel?: string
  tabs?: Array<{ name: string, title: string, disabled?: boolean }>
  tabListClass?: string
  tabClass?: string
  activeTabClass?: string
  inactiveTabClass?: string
  disabledTabClass?: string
  panelClass?: string
}

export interface TabsEmits {
  (e: 'update:modelValue', value: number): void
}
