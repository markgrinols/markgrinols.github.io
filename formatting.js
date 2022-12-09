const likelyProperNameMap = {}
let original_word_list = []
let wordsToSwap = []

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

    for (i in words.reverse()) {
        const txt = words[i]
        const textSpan = document.createElement('span')
        if (isPunctuation(txt)) {
            textSpan.classList.add('punctuation');
        }else {
            textSpan.classList.add('word');
            if (i > 0 && isPunctuation(words[i - 1])) {
                textSpan.style.whiteSpace = 'nowrap'
            }
        }


        const textNode = document.createTextNode(txt)
        textSpan.prepend(textNode)
        container.prepend(textSpan)
    }
}

function refreshTextPresentation() {
    setCorrectSpaces()
    restoreCapitalization()
    setWordFormatting()
}

function setCorrectSpaces() {

    for (child of container.children) {
        const txt = child.textContent.trim()
        child.textContent = txt
        const isNextElemPunc = child.nextSibling?.classList.contains('punctuation') || false
        child.style.marginRight = isNextElemPunc ? '0px': '20px'
    }
}

function restoreCapitalization() {
    // if word is first word or after a period, or is capitlized in likelyProperNameMap
    // make capital, else don't.
    const numChildren = container.childElementCount

    for (child of container.children) {
        const isFirst = child.previousSibling === null
        const isAfterPeriod = child.previousSibling?.textContent.trim() === '.'
        const isProperName = likelyProperNameMap[child.textContent.trim().toLowerCase()]
        const capitalizeIt = isFirst || isAfterPeriod || isProperName
        let firstLetter = child.textContent[0]
        firstLetter = capitalizeIt ? firstLetter.toUpperCase() : firstLetter.toLowerCase()
        child.textContent = firstLetter + child.textContent.slice(1)
    }
}

function isInCorrectLocation(elem) {
    const container_loc = getChildIndex(elem)
    const spanText = elem.textContent.trim().toLowerCase()
    return  original_word_list[container_loc] === spanText
}

function setWordFormatting() {
    let prevIsCorrect = false
    for (child of container.children) {
        let isCorrect = false
        if (child.previousSibling && child.classList.contains('punctuation')) {
            isCorrect = prevIsCorrect // adopt formatting of previous word
        }
        else {
            isCorrect = isInCorrectLocation(child)
        }

        child.classList.remove('wordCorrect', 'wordIncorrect', 'wordSelected')
        child.classList.add(isCorrect ? 'wordCorrect' : 'wordIncorrect')
        prevIsCorrect = isCorrect
    }
}

function doVisualSwap(a, b) {
    if (getChildIndex(a) > getChildIndex(b)) {
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
    refreshTextPresentation()
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

function selectWord(el) {
    el.classList.add('wordSelected')
}

function getChildIndex(node) {
    return Array.prototype.indexOf.call(node.parentNode.childNodes, node);
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

function isPunctuation(str) {
    return /[.;:?,]/.test(str)
}
