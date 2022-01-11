/**
 * The my-pwd web component module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.0.0
 */

import '../my-window'
import '../my-memory-game'
import '../my-chat'

import { templateMemoryGame, templateChat } from './my-pwd-template.js'

// Get URL to images.
const URLS = []

for (let i = 0; i <= 3; i++) {
  URLS.push(new URL(`./images/${i}.png`, import.meta.url))
}

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
    #container {
        width: 100vw;
        height: 100vh;
        overflow: hidden;
    }

    #desktop {
        background: url("${URLS[0]}") center no-repeat;
        background-size: cover;
        width: 100vw;
        height: calc(100vh - 50px);
        margin: 0;
        padding: 0;
    }

    my-window::part(window) {
      max-width: 100vw;
      max-height: calc(100vh - 50px);
    }

    #dock {
        width: 100vw;
        height: 50px;
        background-color: #0a437d;
        display: flex;
        align-items: center;
        gap: 10px;
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

<div id="container">
    <div id="desktop">
    </div>
    <div id="dock">
        <button id="one">
        <button id="two">
        <button id="three">
    </div>
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
        this.shadowRoot.querySelector('#desktop').appendChild(templateMemoryGame.content.cloneNode(true))
      } else if (event.target === this.shadowRoot.querySelector('#two')) {
        this.shadowRoot.querySelector('#desktop').appendChild(templateChat.content.cloneNode(true))
      } else if (event.target === this.shadowRoot.querySelector('#three')) {
        // KVAR ATT GÖRA
        console.log('Three')
      }
    }

    #handleCloseWindow (event) {
      this.shadowRoot.querySelector('#desktop').removeChild(event.target)
    }
  }
)
