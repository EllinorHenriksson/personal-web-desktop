/**
 * The my-window web component module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.0.0
 */

// Get URL to image.
const IMAGE = new URL('./images/0.png', import.meta.url)

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
    #container {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        width: calc(400px + 4px);
        height: calc(400px + 34px);
        border: 2px solid grey;
    }

    #top-bar {
        width: 100%;
        height: 30px;
        background-color: #ffffff;
        display: grid;
        grid-template-columns: 10% 80% 10%;
        grid-template-rows: 100%;
        align-items: center;
        cursor: move;
    }

    ::slotted(img) {
        height: 80%;
        margin-left: 2px;
    }

    #app-name {
      font-family: sans-serif;
      color: #292929;
    }

    button {
        height: 24px;
        width: 24px;
        background: url("${IMAGE}") center no-repeat;
        background-size: contain;
        background-color: none;
        border: none;
        border-radius: 5px;
        justify-self: right;
        margin-right: 2px;
        cursor: pointer;
    }

    button:focus {
        outline: none;
        border: 2px solid #0a437d;
    }

    #app-area {
        width: 100%;
        height: calc(100% - 30px);
        background-color: grey;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
    }

    ::slotted([name="app"]) {
        width: 100%;
        height: 100%;
    }
</style>

<div id="container" part="window">
    <div id="top-bar">
        <slot name="logo"></slot>
        <div id="app-name"></div>
        <button>
    </div>
    <div id="app-area">
    <slot name="app"></slot>
    </div>
</div>
`

customElements.define('my-window',
/**
 * Represents a my-window element.
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
      this.shadowRoot.querySelector('button').addEventListener('click', event => {
        event.stopPropagation()
        this.dispatchEvent(new window.CustomEvent('closeWindow', { bubbles: true }))
      })

      this.shadowRoot.querySelectorAll('#top-bar slot, #top-bar div, #app-area').forEach(x => x.addEventListener('mousedown', event => {
        event.stopPropagation()
        this.dispatchEvent(new window.CustomEvent('mousedownOnWindow', { bubbles: true }))
      }))

      this.shadowRoot.querySelectorAll('#top-bar slot, #top-bar div').forEach(x => x.addEventListener('mousedown', event => {
        this.dispatchEvent(new window.CustomEvent('mousedownOnTopBar', { detail: { mousedownEvent: event }, bubbles: true }))
      }))
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['data-width', 'data-height', 'data-name']
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {string} oldValue - The old attribute value.
     * @param {string} newValue - The new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'data-width' && newValue !== oldValue) {
        this.shadowRoot.querySelector('#container').style.width = `calc(${newValue} + 4px)`
      }

      if (name === 'data-height' && newValue !== oldValue) {
        this.shadowRoot.querySelector('#container').style.height = `calc(${newValue} + 34px)`
      }

      if (name === 'data-name' && newValue !== oldValue) {
        this.shadowRoot.querySelector('#app-name').innerText = newValue
      }
    }
  }
)
