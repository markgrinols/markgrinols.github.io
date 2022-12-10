const container = document.getElementById("draggable");
const likelyProperNameMap = {}
let original_word_list = []
let wordsToSwap = []
let flatWordElems = []

// todo: rename this file
function setText(txt) {

    txtWithSpaces = txt.replaceAll(',', ' ,').replaceAll('.', ' .').replaceAll(':', ' :').replaceAll(';', ' ;').replaceAll('?', ' ?')
    let words = txtWithSpaces.split(' ')

    original_word_list = [...words].map( (x) => x.toLowerCase())

    // save capitalization info
    for(let i = 1; i < words.length; i++) {
        // if word is capitlized, but is not first letter or after a period, assume it's propername.
        // Not perfect, breaks on "God is dead."
        const word = words[i]
        likelyProperNameMap[word.toLowerCase()] = (word[0] === word[0].toUpperCase() && words[i - 1] != '.')
    }

    // this will ultimately be removed - puzzles will not be random at runtime
    const shuffle = true
    if (shuffle) {
        // shuffle words, leaving punctuation in place
        const nonPunctuationIndexes = Array.from(Array(words.length).keys()).filter(w => !isPunctuation(words[w]))
        const shuffledIndexes = [...nonPunctuationIndexes]
        shuffledIndexes.sort((a, b) => 0.5 - Math.random());
        const shuffledWords = []
        for (let i = 0; i < words.length; i++) {
            const isPunc = !nonPunctuationIndexes.includes(i)
            const newWord = isPunc ?  words[i] : words[shuffledIndexes.pop()]
            shuffledWords.push( newWord )
        }
        words = shuffledWords
    }

    buildDomTree(words)
}

function buildDomTree(words) {
    // due to linebreaking behavior for inline-block elements, the
    // tree has a funky structure which complicates everyting.
    // anytinme there is punctuation, the previous word and the punctuation
    // character(s) are parented to an intermediate span with 'nowrap' style.
    // these wrapper spans are siblings to the regular word spans.
    container.replaceChildren()
    for (let i = words.length - 1; i >= 0; i--) {
        let txtContent = words[i]
        let noWrapSpan = null
        if (isPunctuation(txtContent)) {
            noWrapSpan = document.createElement('span')
            noWrapSpan.classList.add('nowrap')
            while (isPunctuation(txtContent)) {
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

function updateFlatElemList() {
    flatWordElems = getDescendantElements(container).filter((e) => !e.classList.contains('nowrap'))
}

function refreshTextPresentation() {
    setCorrectSpaces()
    restoreCapitalization()
    setWordFormatting()
}

function setCorrectSpaces() {
    for(el of flatWordElems) {
        el.style.marginRight = '0px'
    }

    for (el of container.children) {
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
        const isProperName = likelyProperNameMap[text.toLowerCase()]
        const capitalizeIt = isFirst || isAfterPeriod || isProperName
        let firstLetter = text[0]
        firstLetter = capitalizeIt ? firstLetter.toUpperCase() : firstLetter.toLowerCase()
        el.textContent = firstLetter + text.slice(1)
    }
}

function isInCorrectLocation(elem) {
    const container_loc = flatWordElems.indexOf(elem)
    const spanText = elem.textContent.trim().toLowerCase()
    return  original_word_list[container_loc] === spanText
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
            isCorrect = isInCorrectLocation(child)
        }

        child.classList.remove('correct', 'incorrect', 'wordSelected')
        child.classList.add(isCorrect ? 'correct' : 'incorrect')
        prevIsCorrect = isCorrect
    }
}

function swapWords(a, b) {
    if (a === b) return
    if (flatWordElems.indexOf(a) > flatWordElems.indexOf(b)) {
        // hack: if b is before a in the dom, after the
        // transition, b re-animates right to left
        const tmp = a
        a = b
        b = tmp
    }

    wordsToSwap = [a, b]
    const posA = getPositionRelativeToParent(a)
    const posB = getPositionRelativeToParent(b)

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

    a.addEventListener('transitionend', endTransition, { once: true })
    a.classList.add('wordSwap')
    b.classList.add('wordSwap')
    console.log('swapped')
}

function endTransition(ev) {
    const a = wordsToSwap[0]
    const b = wordsToSwap[1]
    wordsToSwap = null
    a.classList.remove('wordSwap')
    b.classList.remove('wordSwap')
    a.style.removeProperty('--transLeft')
    a.style.removeProperty('--transTop')
    swapElements(a, b)
    updateFlatElemList()
    refreshTextPresentation()
}

function getPositionRelativeToParent(el) {
    const parentPos = el.parentNode.getBoundingClientRect()
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

function swapElements(obj1, obj2) {
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
    el.classList.add('wordSelected')
}

function isPunctuation(str) {
    return /[.;:?,]/.test(str)
}

function getDescendantElements(elem, all = []) {
    for (child of elem.children) {
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
