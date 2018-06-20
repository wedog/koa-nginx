module.exports = {
	root: true,
	parserOptions: {
		parser: 'babel-eslint',
		sourceType: 'module',
		ecmaFeatures: {
			experimentalObjectRestSpread: true,
			modules: true
		}
	},
	env: {
		browser: true,
		node: true,
		es6: true
	},
	extends: [
		'eslint-config-egg'
	],
	rules: {
		'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
		'linebreak-style': 'off',
		'no-mixed-spaces-and-tabs': 0,
		'object-shorthand': 0
	},
};
