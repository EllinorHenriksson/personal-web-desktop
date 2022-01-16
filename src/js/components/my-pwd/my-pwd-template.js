// Get URL to images.
const URLS = []

for (let i = 0; i <= 3; i++) {
  URLS.push(new URL(`./images/${i}.png`, import.meta.url))
}

// Define templates.

const templateMemoryGame = document.createElement('template')
templateMemoryGame.innerHTML = `
<my-window data-height="400px" data-width="400px" data-name="Memory Game" tabindex="0">
    <img slot="logo" src="${URLS[1]}" alt="app logo">
    <my-memory-game slot="app"></my-memory-game>
</my-window>
`

const templateChat = document.createElement('template')
templateChat.innerHTML = `
<my-window data-height="400px" data-width="400px" data-name="Chat" tabindex="0">
    <img slot="logo" src="${URLS[2]}" alt="app logo">
    <my-chat slot="app"></my-chat>
</my-window>
`

const templateYoutubePlayer = document.createElement('template')
templateYoutubePlayer.innerHTML = `
<my-window data-height="400px" data-width="600px" data-name="Youtube Player" tabindex="0">
    <img slot="logo" src="${URLS[3]}" alt="app logo">
    <my-youtube-player slot="app"></my-youtube-player>
</my-window>
`

export { templateMemoryGame, templateChat, templateYoutubePlayer }
