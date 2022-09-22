<script lang="ts">
import { Parser, type StateConfig} from 'rain-sdk'

export let vmStateConfig: StateConfig
let parserInput: HTMLDivElement

const placeholderText = "Write your expression"

const inputAction = (node: HTMLDivElement) => {

    const editorFocus = () => {
        if (node.innerHTML == placeholderText) node.innerHTML = ""
    }
 
    const getTextSegments = (element: ChildNode) => {
        const textSegments = [];
        Array.from(element.childNodes).forEach((node) => {
            switch(node.nodeType) {
                case Node.TEXT_NODE:
                    textSegments.push({text: node.nodeValue, node});
                    break;
                    
                case Node.ELEMENT_NODE:
                    textSegments.splice(textSegments.length, 0, ...(getTextSegments(node)));
                    break;
                    
                default:
                    throw new Error(`Unexpected node type: ${node.nodeType}`);
            }
        });
        return textSegments;
    }

    const updateEditor = () => {
        const sel = window.getSelection();
        const textSegments = getTextSegments(node);
        const textContent = textSegments.map(({text}) => text).join('');
        let anchorIndex = null;
        let focusIndex = null;
        let currentIndex = 0;
        textSegments.forEach(({text, node}) => {
            if (node === sel.anchorNode) {
                anchorIndex = currentIndex + sel.anchorOffset;
            }
            if (node === sel.focusNode) {
                focusIndex = currentIndex + sel.focusOffset;
            }
            currentIndex += text.length;
        });
        
        node.innerHTML = renderText(textContent);
        
        restoreSelection(anchorIndex, focusIndex);
    }

    const restoreSelection = (absoluteAnchorIndex, absoluteFocusIndex) => {
        const sel = window.getSelection();
        const textSegments = getTextSegments(node);
        let anchorNode = node;
        let anchorIndex = 0;
        let focusNode = node;
        let focusIndex = 0;
        let currentIndex = 0;
        textSegments.forEach(({text, node}) => {
            const startIndexOfNode = currentIndex;
            const endIndexOfNode = startIndexOfNode + text.length;
            if (startIndexOfNode <= absoluteAnchorIndex && absoluteAnchorIndex <= endIndexOfNode) {
                anchorNode = node;
                anchorIndex = absoluteAnchorIndex - startIndexOfNode;
            }
            if (startIndexOfNode <= absoluteFocusIndex && absoluteFocusIndex <= endIndexOfNode) {
                focusNode = node;
                focusIndex = absoluteFocusIndex - startIndexOfNode;
            }
            currentIndex += text.length;
        });
        
        sel.setBaseAndExtent(anchorNode,anchorIndex,focusNode,focusIndex);
    }

    const renderText = (text: string) => {
        console.log(text)
        console.log('tree', Parser.getParseTree(text))
        const parsedResult = Parser.getParseTree(text)
        vmStateConfig = Parser.getStateConfig(text)
        const tree = parsedResult[0].tree

        if (!tree.length) return text

        let lastIndex = 0
        let textSegments = []

        const explode = (el) => {
            if (el?.opcode) {
                console.log('pushing opcode')
                textSegments.push({text: text.slice(lastIndex, el?.opcode.position[0]), node: null, type: 'ignored'})
                textSegments.push({text: text.slice(el?.opcode.position[0], el?.opcode.position[1] + 1), node: el, type: 'op'})
                lastIndex = el?.opcode.position[1] + 1
            } else if (el.value) {
                textSegments.push({text: text.slice(lastIndex, el?.position[0]), node: null, type: 'ignored'})
                textSegments.push({text: text.slice(el?.position[0], el?.position[1] + 1), node: el, type: 'param'})
                lastIndex = el?.position[1] + 1
            } else {
                textSegments.push({text: text.slice(lastIndex, el?.position[1] + 1), node: null, type: 'ignored'})
                lastIndex = el?.position[1] + 1
            }
            if (el?.parameters) {
                el?.parameters.forEach(explode)
            }
        }
        
        tree.forEach(explode)
        textSegments.push({text: text.slice(lastIndex), node: null, type: 'ignored'})
        console.log(textSegments)

        return textSegments.map(segment => {
            if (segment.type == 'ignored') {
                return segment.text
            }
            if (segment.type == 'op') {
                return `<span style="color:pink">${segment.text}</span>`
            }
            if (segment.type == 'param') {
                return `<span style="color:lightBlue">${segment.text}</span>`
            }
        }).join('')
    }

    const onPaste = (event) => {
        event.preventDefault();
        let paste = (event.clipboardData || window.clipboardData).getData('text');
        node.innerHTML = paste
        updateEditor();
    };

    node.addEventListener('paste', onPaste)
    node.addEventListener('input', updateEditor);
    node.addEventListener('focus', editorFocus)
}
</script>

<div class="border-2 rounded-lg border-gray-700 p-4 w-full" use:inputAction contenteditable="true" bind:this={parserInput}>
    {placeholderText}
</div>