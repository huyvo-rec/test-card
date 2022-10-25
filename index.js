const dots = document.querySelectorAll(".dot");
const listSlider = document.querySelector(".wrapper__slider"),
  slides = Array.from(document.querySelectorAll(".wrapper__slider--child"));

let isDragging = false,
  startPos = 0,
  currentTranslate = 0,
  prevTranslate = 0,
  animationID,
  indexClick = 0,
  currentIndex = 0;

slides.forEach((slide, index) => {
  const slideImage = slide.querySelectorAll(".wrapper__text")[0];

  // disable default image drag
  slideImage.addEventListener("dragstart", (e) => e.preventDefault());

  // touch events
  slide.addEventListener("touchstart", touchStart(index));
  slide.addEventListener("touchend", touchEnd);
  slide.addEventListener("touchmove", touchMove);
  // mouse events
  slide.addEventListener("mousedown", touchStart(index));
  slide.addEventListener("mouseup", touchEnd);
  slide.addEventListener("mousemove", touchMove);
  slide.addEventListener("mouseleave", touchEnd);
});

dots.forEach((item, index) => {
  item.addEventListener("click", () => {
    touchStart(index);
    currentTranslate = index * -400;
    prevTranslate = currentTranslate;
    setSliderPosition();

    if (index !== indexClick) {
      dots[indexClick].className = dots[indexClick].className.replace(
        " dot-active",
        ""
      );
      item.classList.add("dot-active");
    }
    indexClick = index;
  });
});

// make responsive to viewport changes
window.addEventListener("resize", setPositionByIndex);

// prevent menu popup on long press
window.oncontextmenu = function (event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
};

function getPositionX(event) {
  return event.type.includes("mouse") ? event.pageX : event.touches[0].clientX;
}

function touchStart(index) {
  return function (event) {
    currentIndex = index;
    startPos = getPositionX(event);
    isDragging = true;
    animationID = requestAnimationFrame(animation);
  };
}

function touchMove(event) {
  if (isDragging) {
    const currentPosition = getPositionX(event);
    currentTranslate = prevTranslate + currentPosition - startPos;
  }
}

function touchEnd() {
  cancelAnimationFrame(animationID);
  isDragging = false;
  const movedBy = currentTranslate - prevTranslate;
  currentIndex = indexClick;
  // if moved enough negative then snap to next slide if there is one
  if (movedBy < -50 && currentIndex < slides.length - 1) {
    currentIndex += 1;
    indexClick = currentIndex;
  }
  // if moved enough positive then snap to previous slide if there is one
  if (movedBy > 50 && currentIndex > 0) {
    currentIndex -= 1;
    indexClick = currentIndex;
  }

  setPositionByIndex();

  dots;
  let i = 0;
  for (i = 0; i < dots.length; i++) {
    dots[i].className = dots[i].className.replace(" dot-active", "");
  }

  dots[currentIndex].className += " dot-active";
}

function animation() {
  setSliderPosition();
  if (isDragging) requestAnimationFrame(animation);
}

function setPositionByIndex() {
  currentTranslate = currentIndex * -400;
  console.log(currentIndex);
  prevTranslate = currentTranslate;
  setSliderPosition();
}

function setSliderPosition() {
  listSlider.style.transform = `translateX(${currentTranslate}px)`;
}
