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
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    font-size: 16px;
  }

  .username {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 1fr 1fr;
    grid-template-areas: 
    "text"
    "form";
    justify-items: center;
  }

  .username p {
    grid-area: text;
    text-align: center;
    align-self: end;
  }

  .user-name form {
    grid-area: form;
  }

  .username input[type="text"] {
    display: block;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    padding: 5px;
    border-radius: 5px;
    border: 1px solid grey;
    background-color: white;
  }

  .username input[type="submit"] {
    display: block;
    margin-left: 50%;
    transform: translateX(-50%);
    margin-top: 10px;
    width: 40px;
    height: 30px;
  }

  .chat {
    width: 100%;
    height: 100%;
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
    align-self: start;
    margin-top: 5px;
  }

  .username input[type="text"], .username input[type="submit"], #chat-box textarea, #chat-box button[type="submit"] {
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    font-size: 1rem;
    border-radius: 5px;
    border: 1px solid grey;
    padding: 5px;
  }

  .username input[type="submit"], #chat-box button[type="submit"] {
    background-color: #eba505;
    color: #292929;
    cursor: pointer;
  }

  .hidden {
    display: none;
  }

</style>

<div id="container">
  <div class="username">
    <p>Welcome to the course chat! <br>Please write your username:</p>
    <form>
      <input type="text" placeholder="Username" required>
      <input type="submit" value="OK">
    </form>
  </div>
  <div class="chat hidden">
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

      // Attach event listeners.
      this.shadowRoot.querySelector('.username form').addEventListener('submit', event => {
        event.stopPropagation()
        event.preventDefault()

        this.#handleSubmit(event)
      })
    }

    connectedCallback () {
      // Kolla om det finns ett användarnamn sparat i datorn
    }

    #handleSubmit (event) {
      const username = this.shadowRoot.querySelector('input[type="text"]').value

      this.shadowRoot.querySelector('.username').classList.toggle('hidden')
      this.shadowRoot.querySelector('.chat').classList.toggle('hidden')
    }
  }
)
