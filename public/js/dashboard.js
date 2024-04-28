const popupBtn = document.querySelector('.popupBtn');
const toggleMode = document.querySelector('.toggleMode');
const deployNav = document.querySelector('.deployNav');
const logoutBtn = document.getElementById('logoutBtn');
const dateData = document.getElementById('dateData');
let timerData = document.querySelector('.timerBooster');
const cardNumberData = document.getElementById('cardNumberData');
const boosterContainer = document.querySelector('.profileDashboardBox__boosterBox');
const notifBtn = document.querySelector('.notificationsBtn')
const openFriendSearch = document.getElementById('openFriendSearch');
const filter = document.querySelector('.filter');
const searchFriendInput = document.getElementById('searchFriend');

const date = new Date();
const options = { weekday: 'long', month: 'long', day: 'numeric' };
const dateString = date.toLocaleDateString('en-US', options);
dateData.innerText = dateString;

// ----------------- Click Events ----------------- //

document.addEventListener('click', async (e) => {
    const btn = e.target.closest('#openBoosterBtn');
    const btnCancel = e.target.closest('.cancelBtn');
    const btnAccept = e.target.closest('.acceptBtn');
    const btnRemove = e.target.closest('.removeBtn');
    const btnDecline = e.target.closest('.refuseBtn')
    
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

            // ---------------- Create a new window for the booster opening ----------------- //

            openBoosterWindow(data);

            // ---------------- Update les données des cartes sur la page --------------------- //
            
            updateCardsData()

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
    } else if (btnCancel) {

        try {

            const response = await fetch('/users/friendRequests/cancel/' + btnCancel.dataset.request, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            })

            if (response.status === 200) {
                document.querySelector(`[data-request="${btnCancel.dataset.request}"]`).remove();
            } else {
                alert('An error occured');
            }

        } catch (error) {
            alert(error.message);
        }
    } else if (btnAccept) {

        try {
            
            const response = await fetch('/users/friendRequests/accept/' + btnAccept.dataset.request, {
                method: 'PUT',
                headers: {
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${token}`
                    }
                })
                        
            if (response.status === 200) {
                let text = document.querySelector(`.sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox__text[data-request="${btnAccept.dataset.request}"]`);
                text.innerText = `Vous avez accepté la demande d'ami de ${text.dataset.name} !`;        
                btnAccept.parentNode.remove();
                
                // Refresh the friends list
                friendsArray = await fetchFriends();
                createFriends(friendsArray)

            } else {
                return alert('An error occured');
            }

        } catch (error) {
            alert(error.message)
        }

    } else if (btnRemove) {

        try {
            const response = await fetch('/users/friendRequests/remove/' + btnRemove.dataset.friend, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            })

            const data = await response.json()

            if (response.status === 200) {
                // Refresh the friends list
                friendsArray = await fetchFriends();
                createFriends(friendsArray)

            } else {
                alert('An error occured');
            }

        } catch (error) {
            alert(error.message);
        }
    } else if (btnDecline) {

        try {
            
            const response = await fetch('/users/friendRequests/decline/' + btnDecline.dataset.request, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            })

            if (response.status === 200) {
                document.querySelector(`.sliderBox__sliderContainer__notifBox__notifList__notifElement[data-request="${btnDecline.dataset.request}"]`).remove();
            } else {
                alert('An error occured');
            }

        } catch (error) {
            alert(error.message)
        }

    }
    

})

searchFriendInput.addEventListener('input', debounce(getSearchResults, 500))

function debounce(callback, delay) {
    let timeout;
    return function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            callback()
        }, delay);
    }
}

async function getSearchResults() {
    
    try {
        // Get the value of the input
        const query = searchFriendInput.value;
        
        // Get the URL parameters
        const url = new URL(window.location.href);
        // Get the search query from the input
        const params = new URLSearchParams(url.search);
        // Update the URL parameters
        params.set('searchq', query);        
        // Update the URL with the new parameters
        url.search = params.toString();
        
        const searchFriendResult = document.getElementById('searchFriendResult');
        if (!query) {
            searchFriendResult.innerHTML = 'No results found';
            params.delete('searchq', "")
            const newUrl = `${window.location.pathname}`;
            console.log(newUrl);
            window.history.replaceState({}, '', newUrl)
            return;
        };
        
        // Update the browser URL without reloading the page
        window.history.replaceState({}, '', url.toString())
        
        const searchQuery = params.get('searchq');

        const response = await fetch('/users/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                searchQuery
            })
        });
    
        const data = await response.json();
        
        if (data.message) {
            searchFriendResult.innerHTML = data.message;
            return;
        }

        searchFriendResult.innerHTML = '';

        for (user of data) {
            searchFriendResult.appendChild(createSearchResult(user));
        }
        
    } catch (error) {
        console.log(error.message);
    }

}

openFriendSearch.addEventListener('click', () => {
    document.querySelector('.searchFriendBox').classList.toggle('active');
    document.querySelector('.filter').classList.toggle('active');
});

