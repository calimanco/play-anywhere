module.exports = {
  extends: ['standard', 'plugin:prettier/recommended'],
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      extends: ['standard-with-typescript', 'prettier'],
      parserOptions: {
        project: ['./tsconfig.eslint.json']
      },
      rules: {
        '@typescript-eslint/no-floating-promises': 'off'
      }
    },
    {
      files: ['*.spec.ts', '*.test.ts'],
      rules: {
        // You can customize the rules here.
        // Test documents can be less strict.
      }
    },
    {
      files: ['*.md'],
      plugins: ['markdown']
    }
  ]
}