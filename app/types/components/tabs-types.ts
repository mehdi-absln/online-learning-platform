export interface TabItem {
  id: string
  title: string
  slotName: string
  disabled?: boolean
}

export interface TabsProps {
  modelValue?: number
  ariaLabel?: string
  tabs: { title: string, name: string, disabled?: boolean }[]
}

export interface TabsEmits {
  (e: 'update:modelValue', value: number): void
}
