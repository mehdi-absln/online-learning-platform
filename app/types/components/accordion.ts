export interface AccordionItem {
  id?: number | string
  title: string
  description?: string
  disabled?: boolean
  [key: string]: unknown // Allow any additional properties for flexibility while keeping it type-safe
}
export type AccordionValue = number | number[] | null | undefined
export interface AccordionProps {
  items: AccordionItem[]
  exclusive?: boolean
  modelValue?: AccordionValue
  emptyText?: string
  headerClass?: string
  contentClass?: string
  transitionDuration?: number
  showIcon?: boolean
  iconClass?: string
  iconRotateClass?: string
}
export interface AccordionEmits {
  (e: 'update:modelValue', value: AccordionValue): void
}
