module.exports = {
    "env": {
        "es2021": true,
        "node": true
    },
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "airbnb-typescript/base",
        "prettier"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": 12,
        "sourceType": "module",
        "tsconfigRootDir": __dirname,
        "project": ['./tsconfig.eslint.json']
    },
    "plugins": [
        "@typescript-eslint"
    ],
    rules: {
      'import/prefer-default-export': 'off',
      '@typescript-eslint/no-throw-literal': 'off'
    }
};
