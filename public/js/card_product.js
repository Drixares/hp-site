document.addEventListener("DOMContentLoaded", async () => {
  // Récupération de l'id dans l'URL
  const urlParams = new URLSearchParams(window.location.search);
  const cardID = urlParams.get("id");

  try {

    const response = await fetch("/cards/" + cardID);
    const cardData = await response.json();

    const cardDetails = document.createElement('div');
    cardDetails.classList.add('card-details');
    cardDetails.innerHTML = `
        <div class="card-header">
          <div class="imgBox">
            <img src="${cardData.image}" alt="image ${cardData.name}">
          </div>
          <div class="infosBox">
            <div class="titleBox">
              <h1>${cardData.name}</h1>
              <span>${cardData.gender}</span>
            </div>
            <span>${cardData.species}</span>
          </div>
        </div>
        <div class="card-main">
          <p><span>House :</span> ${cardData.house}</p>
          <p><span>Actor :</span> ${cardData.actor}</p>
        </div>`

      document.querySelector('.cardBox').appendChild(cardDetails);

      const fetchLed = await fetch('/iot/lastVisited', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ lastVisited: cardData.house })
      });

  } catch (error) {
    console.error(error);
  }

});
