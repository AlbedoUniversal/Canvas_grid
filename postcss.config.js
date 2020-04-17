// npm install postcss-loader autoprefixer css-mqpacker cssnano --save-def
// постсиэсэс много плагинов, и чтобы удобно было их подклачть - создали этот файл.
module.exports = {
  // тут прописываем в массив все наши плагины, которые мы будем подклоючать

  plugins: [
    require("autoprefixer"),
    require("css-mqpacker"), // сжимает все медиа запросы в один фаил
    require("cssnano")({
      // сжимает наш код по умному, сейчас его настроим
      preset: [
        "default",
        {
          discardComments: {
            // удаление всех комментов на продакшн
            removeAll: true
          }
        }
      ]
    })
  ]
};
