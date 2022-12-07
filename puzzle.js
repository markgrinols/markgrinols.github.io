function pointerDown(ev) {
    el = ev.srcElement
    el.style.color = 'red'
}

const container = document.getElementById("draggable");
setText(container, "by all means, move at a glacial pace. You know how God thrills me.")
setCorrectSpaces(container)
restoreCapitalization(container)
