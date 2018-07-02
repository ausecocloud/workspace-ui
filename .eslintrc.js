
// override rules
const rules = {
  'jsx-a11y/anchor-is-valid': [ "warn", {
    components: [ 'Link' ],
    specialLink: [ 'to' ],
    aspects: ['invalidHref', 'preferButton'],
  }],
  "no-restricted-syntax": 'warn',
  // TODO: enable this rule again
  'react-redux/prefer-separate-component-file': 'off',
}

if (process.env.NODE_ENV === 'development' || process.NODE_ENV === undefined) {
  // relax some rules in development mode
  rules['no-console'] = 'warn';
  rules['max-len'] = 'warn';
  rules['quotes'] = 'warn';
  rules['quote-props'] = 'warn';
  rules['no-underscore-dangle'] = 'off';
  // disallow declaration of variables that are not used in the code
  rules['no-unused-vars'] = ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: true, argsIgnorePattern: "^_" }];
  rules['import/first'] = ['warn', 'absolute-first'];
  rules["import/no-named-as-default"] = 'warn';
}

module.exports = {
  "parser": "babel-eslint",
  // see: https://github.com/airbnb/javascript
  "extends": [
    "airbnb",
    "plugin:react-redux/recommended",
    "plugin:redux-saga/recommended",
  ],
  "env": {
    "browser": true
  },
  "rules": rules,
  "plugins": [
    "react-redux",
    "redux-saga",
  ],
};
