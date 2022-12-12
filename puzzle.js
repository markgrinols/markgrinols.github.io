import { loadPuzzle, selectWord, clearSelection } from './formatting.js'

const pointerDownOnPuzzleWords = (ev) => {
    ev.preventDefault() // trying to prevent double tap to zoom
    const el = ev.srcElement
    selectWord(el)
}

const span = document.querySelector('#draggable')
span.addEventListener('pointerdown', pointerDownOnPuzzleWords);

document.addEventListener('pointerdown', (ev) => {
    if(!ev.target.closest('#sentence')) {
        clearSelection()
    }
})

await loadPuzzle()

const box = document.querySelector('#box')
const menuarea = document.querySelector('#menuarea')
const marginTop = 0.8 * (box.offsetHeight - menuarea.offsetHeight) / 2 - sentence.offsetHeight / 2
sentence.style.setProperty('--margin-top', `${marginTop}px`)
