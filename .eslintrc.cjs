module.exports = {
  root: true,
  extends: [
    '@nuxt/eslint-config',
    // اضافه کردن پیکربندی Prettier (بعد از @nuxt)
    'plugin:prettier/recommended'
  ],
  rules: {
    // غیرفعال کردن قانون نام‌گذاری کامپوننت‌ها
    'vue/multi-word-component-names': 'off',
    
    // افزودن قوانین سفارشی (اختیاری)
    'prettier/prettier': ['error', { endOfLine: 'auto' }]
  }
}
