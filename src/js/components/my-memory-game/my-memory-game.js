/**
 * The my-memory-game web component module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.0.0
 */

import '../my-high-score'
import '../my-flipping-tile'

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
    box-sizing: border-box;
    width: 400px;
    height: 400px;
    background-color: #ddd4d4;
    padding: 20px;
    margin: 0;
    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    font-size: 16px;
  }

  .start, .board, .score {
    width: max-content;
    margin-left: 50%;
    margin-top: 50%;
    transform: translate(-50%, -50%);
  }

  fieldset {
    margin-bottom: 20px;
    padding: 15px;
    background-color: #f0ecec;
    border: dotted grey 2px;
    width: 250px;
  }

  legend {
    font-weight: bold;
  }

  label {
    display: block;
    margin-bottom: 10px;
    cursor: pointer;
  }

  label:last-child {
    margin-bottom: 0;
  }

  input[type=submit] {
    display: block;
    margin-left: 50%;
    transform: translateX(-50%);
  }

  .board {
      width: max-content;
      padding: 1rem;
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(4, max-content);
  }

  :host([data-board-size="small"]) .board {
    grid-template-columns: repeat(2, max-content);
  }

  my-flipping-tile::part(flippingTileBack) {
      background-image: url("${URLS[0]}");
  }

  .score {
    text-align: center;
  }

  span {
    font-weight: bold;
  }

  my-high-score {
    margin-bottom: 10px;  
  }   

  button {
    display: block; 
    margin-left: 50%;
    transform: translateX(-50%);
  }

  .hidden {
    display: none;
  }
</style>

<div id="container">
  <div class="start">
    <form>
    <fieldset>
        <legend>Nickname</legend>
        <input type="text" placeholder="Nickname" required>
      </fieldset>
      <fieldset>
        <legend>No of Tiles</legend>
        <label><input type="radio" name="tiles" value="small"> 4</label>
        <label><input type="radio" name="tiles" value="medium"> 8</label>
        <label><input type="radio" name="tiles" value="large" checked> 16</label>
      </fieldset>
      <input type="submit" value="Let's play">
    </form>
  </div>
  <div class="board hidden">
  </div>
  <div class="score hidden">
    <h3>Game finished! &#127881;</h3>
    <p>It took you <span></span> tries.</p>
    <div class="small hidden">
      <h4>High Score - 4 tiles</h4>
      <my-high-score storage-name="memory-game-small"></my-high-score>
    </div>
    <div class="medium hidden">
      <h4>High Score - 8 tiles</h4>
      <my-high-score storage-name="memory-game-medium"></my-high-score>
    </div>
    <div class="large hidden">
      <h4>High Score - 16 tiles</h4>
      <my-high-score storage-name="memory-game-large"></my-high-score>
    </div>
    <button>Play again</button>
  </div>
