const burgerIcon = document.getElementById("burgerIcon");
const mobileNav = document.querySelector(".mobileNav");

burgerIcon.addEventListener("click", () => {
  mobileNav.classList.toggle("open");
});
