export default class Game {
    constructor(typingDom) {
        this.dom = typingDom
        this.#setupKeyListeners()
        return
    }

    #setupKeyListeners() {
        window.addEventListener('keydown', (event) => {
            this.dom.textContent = `${event.key}`
        })
    }
}