function notificationTemplate(request, type) {

  const notification = document.createElement('div');
  notification.classList.add('sliderBox__sliderContainer__notifBox__notifList__notifElement');
  notification.setAttribute('data-request', request.id);

  if (type === 'received' && request.status === 'PENDING') {
    
    notification.setAttribute('data-name', request.sender.name);

    notification.innerHTML = `
      <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox" data-request="${request.id}">
        <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox__imgBox">
          <img src="./ressources/images/ace6549ae47649ed5ba46cc872320fba.jpg" alt="profile picture">
        </div>
        <p class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox__text" data-request="${request.id}" data-name="${request.sender.name}">${request.sender.name} vous a envoyé une demande d'ami !</p>
      </div>
      <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__btnBox">
        <button class="sliderBox__sliderContainer__notifBox__notifList__notifElement__btnBox acceptBtn" data-request="${request.id}">Accept</button>
        <button class="sliderBox__sliderContainer__notifBox__notifList__notifElement__btnBox refuseBtn" data-request="${request.id}"><i class="fa-solid fa-xmark"></i></button>
      </div>
    `
  } else if (type === 'sent' && request.status === 'PENDING') {
    notification.innerHTML = `
      <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox" data-request="${request.id}">
        <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox__imgBox">
          <img src="./ressources/images/ace6549ae47649ed5ba46cc872320fba.jpg" alt="profile picture">
        </div>
        <p class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox__text">Demande d'ami envoyée à ${request.receiver.name}.</p>
      </div>
      <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__btnBox">
        <button class="sliderBox__sliderContainer__notifBox__notifList__notifElement__btnBox cancelBtn" data-request="${request.id}">Cancel</button>
      </div>
    `
  } else if (type === 'received' && request.status === 'ACCEPTED') {
    notification.setAttribute('data-name', request.sender.name);

    notification.innerHTML = `
      <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox" data-request="${request.id}">
        <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox__imgBox">
          <img src="./ressources/images/ace6549ae47649ed5ba46cc872320fba.jpg" alt="profile picture">
        </div>
        <p class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox__text" data-request="${request.id}" data-name="${request.sender.name}">Vous avez accepté la demande d'ami de ${request.sender.name} !</p>
      </div>
    `
  } else if (type === 'sent' && request.status === 'ACCEPTED') {
    notification.innerHTML = `
      <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox" data-request="${request.id}">
        <div class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox__imgBox">
          <img src="./ressources/images/ace6549ae47649ed5ba46cc872320fba.jpg" alt="profile picture">
        </div>
        <p class="sliderBox__sliderContainer__notifBox__notifList__notifElement__infosBox__text">${request.receiver.name} a accepté votre demande d'ami.</p>
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
          <button class="sliderBox__sliderContainer__friendBox__friendList__friendElement__btnBox tradeBtn" data-friend="${friendData.sender.id}">Trade</button>
          <button class="sliderBox__sliderContainer__friendBox__friendList__friendElement__btnBox removeBtn" data-friend="${friendData.id}">Remove</button>
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
          <button class="sliderBox__sliderContainer__friendBox__friendList__friendElement__btnBox tradeBtn" data-friend="${friendData.receiver.id}">Trade</button>
          <button class="sliderBox__sliderContainer__friendBox__friendList__friendElement__btnBox removeBtn" data-friend="${friendData.id}">Remove</button>
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
        <button class="searchFriendContainer__resultsBox__resultElement__btnBox addBtn" data-user="${user.id}">Ask a friend</button>
      </div>
    `

  }
  
  return result;
}


function createNewCard(cardData, i) {
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