/**
 * The my-chat web component module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.0.0
 */

// Import node module (npm package) for creating emoji picker.
import { EmojiButton } from '@joeattardi/emoji-button'

// Get URL to image.
const IMAGE = new URL('./images/smiley.png', import.meta.url)

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

  .username form {
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
    height: 20%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  #welcome p {
    margin: 0;
  }

  #welcome p:last-child {
    font-size: 0.8em;
  }

  #dialog {
    width: 100%;
    height: 55%;
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
    word-break: break-all;
  }

  #server p {
    margin: 0px 0px 5px 5px;
    font-size: 0.7em;
  }

  #chatbox {
    width: 100%;
    height: 25%;
    background-color: white;
  }

  #chatbox form {
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

  #chatbox textarea {
    grid-area: text-area;
    width: 95%;
    height: 80%;
  }

  #chatbox button[type="button"] {
    grid-area: smiley-button;
    width: 40px;
    height: 40px;
    cursor: pointer;
    background: url("${IMAGE}") center no-repeat;
    background-size: contain;
    background-color: none;
    border: none;
    border-radius: 5px;
    align-self: end;
  }

  #chatbox button[type="submit"] {
    grid-area: submit-button;
    align-self: start;
    margin-top: 5px;
  }

  .username input[type="text"], .username input[type="submit"], #chatbox textarea, #chatbox button[type="submit"] {
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    font-size: 1rem;
    border-radius: 5px;
    border: 1px solid grey;
    padding: 5px;
  }

  .username input[type="submit"], #chatbox button[type="submit"] {
    background-color: #eba505;
    color: #292929;
    cursor: pointer;
  }

  .hidden {
    display: none;
  }

  .unvisible {
    visibility: hidden;
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
      <p>Welcome <span></span>!<p>
      <p></p>
    </div>
    <div id="dialog" class="invisible">
    </div>
    <div id="chatbox" class="invisible">
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
     * The username.
     *
     * @type {string}
     */
    #username

    /**
     * The web socket connection.
     *
     * @type {WebSocket}
     */
    #socket

    /**
     * An emoji picker.
     *
     * @type {EmojiButton}
     */
    #picker

    /**
     * The element triggering the emoji picker.
     *
     * @type {HTMLButtonElement}
     */
    #trigger

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and append the template to the shadow root.
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      // Create reference to element that serves as a trigger for the emoji picker.
      this.#trigger = this.shadowRoot.querySelector('#chatbox button[type="button"]')

      // Add event listeners.
      this.shadowRoot.querySelector('.username form').addEventListener('submit', event => {
        event.stopPropagation()
        event.preventDefault()

        this.#handleUsernameSubmit()
      })

      this.shadowRoot.querySelector('#chatbox form').addEventListener('submit', event => {
        event.stopPropagation()
        event.preventDefault()

        this.#handleMessageSubmit()
      })
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      if (window.localStorage.getItem('chat-username')) {
        this.#username = window.localStorage.getItem('chat-username')
        this.#changeDisplay()
      } else {
        this.shadowRoot.querySelector('input[type="text"]').focus()
      }

      this.shadowRoot.querySelector('#welcome').lastElementChild.innerText = 'Connecting to server...'

      // Create web socket connection and add event listeners.
      this.#socket = new window.WebSocket('wss://courselab.lnu.se/message-app/socket')

      this.#socket.addEventListener('open', () => this.#handleOpen())
      this.#socket.addEventListener('message', (event) => this.#handleMessage(event))

      // Create emoji picker.
      this.#picker = new EmojiButton({ emojisPerRow: 6, rows: 3, position: 'top-end' })

      // Add event listener on the emoji picker through the EmojiButton method on(event, callback).
      this.#picker.on('emoji', selection => {
        this.shadowRoot.querySelector('textarea').value += selection.emoji
      })

      this.#trigger.addEventListener('click', event => {
        event.stopPropagation()

        this.#picker.togglePicker(this.#trigger)
      })
    }

    /**
     * Called after the element has been removed from the DOM.
     */
    disconnectedCallback () {
      this.#socket.close()

      // Destroy emoji picker and remove it from DOM.
      this.#picker.destroyPicker()
    }

    /**
     * Handles the username submit event.
     */
    #handleUsernameSubmit () {
      this.#username = this.shadowRoot.querySelector('input[type="text"]').value

      window.localStorage.setItem('chat-username', this.#username)

      this.#changeDisplay()
    }

    /**
     * Handles message submit events.
     */
    #handleMessageSubmit () {
      const message = this.shadowRoot.querySelector('#chatbox textarea').value

      const data = {
        type: 'message',
        data: message,
        username: this.#username,
        key: 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'
      }

      this.#socket.send(JSON.stringify(data))

      this.shadowRoot.querySelector('#chatbox textarea').value = ''
    }

    /**
     * Changes the display.
     */
    #changeDisplay () {
      this.shadowRoot.querySelector('.username').classList.toggle('hidden')
      this.shadowRoot.querySelector('.chat').classList.toggle('hidden')

      this.shadowRoot.querySelector('#welcome span').innerText = this.#username

      this.shadowRoot.querySelector('textarea').focus()
    }

    /**
     * Handles opening of the web socket connection.
     */
    #handleOpen () {
      this.shadowRoot.querySelector('#welcome').lastElementChild.innerText = 'Connected to server.'

      this.shadowRoot.querySelector('#dialog').classList.toggle('invisible')
      this.shadowRoot.querySelector('#chatbox').classList.toggle('invisible')
    }

    /**
     * Handles message events from web socket.
     *
     * @param {MessageEvent} event - The dispatched event.
     */
    #handleMessage (event) {
      const data = JSON.parse(event.data)

      if (data.type === 'message') {
        if (data.username !== this.#username) {
          const containingDiv = document.createElement('div')
          containingDiv.setAttribute('id', 'server')

          const p = document.createElement('p')
          p.innerText = data.username
          containingDiv.appendChild(p)

          const innerDiv = document.createElement('div')
          innerDiv.innerText = data.data
          containingDiv.appendChild(innerDiv)

          this.shadowRoot.querySelector('#dialog').appendChild(containingDiv)
        }

        if (data.username === this.#username) {
          const div = document.createElement('div')
          div.setAttribute('id', 'user')
          div.innerText = data.data
          this.shadowRoot.querySelector('#dialog').appendChild(div)
        }
      }
    }
  }
)
