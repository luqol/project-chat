
const app = {

  getElements: function() {
    const thisApp = this;

    thisApp.dom = {};
    thisApp.dom.loginForm = document.querySelector('#welcome-form');
    thisApp.dom.messangesSection = document.querySelector('#messages-section');
    thisApp.dom.messagesList = document.querySelector('#messages-list');
    thisApp.dom.addMessageForm = document.querySelector('#add-messages-form');
    thisApp.dom.userNameInput = document.querySelector('#username');
    thisApp.dom.messageContentInput = document.querySelector('#message-content');

  },
  setUserName: function() {
    const thisApp = this;

    thisApp.userName = thisApp.dom.userNameInput.value;
  },

  getUsernName: function(){
    const thisApp = this;
    return thisApp.userName;
  },

  login: function(){
    const thisApp = this;

    if (thisApp.dom.userNameInput.value.trim().length === 0){
        alert("Login is empty");
      } else {
        thisApp.setUserName();
        thisApp.dom.loginForm.classList.remove('show');
        thisApp.dom.messangesSection.classList.add('show');
      }
  },

  sendMessange: function(){
    const thisApp = this;

    if (thisApp.dom.messageContentInput.value.trim().length === 0){
        alert('Messange is empty');
    } else {
        thisApp.addMessage(thisApp.getUsernName(), thisApp.dom.messageContentInput.value);
        thisApp.socket.emit('message', {author: thisApp.getUsernName(), content: thisApp.dom.messageContentInput.value });
        thisApp.dom.messageContentInput.value = '';
    }

  },

  addMessage: function(author, content){
    const thisApp = this;

    const messange = document.createElement('li');

    messange.classList.add('message', 'message--received');

    const authorElement = document.createElement('h3');

    authorElement.classList.add('message__author');

    if (author === thisApp.getUsernName()) {
        messange.classList.add('message--self');
        authorElement.innerText = 'You';
    } else {
        authorElement.innerText = author;
    }

    const contentElement = document.createElement('div');
    contentElement.classList.add('message__content');
    contentElement.innerText = content;

    messange.appendChild(authorElement);
    messange.appendChild(contentElement);

    thisApp.dom.messagesList.appendChild(messange);

  },

  initActions: function(){
    const thisApp = this;

    thisApp.dom.loginForm.addEventListener('submit', (e) => {
      e.preventDefault();

      thisApp.login();
    });

    thisApp.dom.addMessageForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.sendMessange();
    });

    thisApp.socket.on('message', ({ author, content }) => thisApp.addMessage(author, content));


  },

  init: function() {
    const thisApp = this;
    console.log('Chat app');
    thisApp.socket = io();

    thisApp.getElements();
    thisApp.initActions();

  },
};

app.init();