const webpack = require("webpack");
const merge = require("webpack-merge");
const baseWebpackConfig = require("./webpack.base.conf");
const devWebpackConfig = merge(baseWebpackConfig, {
  mode: "development",
  devtool: "cheap-module-eval-source-map",
  devServer: {
    contentBase: baseWebpackConfig.externals.paths.dist, //отвечает этот параметр за то, где юудет открываться веб пак
    port: 8081, // по дефолту 8080, однако хорошей практикой принято ставить 8081, потому что иногда будет работа со вторым сервером (php noda), и чтобы не было ошибки, ставим 8081
    overlay: {
      warnings: true,
      errors: true
    }
  },
  plugins: [
    new webpack.SourceMapDevToolPlugin({
      // это плагин - это базис, без которого не будет корректно работать карта сайта (обращаю внимание, что мы подключаем карту сайта именно в Dev, чтобы она не была в билде)
      filename: "[file].map"
    })
  ]
});

module.exports = new Promise((resolve, reject) => {
  resolve(devWebpackConfig);
});
