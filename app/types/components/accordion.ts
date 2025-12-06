export interface AccordionItem {
  id?: number | string
  title: string
  description?: string
  [key: string]: any // Allow any additional properties for flexibility
  disabled?: boolean
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
}
export interface AccordionEmits {
  (e: 'update:modelValue', value: AccordionValue): void
}
