module.exports = {
  "root": true,

  "parserOptions": {
    "ecmaVersion": 6,
    "ecmaFeatures": {
      "experimentalObjectRestSpread": true,
      "jsx": true
    },
    "sourceType": "module"
  },

  "env": {
    "es6": true,
    "node": true
  },

  "plugins": [
    "react"
  ],

  "globals": {
    "document": false,
    "navigator": false,
    "window": false,
    "fetch": true,
  },

  "rules": {
    "accessor-pairs": 2,
    "arrow-parens": [ 2, "always" ],
    "arrow-spacing": [ 2, { "before": true, "after": true } ],
    "array-bracket-spacing": [ 2, "always" ],
    "block-spacing": [ 2, "always" ],
    "brace-style": [ 2, "1tbs", { "allowSingleLine": true } ],
    "camelcase": [ 2, { "properties": "never" } ],
    "comma-dangle": [ 2, "always-multiline" ],
    "comma-spacing": [ 2, { "before": false, "after": true } ],
    "comma-style": [ 2, "last" ],
    "constructor-super": 2,
    "curly": [ 2, "multi-line" ],
    "dot-location": [ 2, "property" ],
    "eol-last": 2,
    "eqeqeq": [ 2, "allow-null" ],
    "generator-star-spacing": [ 2, { "before": true, "after": true } ],
    "handle-callback-err": [ 2, "^(err|error)$" ],
    "indent": [ 2, 2, { "SwitchCase": 1 } ],
    "jsx-quotes": [ 2, "prefer-double" ],
    "key-spacing": [ 2, { "beforeColon": false, "afterColon": true } ],
    "keyword-spacing": [ 2, { "before": true, "after": true } ],
    "new-cap": [ 2, { "newIsCap": true, "capIsNew": false } ],
    "new-parens": 2,
    "no-array-constructor": 2,
    "no-caller": 2,
    "no-catch-shadow": 2,
    "no-class-assign": 2,
    "no-cond-assign": 2,
    "no-const-assign": 2,
    "no-constant-condition": 2,
    "no-control-regex": 2,
    "no-debugger": 2,
    "no-delete-var": 2,
    "no-dupe-args": 2,
    "no-dupe-class-members": 2,
    "no-dupe-keys": 2,
    "no-duplicate-case": 2,
    "no-duplicate-imports": 2,
    "no-empty-character-class": 2,
    "no-empty-pattern": 2,
    "no-eval": 2,
    "no-ex-assign": 2,
    "no-extend-native": 2,
    "no-extra-bind": 2,
    "no-extra-boolean-cast": 2,
    "no-extra-parens": [ 2, "functions" ],
    "no-fallthrough": 2,
    "no-floating-decimal": 2,
    "no-func-assign": 2,
    "no-implied-eval": 2,
    "no-inner-declarations": [ 2, "functions" ],
    "no-invalid-regexp": 2,
    "no-irregular-whitespace": 2,
    "no-iterator": 2,
    "no-label-var": 2,
    "no-labels": [ 2, { "allowLoop": false, "allowSwitch": false } ],
    "no-lone-blocks": 2,
    "no-mixed-spaces-and-tabs": 2,
    "no-multi-spaces": 2,
    "no-multi-str": 2,
    "no-multiple-empty-lines": [ 2, { "max": 1 } ],
    "no-native-reassign": 2,
    "no-negated-in-lhs": 2,
    "no-new": 2,
    "no-new-func": 2,
    "no-new-object": 2,
    "no-new-require": 2,
    "no-new-symbol": 2,
    "no-new-wrappers": 2,
    "no-obj-calls": 2,
    "no-octal": 2,
    "no-octal-escape": 2,
    "no-path-concat": 2,
    "no-proto": 2,
    "no-redeclare": 2,
    "no-regex-spaces": 2,
    "no-return-assign": [ 2, "except-parens" ],
    "no-self-assign": 2,
    "no-self-compare": 2,
    "no-sequences": 2,
    "no-shadow-restricted-names": 2,
    "no-spaced-func": 2,
    "no-sparse-arrays": 2,
    "no-this-before-super": 2,
    "no-throw-literal": 2,
    "no-trailing-spaces": 2,
    "no-undef": 2,
    "no-undef-init": 2,
    "no-unexpected-multiline": 2,
    "no-unmodified-loop-condition": 2,
    "no-unneeded-ternary": [ 2, { "defaultAssignment": false } ],
    "no-unreachable": 2,
    "no-unsafe-finally": 2,
    "no-unused-expressions": 2,
    "no-unused-vars": [ 2, { "vars": "all", "args": "after-used" } ],
    "no-useless-call": 2,
    "no-useless-computed-key": 2,
    "no-useless-concat": 2,
    "no-useless-constructor": 2,
    "no-useless-escape": 2,
    "no-useless-rename": 2,
    "no-var": 2,
    "no-void": 2,
    "no-whitespace-before-property": 2,
    "no-with": 2,
    "object-curly-spacing": [ 2, "always" ],
    "object-property-newline": [ 2, { "allowMultiplePropertiesPerLine": true } ],
    "one-var": [ 2, { "initialized": "never" } ],
    "operator-linebreak": [ 2, "after", { "overrides": { "?": "before", ":": "before" } } ],
    "padded-blocks": [ 2, "never" ],
    "quotes": [ 2, "single", { "avoidEscape": true, "allowTemplateLiterals": true } ],
    "radix": 2,
    "rest-spread-spacing": [ 2, "never" ],
    "semi": [ 2, "never" ],
    "semi-spacing": [ 2, { "before": false, "after": true } ],
    "space-before-blocks": [ 2, "always" ],
    "space-before-function-paren": [ 2, "never" ],
    "space-in-parens": [ 2, "never" ],
    "space-infix-ops": 2,
    "space-unary-ops": [ 2, { "words": true, "nonwords": false } ],
    "spaced-comment": [ 2, "always", { "markers": [ "global", "globals", "eslint", "eslint-disable", "*package", "!", "," ] } ],
    "template-curly-spacing": [ 2, "never" ],
    "unicode-bom": [ 2, "never" ],
    "use-isnan": 2,
    "valid-typeof": 2,
    "wrap-iife": [ 2, "any" ],
    "yield-star-spacing": [ 2, "both" ],
    "yoda": [ 2, "never" ],

    "react/jsx-boolean-value": 2,
    "react/jsx-closing-bracket-location": 2,
    "react/jsx-curly-spacing": [2, "never"],
    "react/jsx-equals-spacing": [ 2, "never" ],
    "react/jsx-handler-names": 2,
    "react/jsx-indent": [ 2, 2 ],
    "react/jsx-indent-props": [ 2, 2 ],
    "react/jsx-no-undef": 2,
    "react/jsx-pascal-case": 2,
    "react/jsx-space-before-closing": [ 2, "always" ],
    "react/jsx-uses-react": 2,
    "react/jsx-uses-vars": 2,
    "react/no-deprecated": 2,
    "react/no-did-mount-set-state": 2,
    "react/no-did-update-set-state": 2,
    "react/no-direct-mutation-state": 2,
    "react/no-is-mounted": 2,
    "react/prefer-stateless-function": 2,
    "react/require-render-return": 2,
    "react/sort-comp": 2,
    "react/wrap-multilines": 2
  }
}