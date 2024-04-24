async function getLastCard() {
  const response = await fetch('/iot/lastVisited');
  const data = await response.json();
  console.log(data);
  return data
}

getLastCard()
