const path = require('path');

module.exports = {
	mode: 'development',
	entry: './src/index.js',
	output: {
		filename: 'main.js',
		path: path.resolve(__dirname, 'dist'),
	},
	devtool: 'inline-source-map',
	module: {
		rules: [
			{
				test: /\.png/,
				type: 'asset/resource',
			},
		],
	},
};
