// const popupBtn = document.querySelector('.popupBtn');
const toggleMode = document.querySelector('.toggleMode');
const deployNav = document.querySelector('.deployNav');
const logoutBtn = document.getElementById('logoutBtn');
const dateData = document.getElementById('dateData');
const cardNumberData = document.getElementById('cardNumberData');
const boosterContainer = document.querySelector('.profileDashboardBox__boosterBox');
const notifBtn = document.querySelector('.notificationsBtn')
const openFriendSearch = document.getElementById('openFriendSearch');
const filter = document.querySelector('.filter');
const searchFriendInput = document.getElementById('searchFriend');
let timerData = document.querySelector('.timerBooster');
let cardsCache = null;
let userCardsCache = null;

const date = new Date();
const options = { weekday: 'long', month: 'long', day: 'numeric' };
const dateString = date.toLocaleDateString('en-US', options);
dateData.innerText = dateString;

// ----------------- Click Events ----------------- //

document.addEventListener('click', async (e) => {
    const btnBooster = e.target.closest('#openBoosterBtn');
    const btnCancel = e.target.closest('.cancelBtn');
    const btnAccept = e.target.closest('.acceptBtn');
    const btnRemove = e.target.closest('.removeBtn');
    const btnDecline = e.target.closest('.refuseBtn');
    const btnAdd = e.target.closest('.addBtn');
    const tradeBtn = e.target.closest('.tradeBtn');
    const dropDownSelected = e.target.closest('.dropdown__selected');
    const dropDownElement = e.target.closest('.dropdown__list__element')
    const confirmTradeBtn = e.target.closest('.confirmTradeBtn');
    
    if (btnBooster) {
        
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
            const timerMs = data.booster - Date.now();
            btnBooster.remove();

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
                console.log(document.getElementById('notifList').children.length);
                if (document.getElementById('notifList').children.length === 0) {
                    document.getElementById('notifList').innerHTML = 'No notifications'
                }
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
                const data = await response.json()

                if (btnAccept.closest('.sliderBox__sliderContainer__notifBox__notifList__notifElement')) {
                    btnAccept.closest('.sliderBox__sliderContainer__notifBox__notifList__notifElement').remove()

                } else {
                    document.querySelector(`.sliderBox__sliderContainer__notifBox__notifList__notifElement[data-request="${btnAccept.dataset.request}"]`).remove()
                    getSearchResults()
                }

                createNotifications([data.friendRequest], [], [], [])

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

                if (document.getElementById('friendList').children.length === 0) {
                    document.getElementById('friendList').innerHTML = 'No friends'
                }

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
                if (document.getElementById('notifList').children.length === 0) {
                    document.getElementById('notifList').innerHTML = 'No notifications'
                }
            } else {
                alert('An error occured');
            }

        } catch (error) {
            alert(error.message)
        }

    } else if (btnAdd) {

        try {
            
            const response = await fetch('/users/friendRequests/send/' + btnAdd.dataset.user, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            })

            if (response.status === 200) {
                const data = await response.json()

                if (document.getElementById('notifList').children.length === 0) {
                    document.getElementById('notifList').innerHTML = ''
                }

                getSearchResults()
                createNotifications([], [data.friendRequest], [], [])

            } else if (response.status === 400) {
                alert((await response.json()).message)
            }

        } catch (error) {
            alert(error.message)
        }

    } else if (tradeBtn) {
        const friendId = tradeBtn.dataset.friend;
        const friendName = document.querySelector(`.sliderBox__sliderContainer__friendBox__friendList__friendElement__name[data-friend="${tradeBtn.dataset.friend}"]`).innerText;
        
        openTradeWindow(friendId, friendName)

    } else if (dropDownSelected) {
        // document.querySelector('.dropdown__list.active')?.classList.remove('active')
        document.querySelector(`.dropdown__list[data-dropdown="${dropDownSelected.dataset.dropdown}"]`).classList.toggle('active')
    } else if (dropDownElement) {
        const cardSelected = document.querySelector(`.dropdown__selected[data-dropdown="${dropDownElement.dataset.dropdown}"]`);
        cardSelected.innerText = dropDownElement.innerText;
        cardSelected.setAttribute('data-card', `${dropDownElement.dataset.card}`)
    
    } else if (confirmTradeBtn) {

        try {
            
            const response = await fetch('/users/tradeRequests/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    giftCard: document.querySelector('.dropdown__selected[data-dropdown="give"]').dataset.card,
                    requestedCard: document.querySelector('.dropdown__selected[data-dropdown="receive"]').dataset.card,
                    friendId: confirmTradeBtn.dataset.friend,
                })
            })

            if (response.status === 200) {
                const data = await response.json()
                console.log(data);
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
            // console.log(newUrl);
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

    if (document.querySelector('.searchFriendBox.active')) {
        document.querySelector('.searchFriendBox.active')?.classList.remove('active');
        document.getElementById('searchFriendResult').innerHTML = 'No results found'
        searchFriendInput.value = '';
        const newUrl = `${window.location.pathname}`;
        // console.log(newUrl);
        window.history.replaceState({}, '', newUrl)
        
    } else {
        document.querySelector('.tradeBox.active')?.classList.remove('active');
    }
    
    document.querySelector('.filter').classList.remove('active');

});

