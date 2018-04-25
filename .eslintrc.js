
// override rules
const rules = {
}

if (process.env.NODE_ENV === 'development' || process.NODE_ENV === undefined) {
    // relax some rules in development mode
    rules['no-console'] = 'warn';
    // disallow declaration of variables that are not used in the code
    rules['no-unused-vars'] = ['warn', { vars: 'all', args: 'after-used', ignoreRestSiblings: true }];
    rules['import/first'] = ['warn', 'absolute-first'];
}

module.exports = {
  "parser": "babel-eslint",
  "extends": "airbnb",
  "env": {
    "browser": true
  },
  "rules": rules
};
