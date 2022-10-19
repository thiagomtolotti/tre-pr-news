//identifica se tem algum texto selecionado
function getSelectedText(){
    var text = "";

    if(typeof window.getSelection != "undefined"){
        text = window.getSelection().toString();
    }else if(typeof document.selection != "undefined" && document.selection.type == "Text"){
        text = document.selection.createRange().text;
    }
    
    return text;
}

//se algum texto está selectionado abre o botão de adicionar link
let selection;

function openLink(){
	var selectedText = getSelectedText();
	
	if(selectedText && selectedText !=''){
        //adiciona botão do link
        document.getElementById("link").classList.remove("greyed");
		selection = window.getSelection().getRangeAt(0);
    }else{
        document.getElementById("link").classList.add("greyed");
	}
}

//a cada 200ms verifica se tem algum texto selecionado
window.setInterval(function(){
    openLink();
}, 200);

//'Plain-paste'; não aceita rich texts
const editorEle = document.querySelector('.final');

// Handle the `paste` event
editorEle.addEventListener('paste', function (e) {
    // Prevent the default action
    e.preventDefault();

    // Get the copied text from the clipboard
    const text = e.clipboardData
        ? (e.originalEvent || e).clipboardData.getData('text/plain')
        : // For IE
        window.clipboardData
        ? window.clipboardData.getData('Text')
        : '';

    if (document.queryCommandSupported('insertText')) {
        document.execCommand('insertText', false, text);
    } else {
        // Insert text at the current position of caret
        const range = document.getSelection().getRangeAt(0);
        range.deleteContents();

        const textNode = document.createTextNode(text);
        range.insertNode(textNode);
        range.selectNodeContents(textNode);
        range.collapse(false);

        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
    }
});