</div>
`

customElements.define('my-memory-game',
  /**
   * Represents a my-memory-game element.
   */
  class extends HTMLElement {
    /**
     * The size of the board.
     *
     * @type {string}
     */
    #boardSize

    /**
     * The number of tries the user has made to find mathing tiles.
     *
     * @type {number}
     */
    #count = 0

    /**
     * The start element.
     *
     * @type {HTMLDivElement}
     */
    #start

    /**
     * The board element.
     *
     * @type {HTMLDivElement}
     */
    #board

    /**
     * The score element.
     *
     * @type {HTMLDivElement}
     */
    #score

    /**
     * Creates an instance of the current type.
     */
    constructor () {
      super()

      // Attach a shadow DOM tree to this element and append the template to the shadow root.
      this.attachShadow({ mode: 'open' }).appendChild(template.content.cloneNode(true))

      // Get elements in the shadow root.
      this.#start = this.shadowRoot.querySelector('.start')
      this.#board = this.shadowRoot.querySelector('.board')
      this.#score = this.shadowRoot.querySelector('.score')

      // Add event listeners
      this.shadowRoot.querySelector('form').addEventListener('submit', event => {
        event.preventDefault()
        event.stopPropagation()
        this.#handleSubmit()
      })

      this.#board.addEventListener('flipTile', event => this.#handleFlipTile(event))

      this.shadowRoot.querySelector('button').addEventListener('click', event => {
        event.stopPropagation()
        this.#playAgain()
      })
    }

    /**
     * Attributes to monitor for changes.
     *
     * @returns {string[]} A string array of attributes to monitor.
     */
    static get observedAttributes () {
      return ['data-board-size']
    }

    /**
     * Called when observed attribute(s) changes.
     *
     * @param {string} name - The attribute's name.
     * @param {string} oldValue - The old attribute value.
     * @param {string} newValue - The new attribute value.
     */
    attributeChangedCallback (name, oldValue, newValue) {
      if (name === 'data-board-size' && newValue !== oldValue) {
        this.#boardSize = newValue
        this.#setUpBoard()
      }
    }

    /**
     * Called after the element is inserted into the DOM.
     */
    connectedCallback () {
      if (!this.hasAttribute('data-board-size')) {
        this.setAttribute('data-board-size', 'large')
      }

      this.shadowRoot.querySelector('input[type="text"]').focus()
    }

    /**
     * Handles the submit.
     */
    #handleSubmit () {
      const boardSize = this.shadowRoot.querySelector('input[type=radio]:checked').value
      this.setAttribute('data-board-size', boardSize)
      this.#switchDisplay(this.#start, this.#board)
    }

    /**
     * Sets up the game board with the accurate number of shuffled tiles.
     */
    #setUpBoard () {
      // Remove tiles if any.
      if (this.shadowRoot.querySelector('my-flipping-tile')) {
        this.#board.innerHTML = ''
      }

      // Get number of tiles.
      const noOfTiles = this.#getNoOfTiles()

      // Get an array of shuffled images.
      const shuffledImages = this.#getShuffledImages(noOfTiles)

      // Create tiles, add images to tiles, and add tiles to board.
      for (let i = 0; i < noOfTiles; i++) {
        const myFlippingTile = document.createElement('my-flipping-tile')
        const img = document.createElement('img')
        img.setAttribute('src', shuffledImages[i].href)
        myFlippingTile.appendChild(img)
        this.#board.appendChild(myFlippingTile)
      }
    }

    /**
     * Checks how many tiles that should be included in the game.
     *
     * @returns {number} The number of tiles.
     */
    #getNoOfTiles () {
      let noOfTiles

      switch (this.#boardSize) {
        case 'small':
          noOfTiles = 4
          break
        case 'medium':
          noOfTiles = 8
          break
        case 'large':
          noOfTiles = 16
          break
      }

      return noOfTiles
    }

    /**
     * Retrieves images for the tiles and shuffles them.
     *
     * @param {number} noOfTiles - The number of tiles.
     * @returns {object[]} The shuffled images, i.e. URL objects.
     */
    #getShuffledImages (noOfTiles) {
      // Get images.
      const tilePairs = noOfTiles / 2

      const singleImages = URLS.slice(1, (tilePairs + 1))

      // Double images.
      const doubleImages = []
      for (let i = 0; i < singleImages.length; i++) {
        doubleImages.push(singleImages[i])
        doubleImages.push(singleImages[i])
      }

      // Suffle images.
      let i = doubleImages.length
      let j
      let x

      while (i) {
        j = Math.floor(Math.random() * i)
        x = doubleImages[--i]
        doubleImages[i] = doubleImages[j]
        doubleImages[j] = x
      }

      return doubleImages
    }

    /**
     * Handles the flipTile event.
     *
     * @param {object} event - The dispatched event.
     */
    #handleFlipTile (event) {
      if (event.detail.dataUp) {
        event.target.setAttribute('data-disabled', '')

        const faceUpTiles = this.shadowRoot.querySelectorAll('my-flipping-tile[data-up]:not([data-hidden])')

        if (faceUpTiles.length === 2) {
          this.#count += 1

          // Disable all tiles.
          this.shadowRoot.querySelectorAll('my-flipping-tile').forEach(x => x.setAttribute('data-disabled', ''))

          // Remove attribute disabled from all tiles, and flipp them down, after some time.
          setTimeout(() => {
            // Check if the tiles are matching.
            if (faceUpTiles[0].isEqualNode(faceUpTiles[1])) {
              // Hide the matching tiles.
              faceUpTiles[0].setAttribute('data-hidden', '')
              faceUpTiles[1].setAttribute('data-hidden', '')

              this.dispatchEvent(new window.CustomEvent('tileMatch', { bubbles: true }))

              const tiles = Array.from(this.shadowRoot.querySelectorAll('my-flipping-tile'))

              if (tiles.every(x => x.hasAttribute('data-hidden'))) {
                this.dispatchEvent(new window.CustomEvent('gameFinished', { bubbles: true }))
                this.#presentScore()
              }
            } else {
              faceUpTiles.forEach(x => x.removeAttribute('data-up'))
              this.dispatchEvent(new window.CustomEvent('tileMismatch', { bubbles: true }))
            }

            this.shadowRoot.querySelectorAll('my-flipping-tile[data-disabled]').forEach(x => {
              x.removeAttribute('data-disabled')
            })
          }, 1500)
        }
      }
    }

    /**
     * Presents the user's score.
     */
    #presentScore () {
      this.#switchDisplay(this.#board, this.#score)
      this.shadowRoot.querySelector('span').innerText = this.#count

      const user = this.shadowRoot.querySelector('input[type="text"]').value

      this.shadowRoot.querySelector(`my-high-score[storage-name="memory-game-${this.#boardSize}"]`).saveResult({ user: user, score: this.#count })
    }

    /**
     * Switches the display between start view, game board and score presentation.
     *
     * @param {HTMLDivElement} hide - The element to hide.
     * @param {HTMLDivElement} show - The element to show.
     */
    #switchDisplay (hide, show) {
      hide.classList.toggle('hidden')
      show.classList.toggle('hidden')

      if (show === this.#start) {
        this.shadowRoot.querySelector('input[type="text"]').focus()
      } else if (show === this.#board) {
        this.shadowRoot.querySelector('my-flipping-tile').focus()
      } else {
        this.shadowRoot.querySelector('button').focus()
      }

      if (hide === this.#score || show === this.#score) {
        this.shadowRoot.querySelector(`.${this.#boardSize}`).classList.toggle('hidden')
      }
    }

    /**
     * Starts a new game round.
     */
    #playAgain () {
      this.#count = 0
      this.#switchDisplay(this.#score, this.#start)
      this.#setUpBoard()
    }
  }
)
