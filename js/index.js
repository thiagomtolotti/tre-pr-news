const main = {
    containerId: 'container-materias-main',
    html: `<tr> \
    <td style="padding: 20px 20px 0;"> \
        <p class="titulo-materia" contenteditable placeholder="Título da matéria"></p> \
        <hr> \
        <div class="texto-materia" contenteditable> \
            <p placeholder="Texto da matéria"></p> \
        </div> \
    </td> \
    </tr>`,
    btnRemoveId: 'remove-materia',
    maxChilds: 0,
    msg: "Há conteúdo na matéria <strong>principal</strong> sendo excluída, deseja continuar mesmo assim?",
    funcaoRemove: `materiasMain.removeMateria()`
}

const outra = {
    containerId: 'container-materia-outras',
    html: `<tr> \
    <td style="padding: 20px 20px 0;"> \
        <div class="outra-materia"> \
            <p class="titulo-materia outro" contenteditable placeholder="Título da Matéria"></p> \
            <div class="texto-materia" contenteditable=""> \
				<p placeholder="Gravata da matéria"></p> \
			</div> \
        </div> \
    </td> \
    </tr>`,
    btnRemoveId: 'remove-outra-materia',
    maxChilds: 1,
    msg: "Há conteúdo na matéria <strong>secundária</strong> sendo excluída, deseja continuar mesmo assim?",
    funcaoRemove: `materiasOutra.removeMateria()`
}

//constructor
function Materias(tipo){
    let btnRemove = document.getElementById(tipo.btnRemoveId);
    let container = document.querySelector(`#${tipo.containerId}`);
	
	//define os métodos do objeto
    this.addMateria = function(){
        container.insertAdjacentHTML('beforeend', tipo.html);
        btnRemove.classList.remove('greyed');

        new FlashMessage(flashMessages.addMateria)
    };
    this.removeMateria = function(){
        let children = container.childElementCount;
        let titulo = document.querySelectorAll(`#${tipo.containerId} .titulo-materia`);
        let texto = document.querySelectorAll(`#${tipo.containerId} .texto-materia`);

        if(children > tipo.maxChilds){
            let isLastChildrenEmpty = (titulo[titulo.length -1].innerHTML == "" && texto[texto.length-1].children[0].innerHTML == '');

            if(isLastChildrenEmpty || modalopen){ //se a matéria a ser removida está vazia OU o modal está aberto (e o usuário confirmou que deseja mesmo remover)
                container.lastChild.remove();
                new FlashMessage(flashMessages.removeMateria)
            }else{
                addConfirm(tipo);
            }
        }else{
            new FlashMessage(flashMessages.notRemoveMateria)
            console.log('não foi possível remover a matéria pois não há matéria a ser removida');
        }
		
		children = container.childElementCount;

        (children > tipo.maxChilds) ? btnRemove.classList.remove('greyed') : btnRemove.classList.add('greyed'); 
    };
	
	//métodos privados
	
	
	//define as propriedades privadas do objeto
	Object.defineProperty(this, "btnRemove",{
		get: function(){
			return btnRemove;
		}
	});
	Object.defineProperty(this, "container", {
		get: function(){
			return container
		}
	})
}

const materiasMain = new Materias(main);
const materiasOutra = new Materias(outra);

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