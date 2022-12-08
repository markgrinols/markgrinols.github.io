const likelyProperNameMap = {}
let original_word_list = []

function setText(container, txt) {
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

function setWordFormatting(container) {
    let prevIsCorrect = false
    for (child of container.children) {
        let isCorrect = false
        if (child.previousSibling && child.classList.contains('punctuation')) {
            // adopt formatting of previous word
            isCorrect = prevIsCorrect
        }
        else {
            isCorrect = isInCorrectLocation(child)
        }

        child.classList.remove('wordCorrect', 'wordIncorrect', 'wordSelected')
        child.classList.add(isCorrect ? 'wordCorrect' : 'wordIncorrect')
        prevIsCorrect = isCorrect
    }
}

function selectWord(el) {
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
