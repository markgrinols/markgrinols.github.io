import { getRandomPuzzle as getNextPuzzle } from './puzzleManager.js'
import { setText, selectWord } from './formatting.js'

const pointerDownOnPuzzleWords = (ev) => {
    ev.preventDefault() // trying to prevent double tap to zoom
    const el = ev.srcElement
    selectWord(el)
}

const span = document.querySelector('#draggable')
span.addEventListener('pointerdown', pointerDownOnPuzzleWords);

setText(getNextPuzzle())
