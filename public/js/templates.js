function notificationTemplate(request, direction, requestType) {

  const notification = document.createElement('div');
  notification.classList.add('sliderBox__sliderContainer__notifBox__notifList__notifElement');
  notification.setAttribute('data-request', request.id);

  if (direction === 'received' && requestType === 'friendrequest' && request.status === 'PENDING') {
    
    notification.setAttribute('data-name', request.sender.name);
    notification.classList.add('friendRequestElement');

    notification.innerHTML = `
      <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox" data-request="${request.id}">
        <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox__imgBox">
          <img src="./ressources/images/ace6549ae47649ed5ba46cc872320fba.jpg" alt="profile picture">
        </div>
        <p class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox__text" data-request="${request.id}" data-name="${request.sender.name}">${request.sender.name} vous a envoyé une demande d'ami !</p>
      </div>
      <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__btnBox">
        <button class="sliderBox__sliderContainer__notifBox__notifList__notifElement__btnBox acceptBtn" data-request="${request.id}" data-type="${requestType}">Accept</button>
        <button class="sliderBox__sliderContainer__notifBox__notifList__notifElement__btnBox refuseBtn" data-request="${request.id}" data-type="${requestType}"><i class="fa-solid fa-xmark"></i></button>
      </div>
    `
  } else if (direction === 'sent' && requestType === 'friendrequest' && request.status === 'PENDING') {
    
    notification.classList.add('friendRequestElement');

    notification.innerHTML = `
      <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox" data-request="${request.id}">
        <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox__imgBox">
          <img src="./ressources/images/ace6549ae47649ed5ba46cc872320fba.jpg" alt="profile picture">
        </div>
        <p class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox__text">Demande d'ami envoyée à ${request.receiver.name}.</p>
      </div>
      <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__btnBox">
        <button class="sliderBox__sliderContainer__notifBox__notifList__notifElement__btnBox cancelBtn" data-request="${request.id}" data-type="${requestType}">Cancel</button>
      </div>
    `
  } else if (direction === 'received' && requestType === 'friendrequest' && request.status === 'ACCEPTED') {

    notification.classList.add('friendRequestElement');

    notification.setAttribute('data-name', request.sender.name);

    notification.innerHTML = `
      <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox" data-request="${request.id}">
        <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox__imgBox">
          <img src="./ressources/images/ace6549ae47649ed5ba46cc872320fba.jpg" alt="profile picture">
        </div>
        <p class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox__text" data-request="${request.id}" data-name="${request.sender.name}">Vous avez accepté la demande d'ami de ${request.sender.name} !</p>
      </div>
    `
  } else if (direction === 'sent' && requestType === 'friendrequest' && request.status === 'ACCEPTED') {

    notification.classList.add('friendRequestElement');

    notification.innerHTML = `
      <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox" data-request="${request.id}">
        <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox__imgBox">
          <img src="./ressources/images/ace6549ae47649ed5ba46cc872320fba.jpg" alt="profile picture">
        </div>
        <p class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox__text">${request.receiver.name} a accepté votre demande d'ami.</p>
      </div>
    `
  
  } else if (direction === 'received' && requestType === 'traderequest' && request.status === 'PENDING') {
    notification.setAttribute('data-name', request.sender.name);

    notification.classList.add('tradeRequestElement');

    notification.innerHTML = `
      <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox" data-request="${request.id}">
        <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox__imgBox">
          <img src="./ressources/images/ace6549ae47649ed5ba46cc872320fba.jpg" alt="profile picture">
        </div>
        <p class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox__text" data-request="${request.id}" data-name="${request.sender.name}">${request.sender.name} vous a envoyé une demande d'échange !</p>
      </div>
      <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__btnBox">
        <button class="sliderBox__sliderContainer__notifBox__notifList__notifElement__btnBox seeTradeBtn" data-request="${request.id}" data-type="${requestType}">See</button>
        <button class="sliderBox__sliderContainer__notifBox__notifList__notifElement__btnBox refuseBtn" data-request="${request.id}" data-type="${requestType}"><i class="fa-solid fa-xmark"></i></button>
      </div>
    `
  } else if (direction === 'sent' && requestType === 'traderequest' && request.status === 'PENDING') {

    notification.classList.add('tradeRequestElement');

    notification.innerHTML = `
      <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox" data-request="${request.id}">
        <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox__imgBox">
          <img src="./ressources/images/ace6549ae47649ed5ba46cc872320fba.jpg" alt="profile picture">
        </div>
        <p class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox__text">Demande d'échange envoyée à ${request.receiver.name}.</p>
      </div>
      <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__btnBox">
        <button class="sliderBox__sliderContainer__notifBox__notifList__notifElement__btnBox cancelBtn" data-request="${request.id}" data-type="${requestType}">Cancel</button>
      </div>
    `
  } else if (direction === 'received' && requestType === 'traderequest' && request.status === 'ACCEPTED') {

    notification.classList.add('tradeRequestElement');

    notification.setAttribute('data-name', request.sender.name);

    notification.innerHTML = `
      <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox" data-request="${request.id}">
        <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox__imgBox">
          <img src="./ressources/images/ace6549ae47649ed5ba46cc872320fba.jpg" alt="profile picture">
        </div>
        <p class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox__text" data-request="${request.id}" data-name="${request.sender.name}">Vous avez accepté la demande d'échange de ${request.sender.name} !</p>
      </div>
    `
  } else if (direction === 'sent' && requestType === 'traderequest' && request.status === 'ACCEPTED') {

    notification.classList.add('tradeRequestElement');

    notification.innerHTML = `
      <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox" data-request="${request.id}">
        <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox__imgBox">
          <img src="./ressources/images/ace6549ae47649ed5ba46cc872320fba.jpg" alt="profile picture">
        </div>
        <p class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox__text">${request.receiver.name} a accepté votre demande d'échange.</p>
      </div>
    `
  }


  return notification;
}


