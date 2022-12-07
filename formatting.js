function setText(container, txt) {
    txt = txt.replace(',', ' ,').replace('.', ' .').replace(':', ' :').replace(';', ' ;').replace('?', ' ?1')
    let words = txt.split(' ')

    for(let i = 1; i < words.length; i++) {
        // if word is capitlized, but is not first letter or after a period, assume it's propername.
        const word = words[i]
        likelyProperNameMap[word.toLowerCase()] = (word[0] === word[0].toUpperCase() && words[i - 1] != '.')
    }

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

    for (el in words) {
        txt = words[el]
        const textSpan = document.createElement('span')
        if (!'.,;:?'.includes(txt)) {
            textSpan.classList.add('word');
        }
        else {
            if (!'.,;:?'.includes(txt)) {
            textSpan.classList.add('non-word');
            }
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
    // add space after word unless it's next sibling is punctuation, or we're at the end of the list.
    // note that the final '.' is outside the container atm (which prevents dropping word after the end).
    // the goal is to have the last child not get a space added. However,
    // sortable.js will put the 'being dragged' element into the end of the container,
    // So if that last element is that one (identified by class name), we stop
    // adding spaces from the 2nd to last element instead of the last element.
    const numChildren = container.childElementCount
    const isLastElGhost = container.children[numChildren - 1].className.match("\s*" + "sortable-drag" + "\s*")

    for (var i = 0; i < numChildren; ++i) {
        const el = container.children[i]
        const txt = el.innerText.trim()
        el.innerText = txt
        if (i < (numChildren - (isLastElGhost ? 2 : 1)) && !isPunctuation(container.children[i + 1].innerText)) {
            el.innerText += " "
        }
    }
}

function restoreCapitalization(container) {
    // if word is first word or after a period, or is capitlized in likelyProperNameMap
    // make capital, else don't.
    const numChildren = container.childElementCount
    const isLastElGhost = container.children[numChildren - 1].className.match("\s*" + "sortable-drag" + "\s*")

    for (var i = 0; i < numChildren; ++i) {
        const isFirst = i == 0
        const afterPeriod = i > 0 && container.children[i - 1].innerText.trim() == '.'
        const txt = container.children[i].innerText.trim()
        const properName = likelyProperNameMap[txt.toLowerCase()]
        let newVal = container.children[i].innerText
        const firstChar = (isFirst || afterPeriod || properName) ? newVal[0].toUpperCase() : newVal[0].toLowerCase()
        container.children[i].innerText = firstChar + newVal.slice(1)
    }
}

function getChildIndex(node) {
    return Array.prototype.indexOf.call(node.parentNode.childNodes, node);
}
