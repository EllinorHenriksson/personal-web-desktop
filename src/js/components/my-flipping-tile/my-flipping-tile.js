/**
 * The my-flipping-tile web component module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.0.0
 */

// Get URL to lnu-symbol.png
const url = new URL('./images/lnu-symbol.png', import.meta.url)

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
    #tile {
      width: 100px;
      height: 100px;
      border-radius: 20px;
      background-color: white;
      border: solid grey 2px;
      cursor: pointer;
      position: relative;
      transition: 1s;
      transform-style: preserve-3d;
    }

    #tile:focus {
      outline: none;
      box-shadow: 0 0 20px black;
    }

    :host([data-up]) #tile {
      transform: rotateY(180deg);
    }

    #front, #back {
      width: calc(100% - 6px);
      height: calc(100% - 6px);
      margin: 3px;
      border-radius: 20px;
      background-position: center;
      background-size: 60%;
      background-repeat: no-repeat;
      position: absolute;
      top: 0;
      left: 0;
      backface-visibility: hidden;
    }

    #front {
      background-color: white;
      transform: rotateY(180deg);
    }

    #back {
      background-color: yellow;
      background-image: url("${url}");
    }

    :host([data-disabled]) #tile {
      border: dotted grey 2px;
      cursor: default;
      pointer-events: none;
    }

    :host([data-hidden]) #tile {
      background-color: #ffffff00;
      border: solid grey 1px;
      cursor: default;
      pointer-events: none;
    }

    :host([data-hidden]) #tile>* {
      visibility: hidden;
    }

    slot {
      display: flex;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
    }

    ::slotted(*) {
      max-width: 70%;
      max-height: 70%;
    }
</style>

<button id="tile">
  <div id="front" part="flippingTileFront">
    <slot></slot>
  </div>
  <div id="back" part="flippingTileBack"></div>
</button>
`

customElements.define('my-flipping-tile',
  /**
   * Represents a my-flipping-tile element.
   */
  class extends HTMLElement {
    /**
     * The button element.
     *
     * @type {HTMLButtonElement}
     */
    #button

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and append the template to the shadow root.
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      // Gets the button element
      this.#button = this.shadowRoot.querySelector('button')

      // Listen to click events.
      this.addEventListener('click', () => {
        if (!this.hasAttribute('data-disabled') && !this.hasAttribute('data-hidden')) {
          // Checks if attributes are set, and sets or removes them.
          this.hasAttribute('data-up') ? this.removeAttribute('data-up') : this.setAttribute('data-up', '')
          // Dispatches a custom event
          this.dispatchEvent(new window.CustomEvent('flipTile', { detail: { dataUp: this.hasAttribute('data-up') }, bubbles: true }))
        }
      })
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['data-disabled', 'data-hidden']
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {string} oldValue - The old attribute value.
     * @param {string} newValue - The new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'data-disabled' && this.hasAttribute('data-disabled')) {
        this.#button.setAttribute('disabled', '')
      }

      if (name === 'data-hidden' && this.hasAttribute('data-hidden')) {
        this.#button.setAttribute('disabled', '')
      }

      if (name === 'data-disabled' && !this.hasAttribute('data-disabled') && !this.hasAttribute('data-hidden')) {
        this.#button.removeAttribute('disabled', '')
      }

      if (name === 'data-hidden' && !this.hasAttribute('data-hidden')) {
        this.#button.removeAttribute('disabled', '')
      }
    }

    /**
     * Sets focus on the button element.
     */
    focus () {
      this.#button.focus()
    }
  }
)
