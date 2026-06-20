import { JSDOM } from 'jsdom'
import DOMPurify from 'dompurify'

export default defineNuxtPlugin(() => {
  const dom = new JSDOM('')
  const purify = DOMPurify(dom.window)

  return {
    provide: {
      purify: (html: string) => purify.sanitize(html),
    },
  }
})
