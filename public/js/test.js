
// Méthode de cache pour éviter de fetch 2x lorque 

async function fetchCards() {

  // Je crée le cache
  let cache;

  return async function(useCache) {

    // Si il y a un argument
    if (cache && useCache) {
      return [cache, "N'appelle pas la fonction"]
    }

    try {
      
      const responseCards = await fetch('/users/cards/show', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      const cardsData = await responseCards.json();
      
      cache = cardsData;
      return cardsData
  
    } catch (error) {
      alert(error.message)
    }
  }

}

(async () => {
  const cards = await fetchCards()
  const testCard = await cards();
  console.log(testCard);
  console.log(await cards(true));

})()


// Je veux éviter de fetch plusieurs fois si mes cartes n'ont pas changées
// Donc je crée un cache dès la première instance de la fonction
// Et le cache devient le résultat du 1er fetch

// Problème :
// La valeur peut changer après la 1ere instance