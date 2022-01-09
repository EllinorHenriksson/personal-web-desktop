/**
 * The my-window web component module.
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
    /*
    #container {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        /* Attribut */
        width: calc(400px + 4px);
        /* Attribut */
        height: calc(400px + 34px);
        border: 2px solid grey;
    }
    */

    #container {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        border: 2px solid grey;
    }

    #top-bar {
        width: 100%;
        height: 30px;
        background-color: #ffffff;
        display: grid;
        grid-template-columns: 10% 80% 10%;
        grid-template-areas: "app-logo text cross-icon";
        align-items: center;
    }

    ::slotted(img) {
        height: 80%;
        grid-area: app-logo;
        justify-self: center;
    }

    button {
        height: 24px;
        width: 24px;
        background: url("${URLS[1]}") center no-repeat;
        background-size: contain;
        background-color: none;
        border: none;
        border-radius: 5px;
        grid-area: cross-icon;
        justify-self: center;
        cursor: pointer;
    }

    button:focus {
        outline: none;
        border: 2px solid #0a437d;
    }

    #top-bar div {
        color: #292929;
        width: max-content;
        font-family: sans-serif;
    }

    #window {
        margin: 0;
        padding: 0;
        /* Attribut */
        width: 400px;
        /* Attribut */
        height: 400px;
        max-width: calc(100% - 4px);
        max-height: calc(100% - 34px);
        overflow: auto;
    }
</style>

<div id="container">
    <div id="top-bar">
        <!-- Slotta in loggan här -->
        <slot name="logo"></slot>
        <!-- Attribut -->
        <div id="app-name"></div>
        <button>
    </div>
    <!-- Slotta in appen här -->
    <div id="window">
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

      // Add event listener for 'click', dispatch custum event that bubbles
      // FORTSÄTT HÄR!!!
      this.shadowRoot.querySelector('button').addEventListener('click', event => {
        event.stopPropagation()
        this.dispatchEvent(new window.CustomEvent('closeWindow', { bubbles: true }))
      })
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
        //this.shadowRoot.querySelector('#container').style.width = `calc(${newValue} + 4px)`
        this.shadowRoot.querySelector('#window').style.width = newValue
      }

      if (name === 'data-height' && newValue !== oldValue) {
        //this.shadowRoot.querySelector('#container').style.height = `calc(${newValue} + 34px)`
        this.shadowRoot.querySelector('#window').style.height = newValue
      }

      if (name === 'data-name' && newValue !== oldValue) {
        this.shadowRoot.querySelector('#app-name').innerText = newValue
      }
    }
  }
)
