const {compilerOptions} = require('./tsconfig.json');

const pathAliases = Object.fromEntries(
  Object.entries(compilerOptions.paths).map(
    /**
     * @param key string
     * @param value string
     * @return {[string,string]}
     */
    ([key, [value]]) => [
      key.replace(/\/\*$/, ''),
      `./src/${value.replace(/\/\*$/, '')}`,
    ],
  ),
);

module.exports = {
  root: true,
  extends: ['plugin:@croct/javascript', 'plugin:astro/recommended'],
  plugins: [
    '@croct',
    '@typescript-eslint',
    '@dword-design/import-alias',
    'astro',
  ],
  env: {node: true},
  parserOptions: {
    project: ['./tsconfig.json'],
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.mts', '.cts', '.tsx'],
    },
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        paths: './tsconfig.json',
      },
    },
  },
  rules: {
    'no-console': 'off',
    indent: [
      'error',
      2,
      {
        SwitchCase: 1,
      },
    ],
    'max-len': [
      'error',
      {
        code: 120,
        ignoreStrings: false,
        ignoreComments: false,
        ignoreTemplateLiterals: true,
        ignoreTrailingComments: false,
        ignoreUrls: true,
      },
    ],
    'object-shorthand': ['error', 'always'],
    'padding-line-between-statements': [
      'error',
      {
        blankLine: 'always',
        prev: '*',
        next: ['try'],
      },
      {
        blankLine: 'always',
        prev: ['break', 'return'],
        next: ['case', 'default'],
      },
      {
        blankLine: 'always',
        prev: ['const', 'let', 'var'],
        next: '*',
      },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },
      {
        blankLine: 'any',
        prev: '*',
        next: ['break', 'continue', 'return'],
      },
      {
        blankLine: 'always',
        prev: '*',
        next: ['if', 'function', 'block', 'block-like'],
      },
      {
        blankLine: 'any',
        prev: ['case'],
        next: ['case'],
      },
    ],
    '@dword-design/import-alias/prefer-alias': [
      'error',
      {
        alias: pathAliases,
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.ts', '**/*.mts', '**/*.cts', '**/*.tsx', '**/*.astro/*.js', '**/*.astro'],
      rules: {
        'import/export': 'off',
        '@typescript-eslint/array-type': [
          'error',
          {
            default: 'array-simple',
          },
        ],
        '@typescript-eslint/prefer-as-const': 'error',
        '@typescript-eslint/adjacent-overload-signatures': 'error',
        '@typescript-eslint/type-annotation-spacing': 'error',
        '@typescript-eslint/semi': ['error', 'always'],
        '@typescript-eslint/strict-boolean-expressions': [
          'error',
          {
            allowString: false,
            allowNumber: false,
            allowNullableObject: false,
          },
        ],
        '@typescript-eslint/prefer-optional-chain': 'error',
        'no-shadow': 'off',
        '@typescript-eslint/no-shadow': [
          'error',
          {
            ignoreTypeValueShadow: true,
            ignoreFunctionTypeParameterNameValueShadow: true,
          },
        ],
        '@typescript-eslint/no-empty-interface': 'off',
        '@typescript-eslint/explicit-member-accessibility': ['error'],
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/explicit-function-return-type': [
          'error',
          {
            allowExpressions: true,
            allowIIFEs: true,
          },
        ],
        '@typescript-eslint/no-explicit-any': 'off',
        'no-use-before-define': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        'no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-expressions': 'error',
        '@typescript-eslint/no-unused-vars': [
          'error',
          {
            args: 'after-used',
            ignoreRestSiblings: true,
          },
        ],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-non-null-assertion': 'off',
        'object-curly-spacing': 'off',
        '@typescript-eslint/object-curly-spacing': 'error',
        '@typescript-eslint/member-delimiter-style': [
          'error',
          {
            multiline: {
              delimiter: 'comma',
              requireLast: true,
            },
            singleline: {
              delimiter: 'comma',
              requireLast: false,
            },
            overrides: {
              interface: {
                singleline: {
                  delimiter: 'semi',
                },
                multiline: {
                  delimiter: 'semi',
                },
              },
            },
          },
        ],
        'no-undef': 'off',
        '@typescript-eslint/no-namespace': 'off',
      },
    },
    {
      files: ['*.astro', '**/*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
    },
    {
      // Define the configuration for `<script>` tag.
      // Script in `<script>` is assigned a virtual file name with the `.js` extension.
      files: ['**/*.ts', '**/*.mts', '**/*.cts', '**/*.tsx', '**/*.astro/*.js'],
      env: {
        browser: true,
        es2020: true,
      },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['**/tsconfig.json'],
        sourceType: 'module',
      },
      rules: {
        'prettier/prettier': 'off',
      },
    },
  ],
};
