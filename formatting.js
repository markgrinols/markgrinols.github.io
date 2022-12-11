import * as puzzleData from './puzzleData.mjs'

const container = document.getElementById("draggable")
let wordsToSwap = []
let flatWordElems = []
let isSwapping = false
let firstSelectedWord = null

// todo: rename this file

async function loadPuzzle() {
    await puzzleData.load()
    buildDomTree(puzzleData.wordList)
    refreshTextPresentation()
    setupAttribution(puzzleData.attribution)
}

function buildDomTree(words) {
    // due to linebreaking behavior for inline-block elements, the
    // tree structure is funky. When there is punctuation,
    // the previous word and the punctuation character(s) are
    // parented to an intermediate span with 'nowrap' style.
    // these wrapper spans are siblings to the regular word spans.
    container.replaceChildren()
    for (let i = words.length - 1; i >= 0; i--) {
        let txtContent = words[i]
        let noWrapSpan = null
        if (puzzleData.isPunctuation(txtContent)) {
            noWrapSpan = document.createElement('span')
            noWrapSpan.classList.add('nowrap')
            while (puzzleData.isPunctuation(txtContent)) {
                const puncSpan = document.createElement('span')
                puncSpan.classList.add('punctuation')
                puncSpan.appendChild(document.createTextNode(txtContent))
                noWrapSpan.appendChild(puncSpan)
                i--
                txtContent = words[i]
            }
        }

        const wordSpan = document.createElement('span')
        wordSpan.classList.add('word')
        wordSpan.prepend(document.createTextNode(txtContent))

        if (noWrapSpan) {
            noWrapSpan.prepend(wordSpan)
            container.prepend(noWrapSpan)
        }
        else {
            container.prepend(wordSpan)
        }
    }

    updateFlatElemList()
}

function setupAttribution(attribution) {
    const attrib = document.querySelector('#attribution')
    for(let line of puzzleData.attribution) {
        const div = document.createElement('div')
        div.innerHTML = line
        attrib.append(div)
    }
}

function updateFlatElemList() {
    flatWordElems = getDescendantElements(container).filter((e) => !e.classList.contains('nowrap'))
}

function refreshTextPresentation() {
    setCorrectSpaces()
    restoreCapitalization()
    setWordFormatting()
}

function setCorrectSpaces() {
    for(let el of flatWordElems) {
        el.style.marginRight = '0px'
    }

    for (let el of container.children) {
        if (el.classList.contains('nowrap') || el.classList.contains('word')) {
            el.style.marginRight = '20px'
        }
    }
}

function restoreCapitalization() {
    // if word is first word or after a period, or is capitlized in likelyProperNameMap
    // make capital, else don't.
    for(let i = 0; i < flatWordElems.length; i++) {
        const el = flatWordElems[i]
        const text = el.textContent?.trim()
        const isFirst = i == 0
        const isAfterPeriod = flatWordElems[i - 1]?.classList.contains('punctuation') &&
        flatWordElems[i - 1].textContent === '.'
        const isProperName = puzzleData.requiresCapitalization(text.toLowerCase())
        const capitalizeIt = isFirst || isAfterPeriod || isProperName
        let firstLetter = text[0]
        firstLetter = capitalizeIt ? firstLetter.toUpperCase() : firstLetter.toLowerCase()
        el.textContent = firstLetter + text.slice(1)
    }
}

function setWordFormatting() {
    let prevIsCorrect = false
    for(let i = 0; i < flatWordElems.length; i++) {
        const child = flatWordElems[i]
        const text = child.textContent?.trim()

        let isCorrect = false
        if (i > 0 && child.classList.contains('punctuation')) {
            isCorrect = prevIsCorrect // adopt formatting of previous word
        }
        else {
            const wordIndex = flatWordElems.indexOf(child)
            const spanText = child.textContent.trim().toLowerCase()
            isCorrect = puzzleData.isInCorrectLocation(spanText, wordIndex)
        }

        child.classList.remove('correct', 'incorrect', 'wordSelected')
        child.classList.add(isCorrect ? 'correct' : 'incorrect')
        prevIsCorrect = isCorrect
    }
}

