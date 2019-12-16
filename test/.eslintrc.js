module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'alloy',
        'alloy/react',
        'alloy/typescript',
    ],
    plugins: ['@typescript-eslint', 'react'],
    "parserOptions": {
        "ecmaVersion": 6,//也就是ES6语法支持的意思
        "sourceType": "module",
        "ecmaFeatures": {
            "modules": true
        },
        "project": "./tsconfig.json"
    },
    rules: {
        'indent': ['error', 2],
        'max-len': ['error', 150],
        'react/jsx-indent': 'off',
        'react/jsx-filename-extension': [
            'error',
            {
                'extensions': [".js", ".jsx", ".ts", ".tsx"]
            }
        ],
        'react/jsx-indent-props': ['error', 2],
        'object-curly-spacing': ['off', "never"],
        'no-console': 'off',
        'linebreak-style': 'off',
        'react/jsx-tag-spacing': 'off',
        'react/jsx-one-expression-per-line': 'off',
        'import/no-unresolved': 1,
        'jsx-a11y/click-events-have-key-events': 0,
        'jsx-a11y/no-static-element-interactions': 0,
        'react/prop-types': 0,
        'jsx-a11y/no-noninteractive-element-interactions': 0,
        'no-restricted-syntax': 0,
        'guard-for-in': 0,
        '@typescript-eslint/member-ordering':0,
        '@typescript-eslint/explicit-member-accessibility':0,
        '@typescript-eslint/no-require-imports':0,
        'import/no-unresolved':0,
        // 禁止使用 var
        'no-var': "error",
        // 优先使用 interface 而不是 type
        '@typescript-eslint/consistent-type-definitions': [
            "error",
            "interface"
        ]
    }
}