const boxCards = document.querySelector(".cardsList");
const urlAPI = "https://hp-api.onrender.com/api/characters";
// const urlAPI = "https://hp-api.lainocs.fr/characters";
const filterTags = document.querySelectorAll(".filterTag");
const tagList = document.querySelector(".tagsList");
const allTags = document.querySelectorAll(".tag");
const searchBar =  document.getElementById('search');
let dataArray;

async function getPersonnage() {
  // fetch the data in the API
  const data = await fetch('/cards');
  const personnages = await data.json();
  dataArray = Array.from(personnages);
  // console.log(dataArray);

  createCards();
}



// Create the template of each card
function createCards() {
  dataArray.forEach((perso) => {

    const card = document.createElement("figure");
    card.className = "card";
    card.id = `${perso.id}`
    card.setAttribute('data-name', perso.name);
    card.setAttribute('data-house', perso.house);

    // If there is no image given in the api for a personnage, use a img in my folder.
    const image = perso.image;

    if (perso.house == null) {
      // Creating the template for the cards
      let template = `
            <img src="${image}" alt="Personnage image.">
            <figcaption>
                <h3 class="card-name">${perso.name}</h3>
                <p class="card-actor">${perso.actor}</p>
            </figcaption>
            <i class="fa-solid fa-house-circle-xmark"></i>`;

      card.innerHTML = template;
      
    } else {
      let template = `
            <img src="${image}" alt="Personnage image.">
            <figcaption>
                <h3 class="card-name">${perso.name}</h3>
                <p class="card-actor">${perso.actor}</p>
            </figcaption>
            <i class="fa-solid fa-house ${perso.house.toLowerCase()}"></i>`;

      card.innerHTML = template;

    }

    // On each card, add a onclick event to redirect on its information page.
    card.addEventListener("click", () => {
      window.location.href = "cartes/carte.html?id=" + perso.id;
    });

    // Add the cards in the box cards.
    boxCards.appendChild(card);
  });
}

filterTags.forEach((filter) => {
  filter.addEventListener("click", addTag);
});

// Add a tag filter
function addTag(e) {

  // If data-active attribut is set to false
  if (e.target.getAttribute("data-active") === "false") {
    // And if there is already a filter set to true, set it to false and hide it.
    if (document.querySelector('.filterTag[data-active="true"]')) {
      (document.querySelector(`.tag[data-name="${document.querySelector('.filterTag[data-active="true"]').getAttribute('data-name')}"]`).classList.remove('visible'));
      document.querySelector('.filterTag[data-active="true"]').setAttribute('data-active', "false");
    }

    // If there is no filter set to true
    const tagTargeted = document.querySelector(`.tag[data-name="${e.target.getAttribute("data-name")}"]`);
    tagTargeted.classList.add("visible");
    e.target.setAttribute("data-active", "true");
    
    // Get the filter done
    filterCards(e.target)
  }
}

function filterCards(filtre) {

  // Hide all the cards
  const cardsArray = document.querySelectorAll('.card');
  cardsArray.forEach(card => {
    card.classList.add('hidden');
  })

  // Create a filtered array using the dataArray created at the beginning (contains all the objects of the API call)
  const filteredArray = dataArray.filter(perso => perso.house?.toLowerCase() === filtre.getAttribute('data-name').toLowerCase());
  // console.log(filteredArray);
  
  // Compare the information between each object id and card id to found the cards to show
  filteredArray.forEach(persoFiltered => {
    for (let i = 0; i < cardsArray.length; i++) {
      if (cardsArray[i].getAttribute('id') == persoFiltered.id) {
        cardsArray[i].classList.remove('hidden');
        // break the loop because we already found the card
        break;
      }
    }
  });

}


// Remove house filter.
allTags.forEach((tag) => {

  // Removing a tag by clicking on his cross
    tag.childNodes[1].addEventListener("click", () => {

      // Put all cards visible 
      const cardsArray = document.querySelectorAll('.card');
      cardsArray.forEach(card => {
        card.classList.remove('hidden');
      });

      // Set the filter data-active attribut on false then put de tag hidden.
      const filterTargeted = document.querySelector(`.filterTag[data-name="${tag.getAttribute("data-name")}"`);
      filterTargeted.setAttribute("data-active", "false");
      tag.classList.remove("visible");
    });

});


// Function for the search input.
searchBar.addEventListener('input', (e) => {
  // reset of the box error
  document.getElementById('boxError').innerText = '';

  // then get the search value in lowercase to use it for the filter (we remove the whites spaces too)
  const searchValue =  e.target.value.toLowerCase().replace(/\s/g, "");
  const cards = document.querySelectorAll('.card');


  // If search value is empty
  if (searchValue === '') {

    // We loo at the active filter
    const house = document.querySelector('.filterTag[data-active="true"]')?.dataset.name.toLowerCase();

    // If there is no active filter, we show all the cards
    if (!house) {
      cards.forEach(card => {
        card.classList.remove('hidden');
      });
      return;
    }

    // If there is an active filter, we show only the cards of the house
    cards.forEach(card => {
      if (card.dataset.house.toLowerCase() === house) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });

    return;
  }  

   // If the search value is not empty, we hide all the cards
  // and we show only the cards that contains the search value in their data-name
  cards.forEach(card => {
    const name = card.dataset.name.toLowerCase();

    if (!name.includes(searchValue)) {
      card.classList.add('hidden');
    } else {
      card.classList.remove('hidden');
    }

  });

  
})


async function start() {
  await getPersonnage();
}

start();

