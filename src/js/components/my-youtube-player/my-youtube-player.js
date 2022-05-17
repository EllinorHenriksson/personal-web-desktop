/**
 * The my-youtube-player web component module.
 *
 * @author Ellinor Henriksson <eh224kr@student.lnu.se>
 * @version 1.0.0
 */

// Define template.
const template = document.createElement('template')
template.innerHTML = `
<style>
    #container {
        width: 600px;
        height: 400px;
        font-family: sans-serif;
        font-size: 16px;
    }

    #stage {
        width: 100%;
        height: 85%;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: red;
        background: linear-gradient(to bottom right, red, white)
    }

    iframe {
        width: 480px;
        height: 270px;
    }

    #toolbar {
        width: 100%;
        height: 15%;
        background-color: #C5C3C3;
        box-shadow: 0 -5px 5px grey;
    }

    form {
        width: 100%;
        height: 100%;
        display: grid;
        grid-template-columns: repeat(4, auto);
    }

    form div {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    input[type="text"], input[type="submit"] {
        font-family: sans-serif;
        font-size: 16px;
        border-radius: 5px;
        border: white solid 1px;
        padding: 5px;
    }

    input[type="submit"] {
        cursor: pointer;
        background-color: white;
        background: linear-gradient(#F67373, #D00A0A);
        border: #A50707 solid 1px;
        color: white;
        text-shadow: 0px 2px 0px #810303;
        font-weight: bold;
    }

    input[type="submit"]:hover {
        transform: scale(1.1);
    }
</style>

<div id="container">
    <div id="stage">
        <iframe src="https://www.youtube.com/embed/jxi0ETwDvws?autoplay=0&controls=0" title="youtube video"></iframe>
    </div>
    <div id="toolbar">
        <form>
            <div>
                <label>Youtube ID <input type="text" value="jxi0ETwDvws" required id="ID"></label>
            </div>
            <div>
                <label>Autoplay <input type="checkbox" id="autoplay"></label>
            </div>
            <div>
                <label>Show controls <input type="checkbox" id="controls"></label>
            </div>
            <div>
                <input type="submit" value="Select">
            </div>
        </form>
    </div>
</div>
`
customElements.define('my-youtube-player',
/**
 * Represents a my-youtube-player element.
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
      this.shadowRoot.querySelector('form').addEventListener('submit', event => {
        event.preventDefault()
        event.stopPropagation()

        this.#handleSubmit()
      })

      this.shadowRoot.querySelector('#ID').focus()
    }

    /**
     * Handles the submit event.
     */
    #handleSubmit () {
      let url = 'https://www.youtube.com/embed/' + this.shadowRoot.querySelector('#ID').value + '?'

      const params = new URLSearchParams()

      if (this.shadowRoot.querySelector('#autoplay').checked) {
        params.append('autoplay', '1')
        params.append('mute', '1')
      } else {
        params.append('autoplay', '0')
      }

      if (this.shadowRoot.querySelector('#controls').checked) {
        params.append('controls', '1')
      } else {
        params.append('controls', '0')
      }

      url += params.toString()

      this.shadowRoot.querySelector('iframe').setAttribute('src', url)

      this.shadowRoot.querySelector('#ID').focus()
    }
  }
)
