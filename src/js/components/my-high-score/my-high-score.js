/**
 * The my-high-score web component module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.0.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
    #container {
        background-color: #f8f8f8;
        width: 200px;
        border: 2px dotted #2c3a44;
    }

    #container div {
        border-bottom: 1px dotted #2c3a44;
        padding: 10px;
        margin: 0;
        text-align: left;
    }

    :host {
        display: inline-block;
    }
</style>

<div id="container">
</div>
`

customElements.define('my-high-score',
  /**
   * Represents a my-high-score element.
   */
  class extends HTMLElement {
    /**
     * The length of the list.
     *
     * @type {number}
     */
    #listLength

    /**
     * The name of the key in local web storage.
     *
     * @type {string}
     */
     #storageName

    /**
     * The container element.
     *
     * @type {HTMLDivElement}
     */
    #container

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      this.#container = this.shadowRoot.querySelector('#container')
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['list-length', 'storage-name']
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {string} oldValue - The old attribute value.
     * @param {string} newValue - The new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'list-length' && newValue !== oldValue) {
        this.#listLength = parseInt(newValue)
        this.#createList()
      }

      if (name === 'storage-name' && newValue !== oldValue) {
        this.#storageName = newValue
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      if (!this.hasAttribute('list-length')) {
        this.setAttribute('list-length', '5')
      }
      if (!this.hasAttribute('storage-name')) {
        this.setAttribute('storage-name', 'game-result')
      }
    }

    /**
     * Creates a high score list and updates it if there are any saved results.
     */
    #createList () {
      this.#container.innerHTML = ''

      for (let i = 0; i < this.#listLength; i++) {
        const div = document.createElement('div')
        div.setAttribute('id', `${i + 1}`)
        this.#container.appendChild(div)
      }

      if (window.localStorage.getItem(this.#storageName)) {
        this.#updateHighScore()
      }
    }

    /**
     * Saves the result of the current quiz round in the local web storage.
     *
     * @param {object} data - The player's nickname and score.
     */
    saveResult (data) {
      let result
      if (!window.localStorage.getItem(this.#storageName)) {
        result = [{ user: data.user, score: data.score }]
        window.localStorage.setItem(this.#storageName, JSON.stringify(result))
      } else {
        result = JSON.parse(window.localStorage.getItem(this.#storageName))
        result.push({ user: data.user, score: data.score })
        window.localStorage.setItem(this.#storageName, JSON.stringify(result))
      }

      this.#updateHighScore()
    }

    /**
     * Updates the high score list so that it presents the five fastest players.
     */
    #updateHighScore () {
      const divs = this.#container.children

      for (let i = 0; i < divs.length; i++) {
        divs[i].textContent = `${i + 1}. `
      }

      const result = JSON.parse(window.localStorage.getItem(this.#storageName))
      result.sort((a, b) => a.score - b.score)

      if (result.length <= this.#listLength) {
        for (let i = 0; i < result.length; i++) {
          this.shadowRoot.getElementById(`${i + 1}`).textContent += `${result[i].user} (${result[i].score})`
        }
      } else {
        const topResult = result.slice(0, this.#listLength)

        for (let i = 0; i < topResult.length; i++) {
          this.shadowRoot.getElementById(`${i + 1}`).textContent += `${topResult[i].user} (${topResult[i].score})`
        }
      }
    }
  }
)
