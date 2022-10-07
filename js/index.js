

// // Flash-Messages
// //objeto JSON com os 'tipos' de modal
// let flash_messages_JSON = '{ \
//     "HTML": { \
//        "tipo": "aviso", \
//        "titulo" : "Edição bloqueada", \
//        "texto": "A partir desse momento não é mais posível editar a newsletter" \
//     }, \
//     "Export": { \
//        "tipo" : "sucesso", \
//        "titulo" : "Conteúdo Exportado", \
//        "texto" : "O conteúdo da newsletter foi exportado, basta colá-lo no seu provedor de email"\
//     }, \
//     "removeMateria": { \
//        "tipo" : "sucesso", \
//        "titulo" : "Matéria removida", \
//        "texto" : "Matéria removida com sucesso"\
//     }, \
//     "notRemoveMateria": { \
//        "tipo" : "erro", \
//        "titulo" : "Não é possível remover a matéria", \
//        "texto" : "Não há matérias a serem removidas"\
//     }, \
//     "addMateria": { \
//        "tipo" : "sucesso", \
//        "titulo" : "Matéria Adicionada", \
//        "texto" : "Matéria adicionada com sucesso"\
//     } \
//    }'
   
// let flashMessages = JSON.parse(flash_messages_JSON)

// let elementToRemove
// function deleteMateria(el){
//     elementToRemove = el.parentNode
//     let titulo = elementToRemove.querySelector('.titulo-materia')
//     let texto = elementToRemove.querySelector('.texto-materia')
//     let tipo
    
//     if(elementToRemove.classList.contains("outra-materia-container")){
//         tipo = outra
//     }

//     let isLastChildrenEmpty = (titulo.innerHTML == "" && texto.children[0].innerHTML == '');

//     if(isLastChildrenEmpty || modalopen){ //se a matéria a ser removida está vazia OU o modal está aberto (e o usuário confirmou que deseja mesmo remover)
//         elementToRemove.remove();
//         new FlashMessage(flashMessages.removeMateria)
//     }else{
//         addConfirm(tipo, 'callbackAlert', 'deletedMateria');
//     }
// }

// function callbackAlert(callback){
//     console.log(elementToRemove)
//     if(alertValue){
//         elementToRemove.remove()

//         callback();
//     }
// }

// function deletedMateria(){
//     console.log('excluiu')
//     new FlashMessage(flashMessages.removeMateria)
// }

function geraHTML(){
    //remove o atributo 'contenteditable' dos elementos
    document.querySelectorAll('*[contenteditable]').forEach(function(e){
        e.removeAttribute('contenteditable');
    });
	//remove as labels
	document.querySelectorAll('label').forEach(function(label){
		
		while(label.firstElementChild){
			label.firstElementChild.style.marginBottom = "40px";
			label.parentNode.insertBefore(label.firstElementChild, label);
		}
		
		label.parentNode.removeChild(label);
	});

    //chama a função pra redirecionar o usuário pro inliner
	showStyle();

    //copia o HTML para o clipboard
    var html_inicio = '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">  \
    <html xmlns="http://www.w3.org/1999/xhtml"> \
    <head> \
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" /> \
        <meta http-equiv="X-UA-Compatible" content="IE=edge" /> \
        <meta name="viewport" content="width=device-width, initial-scale=1.0"> \
        <title>Newsletter TRE-PR</title>\
            <style> \
            .main,table{border-spacing:0}#footer,hr{background-color:#0a375c}body{margin:0;background-color:#ccc}td{padding:0}img{border:0}.wrapper{width:100%;table-layout:fixed;background-color:#f6f4f3;padding-bottom:60px}.main{background-color:#e8e3e0;margin:0 auto;width:100%;max-width:580px;font-family:Roboto,Arial,sans-serif;color:#0a375c}hr{width:55%;height:3px;border:none;margin:0 0 30px}.titulo-materia{font-size:28px;line-height:32px;font-weight:700;margin:0 auto 10px}.texto-materia,.texto-materia div,.texto-materia p{font-family:Georgia,"Times New Roman",serif;font-size:18px;line-height:26px;text-align:left}.texto-materia div,.texto-materia p,p{overflow-wrap:break-word;word-break:break-word}a{color:#3183af;text-decoration:underline}.titulo-materia.outro{font-size:22px}.outra-materia{margin:0 0 50px}#footer{color:#e8e3e0}.icon_redes{display:inline-block;margin:auto 15px}</style> \
            </head> \
            <body> ';

    var html_final = "\
    </body> \
    </html>"

    // seleciona o HTML de cada elemento com a classe 'final' e adiciona a variável html_meio
    var html_meio = document.querySelector('.final').outerHTML;

    //concatena as variáveis com o html em uma única variável "HTML_export"
    var HTML_export = html_inicio + html_meio + html_final;

    //coloca o HTML no clipboard
    navigator.clipboard.writeText(HTML_export);

    new FlashMessage(flashMessages.Export)
    new FlashMessage(flashMessages.HTML)
}

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

//TESTE do leitor de estilos - https://stackoverflow.com/questions/42025329/how-to-get-the-applied-style-from-an-element-excluding-the-default-user-agent-s
    var proto = Element.prototype;
    var slice = Function.call.bind(Array.prototype.slice);
    var matches = Function.call.bind(proto.matchesSelector || 
                    proto.mozMatchesSelector || proto.webkitMatchesSelector ||
                    proto.msMatchesSelector || proto.oMatchesSelector);

    // Returns true if a DOM Element matches a cssRule
    var elementMatchCSSRule = function(element, cssRule) {
        return matches(element, cssRule.selectorText);
    };

    // Returns true if a property is defined in a cssRule
    var propertyInCSSRule = function(prop, cssRule) {
        return prop in cssRule.style && cssRule.style[prop] !== "";
    };

    // Here we get the cssRules across all the stylesheets in one array
    var cssRules = slice(document.styleSheets).reduce(function(rules, styleSheet) {
        return rules.concat(slice(styleSheet.cssRules));
    }, []);

    var getAppliedCss = function(elm) {
        // get only the css rules that matches that element
        var elementRules = cssRules.filter(elementMatchCSSRule.bind(null, elm));
        var rules =[];
        if(elementRules.length) {
            for(i = 0; i < elementRules.length; i++) {
                var e = elementRules[i];

                //remove as chaves e os seletores do css
                let cssText = e.cssText
                e.cssText.includes("{") ? cssText = e.cssText.substring(e.cssText.indexOf("{") + 1).split("}")[0] : cssText = e.cssText

                rules.push({
                    order:i,
                    text: cssText
                })
            }		
        }
        
        if(elm.getAttribute('style')) {
            rules.push({
                    order:elementRules.length,
                    text:elm.getAttribute('style')
                })
        }
        return rules;
    }

    function showStyle (){
        let styleSheetList = document.styleSheets;

        let elements = document.querySelectorAll(".final *");

        elements.forEach((el)=>{
            let rules= getAppliedCss(el)

            for (let i = 0; i < rules.length; i++){
                console.log(el, rules[i].text)
                el.style.cssText += rules[i].text
            }
        })
    }