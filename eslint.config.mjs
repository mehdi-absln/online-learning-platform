// eslint.config.mjs
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt([
  {
    files: ['**/*.vue'],
    rules: {
      // این قانون تگ img را باز نگه می‌دارد <img src="...">
      'vue/html-self-closing': ['error', {
        html: {
          void: 'never',
          normal: 'always',
          component: 'always',

        },
        svg: 'always',
        math: 'always',
      }],

      // غیرفعال کردن خطای نام کامپوننت‌ها
      'vue/multi-word-component-names': 'off',
    },
  },
])
