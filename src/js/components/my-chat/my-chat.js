/**
 * The my-chat web component module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.0.0
 */

// Get URL to images.
const URLS = []

for (let i = 0; i <= 8; i++) {
  URLS.push(new URL(`./images/${i}.png`, import.meta.url))
}

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>

  #container {
    background-color: #edcc80;
    width: 400px;
    height: 400px;
    border: 2px solid grey;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    font-size: 16px;
  }

  #top-bar {
    width: 100%;
    height: 30px;
    background-color: #ffffff;
    display: grid;
    grid-template-columns: 10% 80% 10%;
    grid-template-areas: "chat-logo text cross-icon";
    align-items: center;
  }

  #top-bar img[alt="chat logo"] {
    height: 80%;
    grid-area: chat-logo;
    justify-self: center;
  }

  #top-bar img[alt="cross icon"] {
    height: 80%;
    grid-area: cross-icon;
    justify-self: center;
    cursor: pointer;
  }

  #top-bar div {
    color: #292929;
    width: max-content;
    margin-left: 10px;
  }

  .user-name {
    width: 100%;
    height: calc(100% - 30px);
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-areas: 
    "text"
    "form";
    justify-items: center;
  }

  .user-name p {
    grid-area: text;
    text-align: center;
    align-self: end;
  }

  .user-name form {
    grid-area: form;
  }

  .user-name input[type="text"] {
    display: block;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid grey;
    background-color: white;
  }

  .user-name input[type="submit"] {
    display: block;
    margin-left: 50%;
    transform: translateX(-50%);
    margin-top: 10px;
    width: 40px;
    height: 30px;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    border-radius: 5px;
    border: 1px solid grey;
    background-color: #eba505;
    color: #292929;
    cursor: pointer;
  }

  .user-name input[type="text"]:focus, .user-name input[type="submit"]:focus, #chat-box textarea:focus, #chat-box button[type="submit"]:focus,  #chat-box button[type="button"]:focus {
    outline: none;
    border: 2px solid #0a437d;
  }

  .chat {
    width: 100%;
    height: calc(100% - 30px);
  }

  #welcome {
    width: 100%;
    height: 15%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  #welcome p {
    margin: 0;
  }

  #dialog {
    width: 100%;
    height: 60%;
    display: grid;
    overflow: auto;
  }

  #user {
    justify-self: end;
  }

  #server div, #user {
    width: 200px;
    height: max-content;
    background-color: white;
    padding: 5px;
    margin: 10px;
    margin-top: 0;
    border-radius: 5px;
    font-size: 0.8em;
  }

  #server p {
    margin: 0px 0px 5px 5px;
    font-size: 0.7em;
  }

  #chat-box {
    width: 100%;
    height: 25%;
    background-color: white;
  }

  #chat-box form {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 80% 20%;
    grid-template-rows: 50% 50%;
    grid-template-areas:
    "text-area smiley-button"
    "text-area submit-button";
    justify-items: center;
    align-items: center;
  }

  #chat-box textarea {
    grid-area: text-area;
    width: 95%;
    height: 80%;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    border-radius: 5px;
    border: 1px solid grey;
    padding: 5px;
  }

  #chat-box button[type="button"] {
    grid-area: smiley-button;
    width: 40px;
    height: 40px;
    cursor: pointer;
    background: url("${URLS[3]}") center no-repeat;
    background-size: contain;
    background-color: none;
    border: none;
    border-radius: 5px;
    align-self: end;
  }

  #chat-box button[type="submit"] {
    grid-area: submit-button;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    font-size: 1rem;
    border-radius: 5px;
    border: 1px solid grey;
    background-color: #eba505;
    color: #292929;
    padding: 5px;
    cursor: pointer;
    align-self: start;
    margin-top: 5px;
  }

  .hidden {
    display: none;
  }

</style>

<div id="container">
  <div id="top-bar">
    <img src="${URLS[0]}" alt="chat logo">
    <div>Chat</div>
    <img src="${URLS[1]}" alt="cross icon">
  </div>
  <div class="user-name hidden">
    <p>Welcome to the course chat! <br>Please write your username:</p>
    <form>
      <input type="text" placeholder="Username">
      <input type="submit" value="OK">
    </form>
  </div>
  <div class="chat">
    <div id="welcome">
      <p>Welcome <span>Ellinor</span>!<p>
    </div>
    <div id="dialog">
      <div id="server">
        <p>Other user</p>
        <div>Hi from server!</div>
      </div>
      <div id="user">Hi from user!</div>
      <div id="server">
        <p>Other user</p>
        <div>Hi from server!</div>
      </div>
      <div id="server">
        <p>Other user</p>
        <div>Hi from server!</div>
      </div>
      <div id="user">Hi from user!</div>
      <div id="server">
        <p>Other user</p>
        <div>Hi from server!</div>
      </div>
    </div>
    <div id="chat-box">
      <form>
        <textarea placeholder="Write a message..."></textarea>
        <button type="button">
        <button type="submit">Send</button>
      </form>
    </div>
  </div>
</div>
`

customElements.define('my-chat',
/**
 * Represents a my-chat element.
 */
  class extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and append the template to the shadow root.
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))
    }
  }
)
