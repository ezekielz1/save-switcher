const tolerances = {
    left: 200,
    top: -20,
    right: 200,
    bottom: 200
}


function dragElement(elmnt, dragRegion) {
    console.log(elmnt)
    var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    dragRegion.onmousedown = dragMouseDown;
    
    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
    }
    
    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set the element's new position:
        elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
        elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
    }
    
    function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;

        outsideWindowCheck(elmnt)
    }

    function outsideWindowCheck(elmnt) {
        let rect = elmnt.getBoundingClientRect()
        if (rect.right > window.innerWidth + tolerances.right || rect.bottom > window.innerHeight + tolerances.bottom || rect.left < 0 - tolerances.left || rect.top < 0 - tolerances.top) {
            elmnt.style.removeProperty('top');
            elmnt.style.removeProperty('left');
        };
    }

    window.addEventListener('resize', () => outsideWindowCheck(elmnt))
}

export {
    dragElement
}
