const innerCursor = document.querySelector(".cursor");

document.addEventListener("mousemove", moveCursor);

function moveCursor(e) {
  let x = e.clientX;
  let y = e.clientY;

  innerCursor.style.left = `${x}px`;
  innerCursor.style.top = `${y}px`;
}

const hoverElements = document.querySelectorAll(".text");
hoverElements.forEach((item) => {
  item.addEventListener("mouseover", () => {
    innerCursor.classList.add("grow");
  });
  item.addEventListener("mouseleave", () => {
    innerCursor.classList.remove("grow");
  });
});
