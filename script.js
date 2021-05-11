/** @see https://www.w3schools.com/howto/howto_js_draggable.asp */
const dragElement = elm => {
	let pos1 = 0;
	let pos2 = 0;
	let pos3 = 0;
	let pos4 = 0;

	const dragMouseDown = e => {
		e = e || window.event;
		e.preventDefault();
		// add dragging state
		elm.classList.add('dragging');
		// get the mouse cursor position at startup:
		pos3 = e.clientX;
		pos4 = e.clientY;
		document.onmouseup = closeDragElement;
		// call a function whenever the cursor moves:
		document.onmousemove = elementDrag;
	}

	const elementDrag = e => {
		e = e || window.event;
		e.preventDefault();
		// calculate the new cursor position:
		pos1 = pos3 - e.clientX;
		pos2 = pos4 - e.clientY;
		pos3 = e.clientX;
		pos4 = e.clientY;
		// set the element's new position:
		elm.style.top = `${elm.offsetTop - pos2}px`;
		elm.style.left = `${elm.offsetLeft - pos1}px`;
	}

	const closeDragElement = () => {
		// remove dragging state
		elm.classList.remove('dragging');
		// stop moving when mouse button is released:
		document.onmouseup = null;
		document.onmousemove = null;
	}

	elm.onmousedown = dragMouseDown;
}

// Make the DIV element draggable:
const card = document.getElementsByClassName('card')[0];
dragElement(card);
setTimeout(() => {
	card.classList.remove('small');
}, 100);