function friendTemplate(friendData) {

  const friend = document.createElement('div');
  friend.classList.add('sliderBox__sliderContainer__friendBox__friendList__friendElement');
  friend.setAttribute('data-friend', friendData.id);

  if (friendData.sender) {
    friend.innerHTML = `
        <div class="sliderBox__sliderContainer__friendBox__friendList__friendElement__infosBox">
          <div class="sliderBox__sliderContainer__friendBox__friendList__friendElement__infosBox__imgBox">
            <img src="./ressources/images/ace6549ae47649ed5ba46cc872320fba.jpg" alt="profile picture">
          </div>
          <span class="sliderBox__sliderContainer__friendBox__friendList__friendElement__name" data-friend="${friendData.sender.id}">${friendData.sender.name}</span>
        </div>
        <div class="sliderBox__sliderContainer__friendBox__friendList__friendElement__btnBox">
          <button class="sliderBox__sliderContainer__friendBox__friendList__friendElement__btnBox tradeBtn" data-friend="${friendData.sender.id}" data-type="friendrequest">Trade</button>
          <button class="sliderBox__sliderContainer__friendBox__friendList__friendElement__btnBox removeBtn" data-friend="${friendData.id}" data-type="friendrequest">Remove</button>
        </div>
    `

  } else if (friendData.receiver) {
    friend.innerHTML = `
        <div class="sliderBox__sliderContainer__friendBox__friendList__friendElement__infosBox">
          <div class="sliderBox__sliderContainer__friendBox__friendList__friendElement__infosBox__imgBox">
            <img src="./ressources/images/ace6549ae47649ed5ba46cc872320fba.jpg" alt="profile picture">
          </div>
          <span class="sliderBox__sliderContainer__friendBox__friendList__friendElement__name" data-friend="${friendData.receiver.id}">${friendData.receiver.name}</span>
        </div>
        <div class="sliderBox__sliderContainer__friendBox__friendList__friendElement__btnBox">
          <button class="sliderBox__sliderContainer__friendBox__friendList__friendElement__btnBox tradeBtn" data-friend="${friendData.receiver.id}" data-type="friendrequest">Trade</button>
          <button class="sliderBox__sliderContainer__friendBox__friendList__friendElement__btnBox removeBtn" data-friend="${friendData.id}" data-type="friendrequest">Remove</button>
        </div>
    `
  }


  return friend;

}

function createSearchResult(user) {

  const result = document.createElement('div');
  result.classList.add('searchFriendContainer__resultsBox__resultElement');
  result.setAttribute('data-user', user.id);

  if (user.isFriend === "PENDING") {

    result.innerHTML = `
      <div class="searchFriendContainer__resultsBox__resultElement__infosBox">
        <div class="searchFriendContainer__resultsBox__resultElement__infosBox__imgBox">
          <img src="./ressources/images/ace6549ae47649ed5ba46cc872320fba.jpg" alt="profile picture">
        </div>
        <span class="searchFriendContainer__resultsBox__resultElement__name">${user.name}</span>
      </div>
      <span class="pendingMess">pending...</span>
      `

  } else if (user.isFriend === "RECEIVED") {
    result.innerHTML = `
      <div class="searchFriendContainer__resultsBox__resultElement__infosBox">
        <div class="searchFriendContainer__resultsBox__resultElement__infosBox__imgBox">
          <img src="./ressources/images/ace6549ae47649ed5ba46cc872320fba.jpg" alt="profile picture">
        </div>
        <span class="searchFriendContainer__resultsBox__resultElement__name">${user.name}</span>
      </div>
      <div class="searchFriendContainer__resultsBox__resultElement__btnBox">
        <button class="searchFriendContainer__resultsBox__resultElement__btnBox acceptBtn" data-request="${user.requestId}" data-user="${user.id}">Accept</button>
      </div>
    `
  } 
  
  else if (user.isFriend) {
    result.innerHTML = `
      <div class="searchFriendContainer__resultsBox__resultElement__infosBox">
        <div class="searchFriendContainer__resultsBox__resultElement__infosBox__imgBox">
          <img src="./ressources/images/ace6549ae47649ed5ba46cc872320fba.jpg" alt="profile picture">
        </div>
        <span class="searchFriendContainer__resultsBox__resultElement__name">${user.name}</span>
      </div>
      <i class="fa-solid fa-check addedIcon"></i>
      `
  } else {
    result.innerHTML = `
      <div class="searchFriendContainer__resultsBox__resultElement__infosBox">
        <div class="searchFriendContainer__resultsBox__resultElement__infosBox__imgBox">
          <img src="./ressources/images/ace6549ae47649ed5ba46cc872320fba.jpg" alt="profile picture">
        </div>
        <span class="searchFriendContainer__resultsBox__resultElement__name">${user.name}</span>
      </div>
      <div class="searchFriendContainer__resultsBox__resultElement__btnBox">
        <button class="searchFriendContainer__resultsBox__resultElement__btnBox addBtn" data-user="${user.id}" data-type="friendrequest" >Ask a friend</button>
      </div>
    `

  }
  
  return result;
}

