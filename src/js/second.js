(() => {
  // делаем самовызывающуюся функцию, в ней весь код
  const cnv = document.querySelector("canvas");
  const ctx = cnv.getContext("2d"); // получаем контекст канваса

  let cw, ch, cx, cy; // cw - ширина канвас, ch - высота, сx -центр по икс сy - по игрик. она нам ныжны так как частицы будут появлять по центру окна
  function resizeCanvas() {
    // растягиваем канвас на всю область окна просмотра
    cw = cnv.width = innerWidth;
    ch = cnv.height = innerHeight;
    cx = cw / 2;
    cy = ch / 2;
  }
  resizeCanvas();

  window.addEventListener("resize", resizeCanvas()); //канвас теперь всегда адаптирован под резайс экрана

  const cfg = {
    //чтобы иметь простой доступ к добавлению цвета мы вынесли это все в этот объект
    hue: 0, // оттенок
    bgFillColor: "rgba(50,50,50,.05)", // свойство, отвечающее за цвет фона классика
    dirsCount: 100, // в зависимости от необходимого нам кол-ва направлений, в нашем случае это значение 6
    stepsToTurn: 20, // количнство шагов, после которых делаем разворот классика
    dotSize: 4, // ращзмер точки классика
    dotsCount: 300, // количесвто частиц
    dotsVelocity: 2, // скорость
    distance: 400, // дистанция для экспоненты, чтобы не доходя конца экрана точки исчезали
    gradientLength: 5, // длинна градиента
    gridAngle: 45
  };

  function drawRect(color, x, y, w, h, shadowColor, shadowBlur, gco) {
    // ф, где рисуем чистицы и заливку фона
    ctx.globalCompositeOperation = gco; // в переменной gco принимаем нужный тип наложения
    ctx.shadowColor = shadowColor || "black";
    ctx.shadowBlur = shadowBlur || 1;

    ctx.fillStyle = color; // применим цвет заливки
    ctx.fillRect(x, y, w, h); //заливаем прямоугольник
  }

  class Dot {
    constructor() {
      this.pos = { x: cx, y: ch }; //храним координаты точки
      this.dir =
        cfg.dirsCount === 6
          ? ((Math.random() * 3) | 0) * 2 // св-во объекта отвечающее за направление;  получаем от 0 - 5 число
          : (Math.random() * cfg.dirsCount) | 0;
      this.step = 0; // добавляем счетчик шагов в объект
    }

    redrawDot() {
      // добавляем метод для отображения точки на экране
      let xy = Math.abs(this.pos.x - cx) + Math.abs(this.pos.y - cy); // для плавной смены цветов
      let makeHue = (cfg.hue + xy / 5) % 360;
      let blur = cfg.dotSize - Math.sin(xy / 8) * 2;
      let color = `hsl(${makeHue}, 100%, 50%)`; // храним цвет частицы
      // let size = cfg.dotSize - Math.sin(xy / 9) * 2 - Math.sin(xy / 2); // размер классика
      let size = cfg.dotSize; // контроль длинны хвоста частицы;*
      let x = this.pos.x - size / 2; // сместим координаты частицы в минусовую сторону на половину размера самой частицы, чтобы она отображалась ровно поцентру
      let y = this.pos.y - size / 2; // сместим координаты частицы в минусовую сторону на половину размера самой частицы, чтобы она отображалась ровно поцентру

      drawRect(color, x, y, size, size, color, blur, "lighter"); // отправляем сюда все данные для отрисовки на холсте
    }
    moveDot() {
      // добавляем метод, в котором просто будем увеличивать или уменьшать положение по OX и OY
      this.pos.x += dirsList[this.dir].x * cfg.dotsVelocity;
      this.pos.y += dirsList[this.dir].y * cfg.dotsVelocity - 1;
      this.step++; // увеличваем значение шага на один
    }
    changeDir() {
      // метод для смены направления
      if (this.step % cfg.stepsToTurn === 0) {
        //помещаем условие, в котором поделилим по модулям текущее кол-во шагов на steptoturn, чтобы получить остаток
        this.dir =
          Math.random() * 6 > 0.5
            ? (this.dir + 1) % cfg.dirsCount
            : (this.dir + cfg.dirsCount - 1) % cfg.dirsCount;
      }
    }
    killDot(id) {
      // метод, чтобы удалить точку из канваса, через время так как они сильно разбредаются
      let percent = Math.random() * Math.exp(this.step / cfg.distance); // помещаем количество шагов в экспоненту
      if (percent > 100) {
        dotsList.splice(id, 1); // удалить 1 элемент
      }
    }
  }

  let dirsList = [];
  function creatDirs() {
    // направление частички, она должна двигаться на сетке из 6 угольников, а значит надо сгенерировать 6 направлений
    for (let i = 0; i < 360; i += 360 / cfg.dirsCount) {
      // итерации будут продолжаться до тех пор, пока i меньше 360; каждую итерацию переменную i будем увеличвать на 360/ на чисмло,
      // в зависимости от необходимого нам кол-ва направлений, в нашем случае это значение 6
      let x = Math.cos((i * Math.PI) / 180); // тут используем методы синуса и косинуса для получения значения икс и игрик
      // так как эти методы принимают радианы, то надо преобразовать значение i в радианы
      let y = Math.sin((i * Math.PI) / 180);
      dirsList.push({ x: x, y: y }); // каждую пару икс игрик объединим в объект и добавим в массив
    }
  }

  creatDirs();

  let dotsList = []; // массив, где храним частицы

  function addDot() {
    // ф вероятности поялвения новой частицы
    if (dotsList.length < cfg.dotsCount && Math.random() > 0.8) {
      dotsList.push(new Dot());
      cfg.hue = (cfg.hue + 1) % 360;
    }
  }

  function refreshDots() {
    // чтобы для каждой точки из массива вызывать этот набор методов напишем эту фугкцию
    dotsList.forEach((i, id) => {
      i.moveDot();
      i.redrawDot();
      i.changeDir();
      i.killDot(id);
    });
  }

  // let dot = new Dot(); // создаем новую точку и вызываем ее метод, чтобы отобразить ее на страничке

  function loop() {
    drawRect(cfg.bgFillColor, 0, 0, cw, ch, 0, 0, "normal"); // когда наша частица уходит вправо, оставляя след, но нам надо избавиться от этого следа,
    // вызовем в начале цикла анимацию уже написанную нами функецию drawRect. Раннее вы передавали в нее аргументы для отрисвоки маленькой точки,
    // а теперь передадим новые данные для отрисовки прямоугольника с размерами на весь холст//
    // первым аргументом идет  цвет, и чтобы не прописывать его здесь и иметь к нему простой доступ, если вдруг мы захотим его изменить, вынесем его в отдельный объект
    // который разместим вверху  - строка 18;
    //2 и 3 аргументы идут координаты начала прямоугольника = это нули. , cw - ширина канваса, сh = высота
    addDot();
    refreshDots();
    // dot.redrawDot();
    // dot.moveDot();
    // dot.changeDir();

    requestAnimationFrame(loop); // зацикливаем луп, используя спец метод, благодаря этому методу - тело функции будет себя вызывать
    // каждые 60 секунд в зависимости от  текущей загруженности экрана
  }
  loop();
})();

// варианты как включить иные варианты //
////////////////////////////////////////
//1// ----- можем контролировать длинну хвоста частицы, увеличив прозрачность цвета для заливки canvas
//bgFillColor: "rgba(50,50,50,.01)";
// canvas { background-color: rbg(0,0,0)};
// dotSize: 2;
// stepsToTurn: 8;
// let size = cfg.dotSize

//2// ----- поменять сетку на треугольники
// dirsCount: 3 // и тд.

//3// ----- ращзвернуть на 45 градусов - не вопрос.
// в cfg объявим свойство gridAngle: 45;
// в ф. createDirs new variable => let angle = cfg.gridAngle + i;
// и всместо i => запишем angle
// let x = Math.cos((angle * Math.PI) / 180)
// let y = Math.sin((angle * Math.PI) / 180)

//4// ----- разместить точку поялвения внизу экрана
// this.pos = {x: cx, y: ch}
//  moveDot() {this.pos.y += dirsList[this.dir].y * cfg.dotVelocity - 1}
// dirsCount: 8
// stepsToTurn: 2
