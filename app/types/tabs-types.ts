export interface TabItem {
  id: string
  title: string
  slotName: string
}

export interface TabsProps {
  modelValue?: number
  ariaLabel?: string
  tabs: { title: string; name: string }[]
}

export interface TabsEmits {
  (e: 'update:modelValue', value: number): void
}