function swapWords(a, b) {
    if (a === b) return
    isSwapping = true
    if (flatWordElems.indexOf(a) > flatWordElems.indexOf(b)) {
        // hack: if b is before a in the dom, after the
        // transition, b re-animates right to left
        const tmp = a
        a = b
        b = tmp
    }

    wordsToSwap = [a, b]
    const posA = getPositionRelativeToContainer(a)
    const posB = getPositionRelativeToContainer(b)

    let transLeftA = posB.centerX - posA.centerX
    let transTopA = posB.centerY - posA.centerY
    let transLeftB = posA.centerX - posB.centerX
    let transTopB = posA.centerY - posB.centerY

    if (posA.top === posB.top) {
        const shiftAmount = (posB.width - posA.width) / 2
        transLeftA += shiftAmount
        transLeftB += shiftAmount
    }
    else {
        transLeftA += (posA.width - posB.width) / 2
        transLeftB += (posB.width - posA.width) / 2
    }

    a.style.setProperty('--transLeft', `${transLeftA}px`)
    a.style.setProperty('--transTop', `${transTopA}px`)
    b.style.setProperty('--transLeft', `${transLeftB}px`)
    b.style.setProperty('--transTop', `${transTopB}px`)

    a.addEventListener('transitionend', endSwapTransition, { once: true })
    a.classList.add('wordSwap')
    b.classList.add('wordSwap')
}

function endSwapTransition(ev) {
    const a = wordsToSwap[0]
    const b = wordsToSwap[1]
    wordsToSwap = null
    a.classList.remove('wordSwap')
    b.classList.remove('wordSwap')
    a.style.removeProperty('--transLeft')
    a.style.removeProperty('--transTop')
    swapDomElements(a, b)
    updateFlatElemList()
    refreshTextPresentation()
    isSwapping = false
}

function getPositionRelativeToContainer(el) {
    const parentPos = container.getBoundingClientRect()
    const childPos = el.getBoundingClientRect()
    const relPos = {}

    relPos.top = childPos.top - parentPos.top
    relPos.right = childPos.right - parentPos.right
    relPos.bottom = childPos.bottom - parentPos.bottom
    relPos.left = childPos.left - parentPos.left

    relPos.centerX = childPos.x + childPos.width / 2
    relPos.centerY = childPos.y + childPos.height / 2

    relPos.width = childPos.width
    relPos.height = childPos.height

    return relPos
}

function swapDomElements(obj1, obj2) {
    const parent2 = obj2.parentNode;
    const next2 = obj2.nextSibling;
    if (next2 === obj1) {
        parent2.insertBefore(obj1, obj2);
    } else {
        obj1.parentNode.insertBefore(obj2, obj1);
        if (next2) {
            parent2.insertBefore(obj1, next2);
        } else {
            parent2.appendChild(obj1);
        }
    }
}

function selectWord(el) {
    if (isSwapping) {
        return
    }
    if (!(el.classList.contains('word') && el.classList.contains('incorrect'))) {
        return
    }
    if (el == firstSelectedWord) {
        clearSelection()
        return
    }
    if(!firstSelectedWord) {
        el.classList.add('wordSelected')
        firstSelectedWord = el  // move to formatting
    }
    else {
        el.classList.add('wordSelected')
        swapWords(firstSelectedWord, el)
        firstSelectedWord = null
    }
}

function clearSelection() {
    refreshTextPresentation()
    firstSelectedWord = null
}

function getDescendantElements(elem, all = []) {
    for (let child of elem.children) {
        all.push(child)
        getDescendantElements(child, all)
    }

    return all
}

function drawDebugBox(parent, pos) {
    const testDiv = document.createElement('div')
    testDiv.style.position = 'absolute'
    testDiv.style.backgroundColor = 'orange'
    testDiv.style.width = '15px'
    testDiv.style.height = '15px'
    testDiv.style.top = `${pos.top}px`
    testDiv.style.left = `${pos.left}px`
    parent.appendChild(testDiv)
}

export { loadPuzzle, selectWord, clearSelection }