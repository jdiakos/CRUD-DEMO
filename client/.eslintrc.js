module.exports = {
    "env": {
        "browser": true,
        "es2021": true
    },
    "extends": "plugin:react/recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "plugins": [
        "react"
    ],
    "rules": {
        "semi": 2,
        "react/prop-types": 0,
        "react/jsx-uses-vars": [
            2
        ],
        "react/jsx-max-props-per-line" : [2, {"maximum": 1}],
        "react/jsx-indent-props": [2, 4],
        "react/jsx-no-undef": "error",
        "no-console": 0,
        "react/react-in-jsx-scope": "off",
        "max-params": [2,3],
        "multiline-ternary": ["error", "always"]
    }
};
