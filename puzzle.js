
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
//    restoreCapitalization(container)
  //  setWordFormatting(container)
}

const pointerDownOnPuzzleWords = (ev) => {
    el = ev.srcElement
    // todo: filter out clicks on punctuation, or on fixed words
    state = machine.transition(state, "selectWord", { elem: el})
}

const swapWords = (a, b) => {
    if (a !== b) {
        console.log(`doVisualSwap ${a.innerText} -> ${b.innerText}`)
        // swapNodes(a, b)
        swapElements(a, b)
    }
}

let selectedWord = undefined

const container = document.getElementById("draggable");
setText(container, "by all means, move at a glacial pace. You know how God thrills me.")
refreshText()

let state = machine.value
console.log(`current state: ${state}`)
