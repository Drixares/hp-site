const faqObjects = document.querySelectorAll(".faqObject");
const email = document.getElementById("emailToCopy");
const copyBtn = document.querySelector(".copyBtn");

faqObjects.forEach((object) => {
  object.firstElementChild.addEventListener("click", () => {
    object.lastElementChild.classList.toggle("hidden");
  });
});

copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(email.innerText);
  copyBtn.innerHTML = "Copied";
  copyBtn.style.color = "#01c101";
  setTimeout(() => {
    copyBtn.innerHTML = '<span>copy</span> <i class="fa-regular fa-copy"></i>';
    copyBtn.style.color = "var(--text)";
  }, 1000);
});