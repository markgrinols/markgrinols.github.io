const likelyProperNameMap = {}
let original_word_list = []

function setText(container, txt) {
    txtWithSpaces = txt.replaceAll(',', ' ,').replaceAll('.', ' .').replaceAll(':', ' :').replaceAll(';', ' ;').replaceAll('?', ' ?')
    let words = txtWithSpaces.split(' ')

    original_word_list = [...words].map( (x) => x.toLowerCase())

    // save capitalization info
    for(let i = 1; i < words.length; i++) {
        // if word is capitlized, but is not first letter or after a period, assume it's propername.
        // of course that breaks on "God is dead."
        const word = words[i]
        likelyProperNameMap[word.toLowerCase()] = (word[0] === word[0].toUpperCase() && words[i - 1] != '.')
    }

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

    for (el in words) {
        txt = words[el]
        const textSpan = document.createElement('span')
        if (isPunctuation(txt)) {
            textSpan.classList.add('punctuation');
        }
        const textNode = document.createTextNode(txt)
        textSpan.appendChild(textNode)
        container.appendChild(textSpan)
    }
}

function isPunctuation(str) {
    return /[.;:?,]/.test(str)
}

function setCorrectSpaces(container) {
    for (child of container.children) {
        const txt = child.textContent.trim()
        child.textContent = txt
        if (!child.nextSibling?.classList.contains('punctuation')) {
            child.textContent += " "
        }
    }
}

function restoreCapitalization(container) {
    // if word is first word or after a period, or is capitlized in likelyProperNameMap
    // make capital, else don't.
    const numChildren = container.childElementCount

    for (var i = 0; i < numChildren; ++i) {
        const isFirst = i == 0
        const isAfterPeriod = i > 0 && container.children[i - 1].textContent.trim() == '.'
        const txt = container.children[i].textContent.trim()
        const isProperName = likelyProperNameMap[txt.toLowerCase()]
        let newVal = container.children[i].textContent
        const firstChar = (isFirst || isAfterPeriod || isProperName) ? newVal[0].toUpperCase() : newVal[0].toLowerCase()
        container.children[i].textContent = firstChar + newVal.slice(1)
    }
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

function isInCorrectLocation(elem) {
    const container_loc = getChildIndex(elem)
    const spanText = elem.textContent.trim().toLowerCase()
    return  original_word_list[container_loc] === spanText
}

function setWordFormatting(container) {
    const numChildren = container.childElementCount
    const wordsInRightSpots = []
    for (var i = 0; i < numChildren; ++i) {
        const child = container.children[i]
        const spanText = child.textContent.trim()
        wordsInRightSpots.push(false)
        if (isPunctuation(spanText) && i > 0) {
            wordsInRightSpots[i] = wordsInRightSpots[i - 1]
        }
        else {
            wordsInRightSpots[i] = isInCorrectLocation(child)
        }
    }
    for (var i = 0; i < numChildren; ++i) {
        const child = container.children[i]
        removeClassByPrefix(child, 'word')
        child.classList.add(wordsInRightSpots[i] ? 'wordCorrect' : 'wordIncorrect')
    }
}

function selectWord(el) {
    removeClassByPrefix(el, 'word')
    el.classList.add('wordSelected')
}

function getChildIndex(node) {
    return Array.prototype.indexOf.call(node.parentNode.childNodes, node);
}

function removeClassByPrefix(node, prefix) {
	var regx = new RegExp('\\b' + prefix + '[^ ]*[ ]?\\b', 'g');
	node.className = node.className.replace(regx, '');
	return node;
}