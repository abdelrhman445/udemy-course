module.exports = {
  root: true,
  env: { node: true },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended",
  ],
  parserOptions: {
    parser: "@babel/eslint-parser",
    requireConfigFile: false,
    ecmaVersion: 2022,
    sourceType: "module",
  },
  rules: {
    "vue/multi-word-component-names": "off",
    "vue/require-explicit-emits": "off",
    "vue/no-v-html": "off"
  },
};