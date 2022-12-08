
const machine = createMachine({
    initialState: 'noSelection',
    noSelection: {
        actions: {
            onEnter() {
                refreshText()
                selectedWord = undefined
            }
        },
        transitions: {
            selectWord: {
                target: 'oneWordSelected',
                action(payload) {
                    selectWord(payload.elem)
                    selectedWord = payload.elem
                }
            }
        },
    },
    oneWordSelected: {
        actions: {
            onEnter() {
            },
            onExit() {
            },
        },
        transitions: {
            selectWord: {
                target: 'noSelection',
                action(payload) {
                    swapWords(selectedWord, payload.elem)
                },
            },
            clearSelection: {
                target: 'noSelection',
                action() {
                }
            },
        },
    },
})

const refreshText = () => {
    setCorrectSpaces(container)
    restoreCapitalization(container)
    setWordFormatting(container)
}

const pointerDownOnPuzzleWords = (ev) => {
    el = ev.srcElement
    if (el.classList.contains('wordIncorrect')) {
        state = machine.transition(state, "selectWord", { elem: el})
        ev.preventDefault() // trying to prevent double tap to zoom
    }
}

const swapWords = (a, b) => {
    if (a !== b) {
        console.log(`doVisualSwap ${a.textContent} -> ${b.textContent}`)
        swapElements(a, b)
    }
}

const getRandomPuzzle = () => {
    const puzzles = [
        "By all means, move at a glacial pace. You know how that thrills me.",
        "The way to get started is quit talking and begin doing.",
        "Don't judge each day by the harvest you reap but by the seeds that you plant.",
        "When you reach the end of your rope, tie a knot in it and hang on.",
        "By all means, move at a glacial pace. You know how that thrills me.",
        "Keep your friends close, but your enemies closer.",
        "Things fall apart; the centre cannot hold.",
        "I think that I shall never see a poem lovely as a tree.",
        "We few, we happy few, we band of brothers.",
        "My mother sacrificed her dreams so I could dream.",
        "Every time I travel I meet myself a little more.",
        // this might just be too long. If there are going to be lines of poetry i need to figure
        // out how to manage line breaks. I could consider it invisible punctuation in the code i guess.
        // but invisible would be confusing to people i think? unless there was a vertical separation.
        "And when wind and winter harden, all the loveless land, it will whisper of the garden, you will understand.",
        "The future belongs to those who believe in the beauty of their dreams.",
        "It is during our darkest moments that we must focus to see the light.",
        "In the end, it's not the years in your life that count. It's the life in your years.",
        "Life is either a daring adventure or nothing at all.",
        "The greatest glory in living lies not in never falling, but in rising every time we fall.",
        "Success is not final; failure is not fatal: It is the courage to continue that counts.",
        "I find that the harder I work, the more luck I seem to have.",
    ]

    return puzzles[Math.floor(Math.random() * puzzles.length)]
}

let selectedWord = undefined

const container = document.getElementById("draggable");
setText(container, getRandomPuzzle())
refreshText()

let state = machine.value
console.log(`current state: ${state}`)
