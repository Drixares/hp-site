const popupBtn = document.querySelector('.popupBtn');
const popupBox = document.querySelector('.popupBox');
const toggleMode = document.querySelector('.toggleMode');
const deployNav = document.querySelector('.deployNav');
const logoutBtn = document.getElementById('logoutBtn');
const nameData = document.getElementById('nameData');
const emailData = document.getElementById('emailData');
const dateData = document.getElementById('dateData');
let timerData = document.querySelector('.timerBooster');
const cardNumberData = document.getElementById('cardNumberData');
const houseNumberData = document.getElementById('houseNumberData');
const boosterContainer = document.querySelector('.profileDashboardBox__boosterBox');


const date = new Date();
const options = { weekday: 'long', month: 'long', day: 'numeric' };
const dateString = date.toLocaleDateString('en-US', options);
dateData.innerText = dateString;

// ----------------- Click Events ----------------- //

document.addEventListener('click', async (e) => {
    const btn = e.target.closest('#openBoosterBtn');
    
    if (btn) {
        
        try {
            const timerDataDynamic = document.createElement('span');
            timerDataDynamic.classList.add('timerBooster');
            boosterContainer.appendChild(timerDataDynamic);
            
            const response = await fetch('/users/booster/open', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            })
    
            const data = await response.json();
            const timerMs = data.next_booster - Date.now();
            btn.remove();

            cardNumberData.innerText = parseInt(cardNumberData.innerText) + 5;

            // ---------------- Create a new window for the booster opening ----------------- //

            const window = document.createElement('div');
            window.classList.add('boosterWindow');

            const windowTitle = document.createElement('h2');
            windowTitle.classList.add('boosterWindow__title');
            windowTitle.innerText = 'Booster Opening !';

            const windowCardsBox = document.createElement('div');
            windowCardsBox.classList.add('boosterWindow__cardsBox');

            for (let i = 0; i < 5; i++) {
                windowCardsBox.appendChild(createNewCard(data.cards[i]));
            }

            const windowCloseBtnBox = document.createElement('div');
            windowCloseBtnBox.innerHTML = `<button class="boosterWindow__boxBtn__closeBtn">Close</button>`;
            windowCloseBtnBox.classList.add('boosterWindow__boxBtn');
            windowCloseBtnBox.addEventListener('click', () => {
                window.remove();
            })

            window.appendChild(windowTitle);
            window.appendChild(windowCardsBox);
            window.appendChild(windowCloseBtnBox);

            document.getElementById('wrapper').appendChild(window);

            // ------------------------------------------------------------------------------ //
            

            // A mettre au moment au l'utilisateur ferme la fenêtre de booster
            updateTimer(timerMs, true);
            if (timerMs <= 0) {
                getBoosterBtn();
                return;
            } 
    
            loopTimer(timerMs);   
            
        } catch (error) {    
            alert(error.message);
        }
          
    }
})


popupBtn.addEventListener('click', () => {
    popupBox.classList.toggle('active');
});

toggleMode.addEventListener('click', () => {

    const rootElement = document.documentElement;
    let dataTheme = rootElement.getAttribute('data-theme'), newTheme;

    newTheme = (dataTheme === 'dark') ? 'light' : 'dark';
    rootElement.setAttribute('data-theme', newTheme);

    localStorage.setItem('theme', newTheme);
});

deployNav.addEventListener('click', () => {
    document.querySelector('.sidebar').classList.toggle('visible');
});

logoutBtn.addEventListener('click', async () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
});

// -------------------------------------------------- //

async function fetchData() {

    const response = await fetch('/users/getUser', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })

    if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        window.location.href = '/login';
    } else if (response.status === 404) {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
    
    const userData = await response.json();
    
    const responseCards = await fetch('/users/cards/show', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    })
    
    const cardsData = await responseCards.json();
    
    return { userData, cardsData}

}

function loopTimer(timerMs) {

    const intervalID = setInterval(() => {
        if (timerMs <= 0) {
            getBoosterBtn();
            console.log('Timer ended');
            clearInterval(intervalID);
        };
        updateTimer(timerMs);
        timerMs -= 1000;
    }, 1000)

}

function updateTimer(timerMs, afterOpen = false) {

    if (afterOpen === true) {
        timerData = document.createElement('span');
        timerData.classList.add('timerBooster');
        boosterContainer.appendChild(timerData);
        timerData = document.querySelector('.timerBooster');
    }

    let hoursSinceLastOpened = Math.floor(timerMs / 1000 / 60 / 60);
    let minutesSinceLastOpened = Math.floor((timerMs / 1000 / 60) % 60);
    let secondsSinceLastOpened = Math.floor((timerMs / 1000) % 60);

    timerData.innerText = `${hoursSinceLastOpened}h ${minutesSinceLastOpened}m ${secondsSinceLastOpened}s`;
}

function updateProfile(userData, cardsData) {
    nameData.innerText = userData.user.name;
    emailData.innerText = userData.user.email;
    cardNumberData.innerText = cardsData.numberCards;
    houseNumberData.innerText = cardsData.numberHouses;

    let timerMs = userData.user.next_booster - Date.now();
    
    updateTimer(timerMs);
    if (timerMs <= 0) {
        getBoosterBtn();
        return;
    } 

    loopTimer(timerMs);

} 


function getBoosterBtn() {
    
    timerData.remove();

    const boosterBtn = document.createElement('button');
    boosterBtn.id = 'openBoosterBtn';
    boosterBtn.innerText = 'Open Booster';
    boosterContainer.appendChild(boosterBtn);
    return;
}

function openBoosterWindow() {
    const window = document.createElement('div');
    window.classList.add('boosterWindow');

}


// Fetch data from the server and update the profile at the loading of the page
(async () => {
    const fetched = await fetchData();
    console.log(fetched);
    updateProfile(fetched.userData, fetched.cardsData);
})();


function createNewCard(cardData) {
    const cardContainer = document.createElement('div');
    cardContainer.classList.add('boosterWindow__cardsBox__cardContainer');
    const card = document.createElement('div');
    card.classList.add('boosterWindow__cardsBox__card');

    card.innerHTML = `
        <div class="boosterWindow__cardsBox__cardFront">
            <div class="boosterWindow__cardsBox__card__imageBox">
            <img src="${cardData.image}" alt="card image">
            </div>
            <span class="boosterWindow__cardsBox__card__name">${cardData.name}</span>
        </div>
        <div class="boosterwindow__cardsBox__cardBack"></div>
    `

    card.addEventListener('click', () => {
        card.classList.add('show');
    })
    cardContainer.appendChild(card);

    return cardContainer;
}