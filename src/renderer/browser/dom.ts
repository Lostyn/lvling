const SELECTOR_REGEX = /([\w\-]+)?(#([\w\-]+))?((.([\w\-]+))*)/;

export function $(descriptor: string) : HTMLElement {
    let match = SELECTOR_REGEX.exec(descriptor);
    let result = document.createElement(match[1] || 'div');

    if (match[3])
        result.id = match[3]
    if (match[4])
        result.className = match[4].replace(/\./g, ' ').trim();

    return result;
}

export function append(parent:HTMLElement, ...children : HTMLElement[]) : HTMLElement {
    children.forEach(child => parent.appendChild(child));
    return children[children.length - 1];
}