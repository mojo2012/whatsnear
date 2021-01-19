process.env.VUE_APP_VERSION = require("./package.json").version;

module.exports = {
	lintOnSave: false,
	configureWebpack: {
		devtool: "source-map",
	},
	devServer: {
		overlay: {
			warnings: true,
			errors: true,
		},
		disableHostCheck: true,
	},
	transpileDependencies: ["x5-gmaps"],
};