filter.addEventListener('click', () => {
    document.querySelector('.searchFriendBox').classList.remove('active');
    document.querySelector('.filter').classList.remove('active');
});

notifBtn.addEventListener('click', () => {
    document.querySelector('.sliderBox').classList.toggle('open');
})

popupBtn.addEventListener('click', () => {
    document.querySelector('.popupBox').classList.toggle('active');
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
        },
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
    
    return { userData, cardsData }

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
    document.getElementById('nameData').innerText = userData.user.name;
    document.getElementById('emailData').innerText = userData.user.email;
    document.getElementById('cardNumberData').innerText = cardsData.numberCards;
    document.getElementById('houseNumberData').innerText = cardsData.numberHouses + ' / 4';
    // document.getElementById('friendNumberData').innerText = userData.user.friends.length;
    const friendNumber = userData.user.sentFriendRequests.filter(request => request.status === 'ACCEPTED').length 
                        + userData.user.receivedFriendRequests.filter(request => request.status === 'ACCEPTED').length;
                
    document.getElementById('friendNumberData').innerText = friendNumber;

    let timerMs = userData.user.next_booster - Date.now();
    
    updateTimer(timerMs);
    if (timerMs <= 0) {
        getBoosterBtn();
        return;
    } 

    loopTimer(timerMs);
} 

async function updateCardsData() {

    try {
        
        const responseCards = await fetch('/users/cards/show', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        
        const cardsData = await responseCards.json();

        document.getElementById('cardNumberData').innerText = cardsData.numberCards;
        document.getElementById('houseNumberData').innerText = cardsData.numberHouses + ' / 4';

    } catch (error) {
        alert(error.message)
    }

} 


function getBoosterBtn() {
    
    timerData.remove();

    const boosterBtn = document.createElement('button');
    boosterBtn.id = 'openBoosterBtn';
    boosterBtn.innerText = 'Open Booster';
    boosterContainer.appendChild(boosterBtn);
    return;
}

function openBoosterWindow(data) {
    const window = document.createElement('div');
    window.classList.add('boosterWindow');

    const windowTitle = document.createElement('h2');
    windowTitle.classList.add('boosterWindow__title');
    windowTitle.innerText = 'Booster Opening !';

    const windowCardsBox = document.createElement('div');
    windowCardsBox.classList.add('boosterWindow__cardsBox');

    for (let i = 0; i < 5; i++) {
        windowCardsBox.appendChild(createNewCard(data.cards[i], i));
    }

    const windowCloseBtnBox = document.createElement('div');
    windowCloseBtnBox.classList.add('boosterWindow__boxBtn');
    const windowCloseBtn = document.createElement('button');
    windowCloseBtn.innerText = 'Close';
    windowCloseBtn.classList.add('boosterWindow__boxBtn__closeBtn');
    windowCloseBtnBox.appendChild(windowCloseBtn);

    windowCloseBtn.addEventListener('click', () => {
        window.remove();
    })

    window.appendChild(windowTitle);
    window.appendChild(windowCardsBox);
    window.appendChild(windowCloseBtnBox);

    document.getElementById('wrapper').appendChild(window);

}

function createNotifications(receivedFriendRequests, sentFriendRequests) {
    const notificationsList = document.getElementById('notifList');
    
    if (!receivedFriendRequests.length && !sentFriendRequests.length) {
        notificationsList.innerHTML = "No notifications";
        return;
    }
    
    for (friendRequestSent of sentFriendRequests) {
        if (friendRequestSent.status === 'REJECTED') continue;
            notificationsList.appendChild(notificationTemplate(friendRequestSent, 'sent'));
        if (friendRequestSent.status === 'ACCEPTED') {
            friendsList.appendChild(friendTemplate(friendRequestSent, 'sent'));
        }
    }
    
    for (friendRequestReceived of receivedFriendRequests) {
        if (friendRequestReceived.status === 'REJECTED') continue;
        notificationsList.appendChild(notificationTemplate(friendRequestReceived, 'received'));
    }
    
}

function createFriends(friendsArray) {
    const friendsList = document.getElementById('friendList');

    if (!friendsArray.length) {
        friendsList.innerHTML = "No friends";
        return;
    }

    friendsList.innerHTML = "";

    for (friendData of friendsArray) {
        friendsList.appendChild(friendTemplate(friendData));
    }
}

async function fetchFriends() {

    try {
        
        const response = await fetch('/users/friends', {
            method: 'GET',
            headers: {
                'Content-type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        })

        const data = await response.json()

        return data;

    } catch (error) {
        alert(error.message)
    }
} 

// Fetch data from the server and update the profile at the loading of the page
(async () => {

    try {
        const { userData, cardsData } = await fetchData();
        updateProfile(userData, cardsData);
        createNotifications(userData.user.receivedFriendRequests, userData.user.sentFriendRequests);
        let friendsArray = await fetchFriends();
        createFriends(friendsArray)
        
    } catch (error) {
        
        alert('Internal server error.')

    }

})();