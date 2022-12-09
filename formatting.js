const likelyProperNameMap = {}
let original_word_list = []

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
    words.reverse()
    const shuffle = false
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


    for (el in words) {
        txt = words[el]
        const textSpan = document.createElement('span')
        if (isPunctuation(txt)) {
            textSpan.classList.add('punctuation');
        }else {
            textSpan.classList.add('word');
        }
        const textNode = document.createTextNode(txt)
        textSpan.appendChild(textNode)
        container.appendChild(textSpan)
//        container.appendChild(document.createElement('span').appendChild(document.createTextNode(' ')))
    }
}

function isPunctuation(str) {
    return /[.;:?,]/.test(str)
}

function setCorrectSpaces() {
    for (child of container.children) {
        const txt = child.textContent.trim()
        child.textContent = txt
        if (!child.nextSibling?.classList.contains('punctuation')) {
            child.textContent += " "
        }
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

function doVisualSwap(container, a, b) {
        // a.style.opacity = 1
        // b.style.opacity = 1

        // const c = a.cloneNode(true)
        // c.style.color = 'orange'
//        a.classList.add('wordSwap')
    firstSwapPhase(a, b)
}

function firstSwapPhase(a, b) {
    const sentence = document.querySelector('#sentence')
    const clone = sentence.cloneNode(true)

    // items that will always be true and can be put in css
    clone.style.position = 'absolute'
    clone.style.backgroundColor = 'gray'
    const p = sentence.getBoundingClientRect()
    const fuck = 0 //`${-1 * p.top}px`
    clone.style.top = fuck
    clone.style.marginTop = 0
    clone.style.marginBottom = 0
    clone.style.opacity = 1

    // swap words
//    swapElements

    document.body.prepend(clone)
    console.log('phase 1')
    const cloneWordsContainer = clone.lastElementChild
    setTimeout(secondSwapPhase(cloneWordsContainer), 100)
}

function secondSwapPhase(cloneWordsContainer) {
    console.log('phase 2')
    const pos = getPositionRelativeToParent(cloneWordsContainer.lastElementChild)
    console.log(`pos: ${JSON.stringify(pos)}`)

    const testDiv = document.createElement('div')
    testDiv.classList.add('temp');
    cloneWordsContainer.appendChild(testDiv)


    // get new positions and kick off animations
}

function getPositionRelativeToParent(el) {
    const parentPos = el.parentNode.getBoundingClientRect()
    const childPos = el.getBoundingClientRect()
    const relPos = {}

    relPos.top = childPos.top - parentPos.top
    relPos.right = childPos.right - parentPos.right
    relPos.bottom = childPos.bottom - parentPos.bottom
    relPos.left = childPos.left - parentPos.left

    return relPos
}

function selectWord(el) {
    el.classList.add('wordSelected')
//    el.classList.add('wordSwap')




}

function getChildIndex(node) {
    return Array.prototype.indexOf.call(node.parentNode.childNodes, node);
}

// function removeClassByPrefix(node, prefix) {
// 	var regx = new RegExp('\\b' + prefix + '[^ ]*[ ]?\\b', 'g');
// 	node.className = node.className.replace(regx, '');
// 	return node;
// }

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
