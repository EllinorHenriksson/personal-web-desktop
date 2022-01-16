/**
 * The my-pwd web component module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.0.0
 */

import '../my-window'
import '../my-memory-game'
import '../my-chat'
import '../my-youtube-player'

import { templateMemoryGame, templateChat, templateYoutubePlayer } from './my-pwd-template.js'

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
        position: relative;
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
        margin-left: 5px;
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

    my-window {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
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
    #zIndex
    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and append the template to the shadow root.
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      this.#zIndex = 0

      // Add event listeners.
      this.shadowRoot.querySelectorAll('#dock button').forEach(x => x.addEventListener('click', event => {
        event.stopPropagation()
        this.#handleClick(event)
      }))

      this.shadowRoot.querySelector('#desktop').addEventListener('closeWindow', event => this.#handleCloseWindow(event))

      this.shadowRoot.querySelector('#desktop').addEventListener('mousedownOnTopBar', event => this.#handleMousedownOnTopBar(event))

      this.shadowRoot.querySelector('#desktop').addEventListener('mousedownOnWindow', event => this.#handleMousedownOnWindow(event))
    }

    #handleClick (event) {
      this.#zIndex += 10

      let template
      switch (event.target) {
        case this.shadowRoot.querySelector('#one'):
          template = templateMemoryGame
          break
        case this.shadowRoot.querySelector('#two'):
          template = templateChat
          break
        case this.shadowRoot.querySelector('#three'):
          template = templateYoutubePlayer
          break
      }

      const myWindow = template.content.cloneNode(true)
      this.shadowRoot.querySelector('#desktop').appendChild(myWindow)
      this.shadowRoot.querySelector('#desktop').lastElementChild.style.zIndex = this.#zIndex
    }

    #handleCloseWindow (event) {
      this.shadowRoot.querySelector('#desktop').removeChild(event.target)
    }

    #handleMousedownOnTopBar (event) {
      const clientX = event.detail.mousedownEvent.clientX
      const clientY = event.detail.mousedownEvent.clientY

      const myWindow = event.target
      const myWindowRect = myWindow.getBoundingClientRect()
      const desktop = this.shadowRoot.querySelector('#desktop')
      const desktopRec = desktop.getBoundingClientRect()

      const shiftX = clientX - myWindowRect.left
      const shiftY = clientY - myWindowRect.top

      myWindow.style.transform = 'none'

      moveMyWindow(clientX, clientY)

      function moveMyWindow (clientX, clientY) {
        if (clientX - shiftX > 0 && clientX - shiftX < desktopRec.width - myWindowRect.width) {
          myWindow.style.left = clientX - shiftX + 'px'
        }

        if (clientY - shiftY > 0 && clientY - shiftY < desktopRec.height - myWindowRect.height) {
          myWindow.style.top = clientY - shiftY + 'px'
        }
      }

      this.shadowRoot.querySelector('#desktop').addEventListener('mousemove', handleMousemove)

      function handleMousemove (event) {
        moveMyWindow(event.clientX, event.clientY)
      }

      this.addEventListener('mouseup', () => {
        this.shadowRoot.querySelector('#desktop').removeEventListener('mousemove', handleMousemove)
      })
    }

    #handleMousedownOnWindow (event) {
      this.#zIndex += 10
      event.target.style.zIndex = this.#zIndex
    }
  }
)
