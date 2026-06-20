import DOMPurify from 'dompurify'

export default defineNuxtPlugin(() => {
  return {
    provide: {
      purify: (html: string) => DOMPurify.sanitize(html),
    },
  }
})
