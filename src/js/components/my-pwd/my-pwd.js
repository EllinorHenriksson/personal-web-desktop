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
    #container {
        background: url("${URLS[0]}") center no-repeat;
        background-size: cover;
        width: 100vw;
        height: calc(100vh - 50px);
        margin: 0;
        padding: 0;
    }

    #memory-game {
        display: block;
        width: 500px;
        height: 500px;
    }

    #dock {
        width: 100vw;
        height: 50px;
        background-color: #0a437d;
    }

    #dock div {
        display: flex;
        align-items: center;
        height: 100%;
        gap: 10px;
    }

    img {
        height: 70%;
    }

    .hidden {
        display: none;
    }
</style>

<div id="container">
    <my-memory-game class="hidden"></my-memory-game>
    <my-chat class="hidden"></my-chat>
    <my-window data-height="400px" data-width="400px" data-name="Chat">
        <img slot="logo" src="${URLS[2]}" alt="app logo">
        <my-chat slot="app"></my-chat>
    </my-window>
</div>
<div id="dock">
    <div>
        <img src="${URLS[1]}" alt="memory logo">
        <img src="${URLS[2]}" alt="chat logo">
        <img src="${URLS[3]}" alt="custum logo">
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
    }
  }
)
