function getCoords(elem) {
    var box = elem.getBoundingClientRect();

    return {
        top: box.top + pageYOffset,
        left: box.left + pageXOffset
    };

}

function calculateBoxShadow(mouseX, mouseY, boxWithClass, box) {
    // Distance Z value, the greater the distanceValue value, the closer the light source to the document surface
    const distanceValue = 12;
    const changedShadowLeftNum = (mouseX - box.left - (box.width / 2)) / distanceValue;
    const changedShadowTopNum = (mouseY - box.top - (box.height / 2)) / distanceValue;
    const shadowOpacity = 0.4;

    const absoluteLeftNum = Math.abs(changedShadowLeftNum);
    const absoluteTopNum = Math.abs(changedShadowTopNum);

    const maximalNumOfLeftOrTop = Math.max(absoluteLeftNum, absoluteTopNum);
    // Min distance from element for bluring box shadow
    const minDistance = 2;
    const coefficient = 2;
    const defaultShadowBlurValue = minDistance / coefficient;
    const blurValue = (maximalNumOfLeftOrTop > minDistance ? maximalNumOfLeftOrTop / coefficient :
        defaultShadowBlurValue) + 'px ';

    const changedShadowLeft = -changedShadowLeftNum + 'px ';
    const changedShadowTop = -changedShadowTopNum + 'px ';

    boxWithClass.style.boxShadow = changedShadowLeft + changedShadowTop + blurValue + ' rgba(0, 0, 0, ' +
        shadowOpacity + ')';
}

function calculateLightReflection(mouseX, mouseY, boxWithClass, box) {
    const minDistanceFromBoxX = -(box.width / 2);
    const maxDistanceFromBoxX = box.width * 1.5;
    const minDistanceFromBoxY = -(box.height / 2);
    const maxDistanceFromBoxY = box.height * 1.5;
    const relativeLocationX = mouseX - box.left;
    const relativeLocationY = mouseY - box.top;
    let changedShadowLeftNum;
    let changedShadowTopNum;

    if (relativeLocationX < minDistanceFromBoxX) {
        changedShadowLeftNum = minDistanceFromBoxX;
    } else if (relativeLocationX > maxDistanceFromBoxX) {
        changedShadowLeftNum = maxDistanceFromBoxX;
    } else {
        changedShadowLeftNum = relativeLocationX
    }

    if (relativeLocationY < minDistanceFromBoxY) {
        changedShadowTopNum = minDistanceFromBoxY;
    } else if (relativeLocationY > maxDistanceFromBoxY) {
        changedShadowTopNum = maxDistanceFromBoxY;
    } else {
        changedShadowTopNum = relativeLocationY;
    }

    boxWithClass.style.setProperty('--gradient', 'radial-gradient(circle at ' + changedShadowLeftNum + 'px ' +
        changedShadowTopNum + 'px, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0) 80%');
}

function bringLightToBox(mouseX, mouseY, boxWithClass) {
    const box = {
        left: Math.ceil(getCoords(boxWithClass).left),
        top: Math.ceil(getCoords(boxWithClass).top),
        width: Math.ceil(boxWithClass.offsetWidth),
        height: Math.ceil(boxWithClass.offsetHeight)
    };

    calculateLightReflection(mouseX, mouseY, boxWithClass, box);
    calculateBoxShadow(mouseX, mouseY, boxWithClass, box);
}

function bindLightToCursor(mouseX, mouseY, cursorElement) {
    document.getElementsByTagName('body')[0].style.cursor = 'none';
    cursorElement.style.top = mouseY - (cursorElement.offsetHeight / 2) + 'px';
    cursorElement.style.left = mouseX - (cursorElement.offsetWidth / 2) + 'px';
}

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

document.addEventListener('mousemove', e => {
    const box = document.getElementsByClassName('auto-box-shadow');
    const cursor = document.getElementById('cursor-light');
    const mouseX = e.x;
    const mouseY = e.y;

    if (cursor) {
        bindLightToCursor(mouseX, mouseY, cursor);
    }

    if (!box || box.length < 1) {
        return;
    }

    for (let boxKey in box) {
        if (box.hasOwnProperty(boxKey)) {
            const boxWithClass = box[boxKey];

            bringLightToBox(mouseX, mouseY, boxWithClass);
        }
    }
});

document.addEventListener('click', e => {
    const boxElements = document.getElementsByClassName('auto-box-shadow');
    const clickMeElement = document.getElementById('click-me');

    const maxBoxElementsOnPage = 10;

    if (boxElements.length < maxBoxElementsOnPage) {
        const rndSize = getRandomIntInclusive(50, 200);

        let elementsToCreateLeftNum;
        let textOfElementsLeft;
        let boxEl = document.createElement('div');

        boxEl.classList.add('auto-box-shadow', 'with-lines', 'p-abs');
        boxEl.style.width = rndSize + 'px';
        boxEl.style.height = rndSize + 'px';
        boxEl.style.top = '0px';
        boxEl.style.left = (e.x - (rndSize / 2)) + 'px';
        boxEl.style.opacity = 0;
        boxEl.style.transition = 'opacity .3s, top .15s cubic-bezier(0.2,-2,0.99,2)';
        document.getElementsByTagName('body')[0].append(boxEl);
        setTimeout(() => {
            boxEl.style.opacity = 1;
            boxEl.style.top = (e.y - (rndSize / 2)) + 'px';
        }, 0);
        elementsToCreateLeftNum = maxBoxElementsOnPage - boxElements.length;
        textOfElementsLeft = elementsToCreateLeftNum ? elementsToCreateLeftNum + ' elements left' :
            'Click to restart';
        clickMeElement.innerText = textOfElementsLeft;
    } else {
        while (boxElements.length > 0) {
            boxElements[0].parentNode.removeChild(boxElements[0]);
            clickMeElement.innerText = 'Click anywhere';
        }
    }
});