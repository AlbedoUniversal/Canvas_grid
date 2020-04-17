let gridSystemItem = document.querySelectorAll(".example-grid__item");
let items = [];
[...gridSystemItem].forEach((elem, index, arr) => {
  elem.setAttribute("data-attribute", `item-${index + 1}`);
});

// window.addEventListener("resize", () => {
//   if (window.matchMedia("(max-width: 991px)").matches) {
//     document.querySelector("[data-attribute=item-1]>p").innerText =
//       "Уго как я вырос!!!";
//   } else {
//     document.querySelector("[data-attribute=item-1]>p").innerText =
//       "Снова я стал маленьким";
//   }
// });

document.querySelector("[data-attribute=item-1]>p");

// console.log(f);

// $(".example-grid__item").click(console.log("11q1211"));