notifBtn.addEventListener('click', () => {
    document.querySelector('.sliderBox').classList.toggle('open');
})

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
    userCardsCache = cardsData;
    
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

    let timerMs = userData.user.booster - Date.now();
    
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
        userCardsCache = cardsData;

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

function createNotifications(receivedFriendRequests, sentFriendRequests, sentTradeRequests, receivedTradeRequests) {
    const notificationsList = document.getElementById('notifList');
    
    if (!receivedFriendRequests.length && !sentFriendRequests.length) {
        notificationsList.innerHTML = "No notifications";
        return;
    }
    
    for (friendRequestSent of sentFriendRequests) {
        if (friendRequestSent.status === 'REJECTED') continue;
        notificationsList.appendChild(notificationTemplate(friendRequestSent, 'sent'));
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

    document.getElementById('friendNumberData').innerText = friendsArray.length;
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

function createOpenTradeWindow() {
    let cache = null;

    return async function openTradeWindow(friendId, friendName) {

        document.querySelector('.tradeBox__friendName').innerText = friendName;
        document.querySelector('.filter').classList.toggle('active');
        document.querySelector('.tradeBox').classList.toggle('active');
        document.querySelector('.confirmTradeBtn').setAttribute('data-friend', friendId)

        if (cache !== null) {
            return cache;
        }

        const receiveList = document.querySelector('.dropdown__list[data-dropdown="receive"]');
        const giveList = document.querySelector('.dropdown__list[data-dropdown="give"]');
        const cards = await fetchAllCards()
        
        // What i can give
        for (let i = 0; i < userCardsCache.cards.length; i++) {
            const cardElement = document.createElement('div');
            cardElement.classList.add('dropdown__list__element')
            cardElement.setAttribute('data-dropdown', 'give')
            cardElement.setAttribute('data-card', userCardsCache.cards[i].card.id)
            cardElement.innerText = userCardsCache.cards[i].card.name

            giveList.appendChild(cardElement)
        }

        // What i want to receive
        for (const card of cards) {
            const cardElement = document.createElement('div');
            cardElement.classList.add('dropdown__list__element')
            cardElement.setAttribute('data-dropdown', 'receive')
            cardElement.setAttribute('data-card', card.id)
            cardElement.innerText = card.name

            receiveList.appendChild(cardElement)
        }


        cache = true;
        return cache;
    }
}

async function fetchAllCards() {

    if (cardsCache !== null) {
        return cardsCache
    }

    try {
        
        const response = await fetch('/cards')
        
        if (response.status === 200) {
            const data = await response.json()
            console.log(data);

            cardsCache = data
            return data
        }

    } catch (error) {
        alert(error.message)
    }

}

// Fetch data from the server and update the profile at the loading of the page
(async () => {

    try {
        const { userData, cardsData } = await fetchData();
        updateProfile(userData, cardsData);
        createNotifications(userData.user.receivedFriendRequests, userData.user.sentFriendRequests, userData.user.sentTradeRequests, userData.user.receivedTradeRequests);
        let friendsArray = await fetchFriends();
        createFriends(friendsArray)
        
    } catch (error) {
        
        alert(error.message)
        
    }
    
})();

const openTradeWindow = createOpenTradeWindow();