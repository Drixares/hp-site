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

    const target = e.target;
    
    if (target.matches('#openBoosterBtn')) {

        // Handle booster button click
        const OpenBooster = e.target.closest('#openBoosterBtn');
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

            if (response.status === 200) {
                const data = await response.json();
                const timerMs = data.booster - Date.now();
                OpenBooster.remove();
    
                // ---------------- Create a new window for the booster opening ----------------- //
    
                openBoosterWindow(data);
    
                // ---------------- Update les données des cartes sur la page --------------------- //
                
                await updateCardsData()
    
                // A mettre au moment au l'utilisateur ferme la fenêtre de booster
                updateTimer(timerMs, true);
                if (timerMs <= 0) {
                    getBoosterBtn();
                    return;
                } 
        
                loopTimer(timerMs);   
                
            } else {
                alert('An error occured');
            }
    
            
        } catch (error) {    
            alert(error.message);
        }

    } else if (target.matches('.cancelBtn[data-type="friendrequest"]')) {

        const CancelFriendRequest = e.target.closest('.cancelBtn[data-type="friendrequest"]');

        try {

            const response = await fetch('/users/friendRequests/cancel/' + CancelFriendRequest.dataset.request, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            })

            if (response.status === 200) {
                document.querySelector(`.friendRequestElement[data-request="${CancelFriendRequest.dataset.request}"]`).remove();
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

    } else if (target.matches('.acceptBtn[data-type="friendrequest"]')) {

        const AcceptFriendRequest = e.target.closest('.acceptBtn[data-type="friendrequest"]');

        try {
            
            const response = await fetch('/users/friendRequests/accept/' + AcceptFriendRequest.dataset.request, {
                method: 'PUT',
                headers: {
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${token}`
                    }
                })
                        
            if (response.status === 200) {
                const data = await response.json()

                if (AcceptFriendRequest.closest(`.friendRequestElement[data-request="${AcceptFriendRequest.dataset.request}"]`)) {
                    AcceptFriendRequest.closest(`.friendRequestElement[data-request="${AcceptFriendRequest.dataset.request}"]`).remove()

                } else {
                    document.querySelector(`.sliderBox__sliderContainer__notifBox__notifList__notifElement[data-request="${AcceptFriendRequest.dataset.request}"]`).remove()
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

    // Handle accept friend request click
    } else if (target.matches('.removeBtn[data-type="friendrequest"]')) {
        const RemoveFriendRequest = e.target.closest('.removeBtn[data-type="friendrequest"]');

        try {
            const response = await fetch('/users/friendRequests/remove/' + RemoveFriendRequest.dataset.friend, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            })

            
            if (response.status === 200) {
                // const data = await response.json()
                // Refresh the friends list
                friendsArray = await fetchFriends();
                console.log("test1");
                createFriends(friendsArray)
                console.log("test2");
                
                document.querySelectorAll('.tradeRequestElement').forEach(tradeNotif => {
                    if (tradeNotif.dataset.name === RemoveFriendRequest.dataset.friend) {
                        tradeNotif.remove();
                    }
                })

                console.log("test3");

                if (document.getElementById('friendList').children.length === 0) {
                    document.getElementById('friendList').innerHTML = 'No friends'
                }


            } else {
                alert((await response.json()).message);
            }

        } catch (error) {
            alert('An error occured');
        }

    // Handle remove friend request click
    } else if (target.matches('.refuseBtn[data-type="friendrequest"]')) {
        const DeclineFriendRequest = e.target.closest('.refuseBtn[data-type="friendrequest"]');

        try {
            
            const response = await fetch('/users/friendRequests/decline/' + DeclineFriendRequest.dataset.request, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            })

            if (response.status === 200) {
                document.querySelector(`.friendRequestElement[data-request="${DeclineFriendRequest.dataset.request}"]`).remove();
                if (document.getElementById('notifList').children.length === 0) {
                    document.getElementById('notifList').innerHTML = 'No notifications'
                }
            } else {
                alert('An error occured');
            }

        } catch (error) {
            alert(error.message)
        }

    } else if (target.matches('.addBtn[data-type="friendrequest"]')) {

        const SendFriendRequest = e.target.closest('.addBtn[data-type="friendrequest"]');

        try {
            
            const response = await fetch('/users/friendRequests/send/' + SendFriendRequest.dataset.user, {
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

    } else if (target.matches('.tradeBtn')) {
        const tradeBtn = e.target.closest('.tradeBtn');

        const friendId = tradeBtn.dataset.friend;
        const friendName = document.querySelector(`.sliderBox__sliderContainer__friendBox__friendList__friendElement__name[data-friend="${tradeBtn.dataset.friend}"]`).innerText;
        
        await openTradeWindow(friendId, friendName)

    } else if (target.matches('.dropdown__selected')) {
        const dropDownSelected = e.target.closest('.dropdown__selected');

        // document.querySelector('.dropdown__list.active')?.classList.remove('active')
        document.querySelector(`.dropdown__list[data-dropdown="${dropDownSelected.dataset.dropdown}"]`).classList.toggle('active')

    } else if (target.matches('.dropdown__list__element')) {

        const dropDownElement = e.target.closest('.dropdown__list__element')

        const cardSelected = document.querySelector(`.dropdown__selected[data-dropdown="${dropDownElement.dataset.dropdown}"]`);
        cardSelected.innerText = dropDownElement.innerText;
        cardSelected.setAttribute('data-card', `${dropDownElement.dataset.card}`)
        document.querySelector(`.dropdown__list[data-dropdown="${dropDownElement.dataset.dropdown}"]`).classList.remove('active')

    } else if (target.matches('.SendTradeRequest[data-type="traderequest"]')) {

        const SendTradeRequest = e.target.closest('.SendTradeRequest');

        try {

            const sendData = {
                giftCard: document.querySelector('.dropdown__selected[data-dropdown="give"]').dataset.card,
                requestedCard: document.querySelector('.dropdown__selected[data-dropdown="receive"]').dataset.card,
                friendId: SendTradeRequest.dataset.friend,
            }

            if (!sendData.giftCard || !sendData.requestedCard) {
                alert('Please select a card to give and a card to receive')
                return;
            }
            
            const response = await fetch('/users/tradeRequests/send', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    giftCard: sendData.giftCard,
                    requestedCard: sendData.requestedCard,
                    friendId: sendData.friendId,
                })
            })
            
            if (response.status === 200) {
                const data = await response.json();
                playCheckAnimation();
                createNotifications([], [], [data.tradeRequest], [])
                await updateCardsData()
            }
            
        } catch (error) {
            alert(error.message)
        }
        
        
    } else if (target.matches('.cancelBtn[data-type="traderequest"]')) {

        try {
            
            const cancelTradeBtn = e.target.closest('.cancelBtn[data-type="traderequest"]');

            const response = await fetch('/users/tradeRequests/cancel/' + cancelTradeBtn.dataset.request, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            })

            if (response.status === 200) {
                document.querySelector(`.tradeRequestElement[data-request="${cancelTradeBtn.dataset.request}"]`).remove();
                await updateCardsData()
                if (document.getElementById('notifList').children.length === 0) {
                    document.getElementById('notifList').innerHTML = 'No notifications'
                }

            } else {
                alert('An error occured');
            }

        } catch (error) {
            alert(error.message)
        }


    } else if (target.matches('.acceptBtn[data-type="traderequest"]')) { 

        try {
            
            const acceptTradeBtn = e.target.closest('.acceptBtn[data-type="traderequest"]');

            const response = await fetch('/users/tradeRequests/accept/' + acceptTradeBtn.dataset.request, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            })

            if (response.status === 200) {
                // A compléter  
                if (document.querySelector('.infosTradeBox')) {
                    document.querySelector('.infosTradeBox').remove();
                    filter.classList.remove('active');
                    await updateCardsData()
                }

            } else {
                alert('An error occured');
            }

        } catch (error) {
            
            alert(error.message)
        }

    } else if (target.matches('.refuseBtn[data-type="traderequest"]')) {

        try {
            
            const removeTradeBtn = e.target.closest('.refuseBtn[data-type="traderequest"]');

            const response = await fetch('/users/tradeRequests/decline/' + removeTradeBtn.dataset.request, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'authorization': `Bearer ${token}`
                }
            })

            if (response.status === 200) {
                document.querySelector(`.tradeRequestElement[data-request="${removeTradeBtn.dataset.request}"]`).remove();
                if (document.querySelector('.infosTradeBox')) {
                    document.querySelector('.infosTradeBox').remove();
                    filter.classList.remove('active');
                }

                if (document.getElementById('notifList').children.length === 0) {
                    document.getElementById('notifList').innerHTML = 'No notifications'
                }

            } else {
                alert('An error occured');
            }

        } catch (error) {   
            alert(error.message)
        }

    } else if (target.matches('.seeTradeBtn[data-type="traderequest"]')) {

        openTradeInfosWindow(e.target)

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
        
    } else if( document.querySelector('.tradeBox.active')) {
        document.querySelector('.tradeBox.active').classList.remove('active');
    } else if (document.querySelector('.infosTradeBox')) {
        document.querySelector('.infosTradeBox').remove();
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
        
        if (responseCards.status === 200) {
            const cardsData = await responseCards.json();

            if (cardNumberData) {
                userCardsCache.numberCards !== cardsData.numberCards ? 
                    document.getElementById('cardNumberData').innerText = cardsData.numberCards : null;
                userCardsCache.numberHouses !== cardsData.numberCards ? 
                    document.getElementById('houseNumberData').innerText = cardsData.numberHouses + ' / 4' : null;
            }
            
            userCardsCache = cardsData;
        }


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
    
    if (!receivedFriendRequests.length && !sentFriendRequests.length && !sentTradeRequests.length && !receivedTradeRequests.length) {
        notificationsList.innerHTML = "No notifications";
        return;
    }
    
    for (friendRequestSent of sentFriendRequests) {
        if (friendRequestSent.status === 'REJECTED') continue;
        notificationsList.appendChild(notificationTemplate(friendRequestSent, 'sent', 'friendrequest'));
    }
    
    for (friendRequestReceived of receivedFriendRequests) {
        if (friendRequestReceived.status === 'REJECTED') continue;
        notificationsList.appendChild(notificationTemplate(friendRequestReceived, 'received', 'friendrequest'));
    }

    for (tradeRequestSent of sentTradeRequests) {
        if (tradeRequestSent.status === 'REJECTED') continue;
        notificationsList.appendChild(notificationTemplate(tradeRequestSent, 'sent', 'traderequest'));
    }

    for (tradeRequestReceived of receivedTradeRequests) {
        if (tradeRequestReceived.status === 'REJECTED') continue;
        notificationsList.appendChild(notificationTemplate(tradeRequestReceived, 'received', 'traderequest'));
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

    if (document.getElementById('friendNumberData')) {
        document.getElementById('friendNumberData').innerText = friendsArray.length;
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

function createOpenTradeWindow() {
    let cache = null;

    return async function openTradeWindow(friendId, friendName) {

        document.querySelector('.tradeBox__friendName').innerText = friendName;
        document.querySelector('.filter').classList.toggle('active');
        document.querySelector('.tradeBox').classList.toggle('active');
        document.querySelector('.SendTradeRequest').setAttribute('data-friend', friendId)

        if (cache !== null && userCardsCache === cache) {
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


        cache = userCardsCache;;
        return cache;
    }
}

function createTradeInfosWindow() {
    let cache = {};

    return async function TradeInfosWindow(target) {


        // Check if the tradeData is already in the cache
        if (cache[target.dataset.request]) {
            document.querySelector('.filter').classList.toggle('active');
            document.getElementById('wrapper').appendChild(templateTradeInfosWindow(cache[target.dataset.request], userCardsCache.cards))
            return;

        // If not, fetch the data from the server
        } else {

            try {
            
                const seeTradeBtn = target.closest('.seeTradeBtn[data-type="traderequest"]');
    
                const tradeRequest = await fetch('/users/tradeRequests/' + seeTradeBtn.dataset.request, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'authorization': `Bearer ${token}`
                    }
                })
    
                // If the request is successful, update the cache and append the template to the page
                if (tradeRequest.status === 200) {
                    const tradeData = await tradeRequest.json();
                    
                    const key = tradeData.request.id;
                    cache[key] = tradeData.request;
                    
                    console.log(cache);
                    document.querySelector('.filter').classList.toggle('active');
                    document.getElementById('wrapper').appendChild(templateTradeInfosWindow(cache[tradeData.request.id], userCardsCache.cards))
                }
    
            } catch (error) {
                
                alert(error.message)
            }
        }
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
            // console.log(data);

            cardsCache = data
            return data
        }

    } catch (error) {
        alert(error.message)
    }

}

function playCheckAnimation() {

    const playerBg = document.createElement('div');
    playerBg.classList.add('playerBg');

    const player = document.createElement('lottie-player');
    player.classList.add('checkAnimation');

    player.src = "https://lottie.host/d6e61a5f-00d2-45c5-bb55-0a702d15b942/NOq0Bo4CDR.json";
    player.autoplay = true;
    player.speed = 1;
    player.background = 'transparent';

    playerBg.appendChild(player);

    const tradeBox = document.querySelector('.tradeBox')
    tradeBox.appendChild(playerBg);

    player.addEventListener('complete', () => {
        setTimeout(() => {
            playerBg.remove();
            tradeBox.classList.remove('active');
            filter.classList.remove('active');
        }, 500);
    })
}


async function createCards(cardsData) {

    const cardsContainer = document.getElementById('cardsContainer');
  
    cardsData.forEach((card, i) => {
      cardsContainer.appendChild(createCardCollection(card, i));
    });
  
  }
  
async function fetchUsersCards() {

    let cache = null;

    return async function fetchCards() {

    if (cache !== null) {
        return cache;
    }

    try {
        
        const response = await fetch('/users/collection', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': `Bearer ${token}`
        }
        })

        if (response.ok) {
        const cards = await response.json();
        return cards
        }

        return null;

    } catch (error) {
        
        alert(error.message)
    }
    }

}

// Fetch data from the server and update the profile at the loading of the page
(async () => {

    try {

        // fetch only on the user's profile page 
        const { userData, cardsData } = await fetchData();
        if (cardNumberData) {
            updateProfile(userData, cardsData);
        }

        // fetch only on the user's collection page   
        if (document.getElementById('cardsContainer')) {
            // fetching the cards
            const fetchCards = await fetchUsersCards();
            const cards = await fetchCards();
            createCards(cards);
        }
        
        // always fetch
        createNotifications(userData.user.receivedFriendRequests, userData.user.sentFriendRequests, userData.user.sentTradeRequests, userData.user.receivedTradeRequests);
        let friendsArray = await fetchFriends();
        createFriends(friendsArray)

    } catch (error) {
        
        alert(error.message)
        
    }
    
  })();
  
  const openTradeWindow = createOpenTradeWindow();
  const openTradeInfosWindow = createTradeInfosWindow();