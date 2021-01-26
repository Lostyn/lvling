

export function addClass(node, className) {
    if (className && node.classList)
        node.classList.add(className);
}

export function addClasses(node, ...classNames){
    classNames.forEach( nameValue => 
        nameValue.split(' ').forEach(name => addClass(node, name))
    );
}

export function removeClass(node, className){
    if( className && node.classList)
        node.classList.remove(className);
}

export function append(parent, ...children){
    children.forEach(child => parent.appendChild(child));
    return children[children.length - 1];
}

const SELECTOR_REGEX = /([\w\-]+)?(#([\w\-]+))?((.([\w\-]+))*)/;
export function $(description) {
    let match = SELECTOR_REGEX.exec(description);

    let result = document.createElement(match[1] || 'div');

    if (match[3])
        result.id = match[3]
    if (match[4])
        result.className = match[4].replace(/\./g, ' ').trim();

    return result;
}

export function getClientArea(element) {
    // Try width DOM clientWidth / clientHeight
	if (element !== document.body) {
		return { width: element.clientWidth, height: element.clientHeight};
	}
    
	// Try innerWidth / innerHeight
	if (window.innerWidth && window.innerHeight){
		return { width: window.innerWidth, height: window.innerHeight};
	}
    
	// Try with document.body.clientWidth / document.body.clientHeight
	if (document.body && document.body.clientWidth && document.body.clientHeight){
		return { width: document.body.clientWidth, height: document.body.clientHeight};
	}
    
	// Try with documentElement.clientWidth / document.documentElement.clientHeight
	if (document.documentElement && document.documentElement.clientWidth && document.documentElement.clientHeight){
		return { width: document.documentElement.clientWidth, height: document.documentElement.clientHeight};
	}

	throw new Error('Unable to figure out browser width and height');
}

export function size(element, width, height) {
    if(typeof width === 'number' )
        element.style.width = `${width}px`;

    if(typeof height === 'number' )
        element.style.height = `${height}px`;
}

export function position(element, top = 0, right = 0, bottom = 0, left = 0, position = 'absolute') {
	if (typeof top === 'number') {
		element.style.top = `${top}px`;
	}

	if (typeof right === 'number') {
		element.style.right = `${right}px`;
	}

	if (typeof bottom === 'number') {
		element.style.bottom = `${bottom}px`;
	}

	if (typeof left === 'number') {
		element.style.left = `${left}px`;
	}

	element.style.position = position;
}

export function createStyleSheet(container = document.getElementsByTagName('head')[0]){
	let style = document.createElement('style');
	style.type = 'text/css';
	style.media = 'screen';
	container.appendChild(style);
	return style;
}

export const EventHelper = {
    stop: function(e, cancelBubble = false) {
        if (e.preventDefault){
            e.preventDefault();
        }
        else {
            // IE8
            e.returnValue = false;
        }

        if (cancelBubble){
            if (e.stopPropagation)
				e.stopPropagation();
			else {
				// EI8
				e.cancelBubble = true;	
			}
        }
    }
}