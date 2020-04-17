// в этом файле описываются конфигурации для нашего веб пака
const fs = require("fs");
const path = require("path"); // делает рекваир (практически все что мы прописываем через рекваир, это мы обращаемся к package.json);
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const PATHS = {
  // лучше сразу вывести пути в константу; а зачем мы его поджключаем, если он уже есть в ноде? да просто так принято
  src: path.join(__dirname, "../src"),
  dist: path.join(__dirname, "../dist"),
  assets: "assets/"
};

const PAGES_DIR = `${PATHS.src}/pug/pages/`;
const PAGES = fs
  .readdirSync(PAGES_DIR)
  .filter(fileName => fileName.endsWith(".pug"));

module.exports = {
  // здесь экспортируем все наши настройки

  externals: {
    // нужен для того, чтобы получить доступ к константе PATHS из других наших конфигов. Чтобы их не копировать и не быть дурачком.
    paths: PATHS
  },
  entry: {
    // задается точка входа - указываем, что это объект и в этом объекте мы описываем сам путь к входному файлу JS
    // app: "./src/index.js" // это стандартный путь (заходим в папку src и создаем index.js, в котором подключаются все библиотеки). Но мы можем не писать index.js?, мы можем указать просто src и вебпак сам поймет что мы обращаемся к index.js. поэтому тоже самое делаем на строке 19
    app: PATHS.src
  },
  output: {
    // точка выхода,
    // filename: "[name].js", // почему [name]? потому что, если у нас будет несколько точек входа, то вылезит ошибка. Чтобыв ее не было, пишем [name], который берется из текущего ярлыка
    filename: `${PATHS.assets}js/[name].[contenthash].js`,
    // path: path.resolve(__dirname, "./dist"), // путь, здесь используем тот самый пакет, который устанавливали path. Зачем он? - webpack ищет путь точку входа с самого корня, если это винда то с диска ц и так далее. И для того, чтобы он искал этот путь наиболее корректно. Поэтому мы к нему обращаемся и через метод resolve передаем два параметра 1-ый дирнайм, и название папки дист, чтобы она создавалась здесь
    path: PATHS.dist, // cмотри строку 19
    publicPath: "/" // нужен для дев сервера, чтобы он корректно работал
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendor: {
          name: "vendors",
          test: /node_modules/,
          chunks: "all",
          enforce: true
        }
      }
    }
  },
  module: {
    rules: [
      {
        //правила
        test: /\.js$/, //регулярка на то, что мы будем проверять. Обратились через легулярку ко всем js файлам
        loader: "babel-loader", // подключаем лодер
        exclude: "/node_modules" //чтобы ускорить нашу компиляцию, мы будем исключать какие-либо файлы
      },
      {
        //правила
        test: /\.pug$/, //регулярка на то, что мы будем проверять. Обратились через легулярку ко всем pug файлам
        loader: "pug-loader" // подключаем лодер
        // exclude: "/node_modules" //чтобы ускорить нашу компиляцию, мы будем исключать какие-либо файлы, однако она закомментированна поскольку, мы не будем импортировать паг из нод модулес, так как это нам ничего не даст
      },
      {
        test: /\.(png|jpg|gif|svg)$/, //регулярка на то, что мы будем проверять. Обратились через легулярку ко всем js файлам
        loader: "file-loader", // подключаем лодер
        options: {
          name: "[name].[ext]"
        }
      },
      {
        test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]"
        }
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader, // каждый плагин надо регистрировать. Это мы делаем в конце (см. строку 42);
          {
            loader: "css-loader",
            options: { sourceMap: true }
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
              config: { path: `./js/postcss.config.js` }
            }
          },
          {
            loader: "sass-loader",
            options: { sourceMap: true }
          }
        ]
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          MiniCssExtractPlugin.loader, // каждый плагин надо регистрировать. Это мы делаем в конце (см. строку 42);
          {
            loader: "css-loader",
            options: { sourceMap: true }
          },
          {
            loader: "postcss-loader",
            options: {
              sourceMap: true,
              config: { path: `./postcss.config.js` }
            }
          }
        ]
      }
    ]
  },
  devServer: {
    overlay: true // отвечает за показ ошибок, чтобы они выводились не в консоли, а на экране браузера
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: `${PATHS.assets}css/[name].[contenthash].css`
    }),
    new CopyWebpackPlugin([
      { from: `${PATHS.src}/${PATHS.assets}img`, to: `${PATHS.assets}img` },
      { from: `${PATHS.src}/${PATHS.assets}fonts`, to: `${PATHS.assets}fonts` },
      { from: `${PATHS.src}/static`, to: "" }
    ]),
    // new webpack.ProvidePlugin({
    //   $: "jquery",
    //   jQuery: "jquery",
    //   "window.jQuery": "jquery"
    // }),
    ...PAGES.map(
      page =>
        new HtmlWebpackPlugin({
          template: `${PAGES_DIR}/${page}`,
          filename: `./${page.replace(/\.pug/, ".html")}`
        })
    )
  ]
};
