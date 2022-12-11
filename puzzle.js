import { getRandomPuzzle as getNextPuzzle } from './puzzleManager.js'
import { setText, selectWord, clearSelection } from './formatting.js'

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

const sentence = document.querySelector('#sentence')
sentence.addEventListener('pointerdown', (ev) => {
    const x = ev.target.closest('#sentence')
    sentence.classList.add('completed')
    sentence.style.cssText += 'transition: margin-top 700ms ease-in-out;'; // no, seriously, fuck you
    sentence.addEventListener('transitionend', (ev) => {
        document.getElementById('attribution').classList.add('completed')
    }, { once: true })
});

setText(getNextPuzzle())

const box = document.querySelector('#box')
const menuarea = document.querySelector('#menuarea')
const marginTop = 0.8 * (box.offsetHeight - menuarea.offsetHeight) / 2 - sentence.offsetHeight / 2
sentence.style.setProperty('--margin-top', `${marginTop}px`)
