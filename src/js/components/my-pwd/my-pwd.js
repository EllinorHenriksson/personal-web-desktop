/**
 * The my-pwd web component module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.0.0
 */

import '../my-window'
import '../my-memory-game'
import '../my-chat'

// Get URL to images.
const URLS = []

for (let i = 0; i <= 8; i++) {
  URLS.push(new URL(`./images/${i}.png`, import.meta.url))
}

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
    #desktop {
        background: url("${URLS[0]}") center no-repeat;
        background-size: cover;
        width: 100vw;
        height: calc(100vh - 50px);
        margin: 0;
        padding: 0;
    }

    #dock {
        width: 100vw;
        height: 50px;
        background-color: #0a437d;
        display: flex;
        align-items: center;
        gap: 10px;
    }

    /* Fortsätt här */
    my-window {
        display: block;
        margin: 0;
        padding: 0;
        width: max-content;
        height: max-content;
        max-width: 100vw;
        max-height: calc(100vh - 50px);
        background-color: red;
    }

    button#one {
        background: url("${URLS[1]}") center no-repeat;
    }

    button#two {
        background: url("${URLS[2]}") center no-repeat;
    }

    button#three {
        background: url("${URLS[3]}") center no-repeat;
    } 

    button#one, button#two, button#three {
        width: 40px;
        height: 40px;
        background-size: contain;
        border: none;
        border-radius: 5px;
        cursor: pointer;
    }

    #dock button:focus {
        outline: none;
        border: 2px solid white;
    }

    .hidden {
        display: none;
    }
</style>

<div id="desktop">
</div>

<div class="memory-template hidden">
    <my-window data-height="500px" data-width="500px" data-name="Memory game">
        <img slot="logo" src="${URLS[1]}" alt="app logo">
        <my-memory-game slot="app"></my-memory-game>
    </my-window>
</div>

<div class="chat-template hidden">
    <my-window data-height="400px" data-width="400px" data-name="Chat">
        <img slot="logo" src="${URLS[2]}" alt="app logo">
        <my-chat slot="app"></my-chat>
    </my-window>
</div>

<!-- Skapa mall för custum app -->

<div id="dock">
    <button id="one">
    <button id="two">
    <button id="three">
</div>
`

customElements.define('my-pwd',
  /**
   * Represents a my-pwd element.
   */
  class extends HTMLElement {
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and append the template to the shadow root.
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      // Add event listeners.
      this.shadowRoot.querySelectorAll('button').forEach(x => x.addEventListener('click', event => {
        event.stopPropagation()
        this.#handleClick(event)
      }))

      this.shadowRoot.querySelector('#desktop').addEventListener('closeWindow', event => this.#handleCloseWindow(event))
    }

    #handleClick (event) {
      if (event.target === this.shadowRoot.querySelector('#one')) {
        console.log('One')
        const myWindow = this.shadowRoot.querySelector('.memory-template my-window').cloneNode(true)
        this.shadowRoot.querySelector('#desktop').appendChild(myWindow)
      } else if (event.target === this.shadowRoot.querySelector('#two')) {
        console.log('Two')
      } else if (event.target === this.shadowRoot.querySelector('#three')) {
        console.log('Three')
      }
    }

    #handleCloseWindow (event) {
      this.shadowRoot.querySelector('#desktop').removeChild(event.target)
    }
  }
)
