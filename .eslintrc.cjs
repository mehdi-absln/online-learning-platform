module.exports = {
  root: true,
  extends: ['@nuxt/eslint-config', 'plugin:prettier/recommended'],
  rules: {
    // غیرفعال کردن قانون نام‌گذاری کامپوننت‌ها
    'vue/multi-word-component-names': 'off'
  }
}