function createNewCard(cardData, i) {

  console.log(cardData);

  const cardContainer = document.createElement('div');
  cardContainer.classList.add('boosterWindow__cardsBox__cardContainer');
  cardContainer.style.setProperty('--delay', i);
  const card = document.createElement('div');
  card.classList.add('boosterWindow__cardsBox__card');

  
  card.innerHTML = `
  <div class="boosterWindow__cardsBox__cardFront">
  <div class="boosterWindow__cardsBox__card__imageBox">
  <img src="${cardData.image}" alt="card image" draggable="false" oncontextmenu="return false">
  </div>
  <span class="boosterWindow__cardsBox__card__name">${cardData.name}</span>
  </div>
  <div class="boosterwindow__cardsBox__cardBack">
      <img src="./ressources/images/card_${cardData.house}.png" alt="card image" draggable="false" oncontextmenu="return false">
  </div>
  `
  
  card.addEventListener('click', () => {
      card.classList.add('show');
  })
  cardContainer.appendChild(card);
  
  return cardContainer;
}

function createCardCollection(cardData, i) {

  const cardElement = document.createElement('div');
  cardElement.classList.add('cardsBox__cardsContainer__card');

  const icon = cardData.favorite ? 'fa-solid' : 'fa-regular';

  cardElement.innerHTML = `
  <div class="cardsBox__cardsContainer__card__imgBox">
      <span class="cardsBox__cardsContainer__card__quantity" >x${cardData.quantity}</span>
      <span class="favBtn"><i class="${icon} fa-heart" data-id="${cardData.card.id}"></i></span>
      <img src="${cardData.card.image}" alt="" srcset="">
    </div>
    <div class="cardsBox__cardsContainer__card__textBox">
      <span class="cardsBox__cardsContainer__card__textBox__name">${cardData.card.name}</span>
    </div>
  `

  return cardElement;
}



function templateTradeInfosWindow(tradeData, cache) {

  const ownsCard = cache.find(card => card.card.id === tradeData.receivedCard.id);

  const tradeWindow = document.createElement('div');
  tradeWindow.classList.add('infosTradeBox');

  tradeWindow.innerHTML = `
    <div class="infosTradeBox__infosTradeContainer">
      <div class="infosTradeBox__infosTradeContainer__mainContent">
        <h3 class="infosTradeBox__infosTradeContainer__mainContent__title">Trade request from <span class="infosTradeBox__friendName">${tradeData.sender.name}</span></h3>
        <div class="infosTradeBox__infosTradeContainer__mainContent__tradeBox">
          <div class="infosTradeBox__infosTradeContainer__mainContent__tradeBox__giveBox">
            <span>You give</span>
            <div class="tradeElement">
              <span class="tradeElement__name">${tradeData.receivedCard.name}</span>
              <span class="tradeElement__number">x1</span>
            </div>
          </div>
          <div class="infosTradeBox__infosTradeContainer__mainContent__tradeBox__iconBox">
            <img src="./ressources/icons/tradeIcon.svg" alt="trade icon">
          </div>
          <div class="infosTradeBox__infosTradeContainer__mainContent__tradeBox__receiveBox">
            <span>You receive</span>
            <div class="tradeElement">
              <span class="tradeElement__name">${tradeData.giftedCard.name}</span>
              <span class="${ownsCard ? "tradeElement__number" : "tradeElement__number notOwned"}">${ownsCard ? "x1" : "x0"}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="infosTradeBox__infosTradeContainer__btnBox">
        <button class="acceptTradeRequest acceptBtn" data-type="traderequest" ${ownsCard ? "" : "disabled"} data-request="${tradeData.id}">Accept</button>
        <button class="declineTradeRequest refuseBtn" data-type="traderequest" data-request="${tradeData.id}">Decline</button>
      </div>
    </div>
  `

  return tradeWindow;
}