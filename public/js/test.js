//get params url
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const slug = urlParams.get("name");

let url = "https://hp-api.lainocs.fr/characters/" + slug;
let listeB = document.getElementById("list");

let urlpost = "http://192.168.177.183:3000/iot/dataled";
//post for update house in server
async function postJSON(data) {
  try {
    const response = await fetch(urlpost, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Success:", result);
  } catch (error) {
    console.error("Error:", error);
  }
}

async function fetchData() {

    try {

        const response = await fetch(url);
        const data = await response.json();

        //creer un element div
        let i = document.createElement("div");
        //ajouter une classe carte
        i.classList.add("carte");
        //mettre li en enfant de listeB (<ul>)
        listeB.appendChild(i);

        //je crée mon model de carte
        i.innerHTML = `
        <div class="card">
            <div class="img-box">
            <img src="${data.image}" class="card-img" alt="Avatar">
            </div>
            <div class="container">
            <h4><b>${data.name}</b></h4>
            <p>${data.house}</p>
            </div>
        </div>;
        `
        await postJSON({ lastVisited: data.house });

    } catch (error) {
        alert(error)
    }

}

fetchData()