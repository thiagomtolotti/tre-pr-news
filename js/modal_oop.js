//Objeto com os tipos de modais possíveis
const tiposModal = {
	addImg: {
		titulo: "Imagem",
		msg: "Adicione o link do Google Drive"
	},
	link: {
		titulo: "Link",
		msg: "Adicione o Link"
	},
	HTML: {
		msg: "Após exportar o HTML qualquer alteração exigirá que seja exportado novamente, você tem certeza que o material está finalizado?"
	},
	deleteMateria: {
		msg:"A matéria sendo excluída possuí conteúdo, deseja excluir mesmo assim?"
	}
}

//Orientação a objetos dos modais
//classe abstrata para os diferentes tipos de modais
class Modal{
	constructor(tipo, callback){
		this.msg = tipo.msg
		this.titulo = tipo.titulo
		this.callback = callback

		this.overlay = document.createElement('div')
		this.modal = document.createElement("div")

		if(Modal.isOpen){
			throw new Error("Não é possível abrir o modal pois já existe um modal aberto")
		}
	}

	addEventListeners(){
		this.modal.querySelector("#send").onclick = (()=>{
			this.callback() ? this.fechaModal() : ''
		})
		this.modal.querySelectorAll(".cancel, .close-btn").forEach((el)=>{
			el.onclick = ((ev)=>{
				if(ev.target != el) return

				this.fechaModal();
			})
		})
		document.querySelector(".overlay").onclick = (ev)=>{
			if(ev.target === document.querySelector(".overlay")){
				this.fechaModal();
			}
		}
	}

	fechaModal(){
		this.overlay.remove()
		this.modal.remove();

		Modal.isOpen = false
	}

	focusOnly(){
		let focusableElements = 'button, input'

		const firstFocusableElement = this.modal.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
		const focusableContent = this.modal.querySelectorAll(focusableElements);
		const lastFocusableElement = focusableContent[focusableContent.length - 1]; // get last elemnt to be focused inside modal

		document.addEventListener('keydown', function(e) {
		let isTabPressed = e.key === 'Tab' || e.keyCode === 9;

		if (!isTabPressed) {
			return;
		}

		if (e.shiftKey) { // if shift key pressed for shift + tab combination
			if (document.activeElement === firstFocusableElement) {
			lastFocusableElement.focus(); // add focus for the last focusable element
			e.preventDefault();
			}
		} else { // if tab key is pressed
			if (document.activeElement === lastFocusableElement) { // if focused has reached to last focusable element then focus first focusable element after pressing tab
			firstFocusableElement.focus(); // add focus for the first focusable element
			e.preventDefault();
			}
		}
	});

	firstFocusableElement.focus();
	}
}

class ConfirmModal extends Modal{
	constructor(tipo, callback){
		super(tipo, callback)

		this.titulo = "Confirmação"
		
		this.render()
		Modal.isOpen = true;
	}

	render(){
		this.overlay.classList.add("overlay");
		this.overlay.dataset.export = "false"
		this.modal.classList.add('prompt')
		this.modal.dataset.export = "false"

		this.modal.insertAdjacentHTML('afterbegin', `\
		<div class="content"> \
			<h2>${this.titulo}</h2> \
			<p>${this.msg}</p> \
		</div> \
		<div class="btn-container"> \
			<button class="cancel">Cancelar</button> \
			<button id="send">Enviar</button> \
		</div> \
		<div class="close-btn"></div>`)

		this.overlay.appendChild(this.modal)
		document.body.appendChild(this.overlay);

		this.addEventListeners()
		this.focusOnly()
	}

}

class InputModal extends Modal{
	constructor(tipo, callback){
		super(tipo, callback);

		this.render()
		Modal.isOpen = true;
	}

	render(){
		this.overlay.classList.add("overlay");
		this.overlay.dataset.export = "false"
		this.modal.classList.add('prompt')
		this.modal.classList.add('input')
		this.modal.dataset.export = "false"

		this.modal.insertAdjacentHTML('afterbegin', `\
		<div class="content"> \
			<h2>${this.titulo}</h2> \
			<p>${this.msg}</p> \
			<input type="text" id="modal-input"> \
			<p class="error-msg">Link inválido, tente novamente</p>\
		</div> \
		</div> \
		<div class="btn-container"> \
			<button class="cancel">Cancelar</button> \
			<button id="send">Enviar</button> \
		</div> \
		<div class="close-btn"></div>`)

		this.overlay.appendChild(this.modal)
		document.body.appendChild(this.overlay)

		this.addEventListeners()
		this.focusOnly()
	}
}
Modal.isOpen = false

//códigos que utilizam os modais

//Adiciona os modais para adicionar imagens
document.querySelectorAll('#materia-capa, #imagem-redes').forEach((img)=>{
	img.onkeydown = (event) => {
		if(event.keyCode === 13){
			img.click();
		}
	}

	img.onclick = (()=>{
		new InputModal(tiposModal.addImg, ()=>{
			let link = document.getElementById('modal-input').value;

			//confere se o campo de texto é um link do drive
			//TODO: usar fetch
			if(link.startsWith("https://drive.google.com/file/d/")){
				//separa a id do Google Drive
				let driveId;
				driveId = link.split("https://drive.google.com/file/d/").pop();
				driveId = driveId.split('/')[0];
		
				//adiciona ao novo link
				let newLink = "https://drive.google.com/uc?export=view&id=" + driveId;

				//adiciona a tag img com o src sendo o link
				img.src = newLink;

				new FlashMessage(flashMessages.addImg)
				
				return true
			}else{
				document.querySelector('.prompt').classList.add('erro');
				document.querySelector('.err-msg').style.display = "block";
			}
		})
	})
})

//Adiciona o modal de adicionar link à publicação
let linkBtn = document.querySelector("#link")

linkBtn.onclick = ((event)=>{
	event = event || window.event
	event.preventDefault();

	if(!linkBtn.classList.contains('greyed')){

		new InputModal(tiposModal.link, ()=>{
			let textToLink = selection.extractContents()
			let link = document.getElementById('modal-input').value;
	
			if(link !="" && link != null){
				let linkElement = document.createElement('a');
				
				linkElement.target = "_blank";
				linkElement.href = link;
				linkElement.appendChild(textToLink);
				selection.insertNode(linkElement);
				
				return true;
			}else{
				document.querySelector('.prompt').classList.add('erro');
				document.querySelector('.err-msg').style.display = "block";
			}
		})
	}else{
		new FlashMessage(flashMessages.avisoLink)
	}
})

//Adiciona o modal perguntando se o usuário deseja exportar o HTML
document.querySelector("#btn-export").onclick = (()=>{
	
	if(document.querySelector("#btn-export").classList.contains("greyed")) return
	
	new ConfirmModal(tiposModal.HTML, ()=>{
		geraHTML();

		return true;
	})
})


async function geraHTML(){
	//pega o head do HTML a ser exportado
	const htmlHead = await fetch('./index.html')
		.then((response)=>{
			// The API call was successful!
			return response.text()
		})
		.then((html)=>{
			// Convert the HTML string into a document object
			let parser = new DOMParser();
			let doc = parser.parseFromString(html, 'text/html');
			return doc
		})
		//Remove as tags não utilizadas
		.then((doc)=>{
			let head = doc.querySelector('head')
			let elementsToRemove = head.querySelectorAll("link, script, style")
			
			// remove todos os elementos que não devem ser exportado
			elementsToRemove.forEach((el)=>{
				el.parentElement.removeChild(el)
			})

			return head
		})
		.catch((erro)=>{
			console.log(erro)
	
			new FlashMessage(flashMessages.erroHTML)
		})

		
	let htmlBody = document.querySelector('html').cloneNode(true)

	//remove os elementos que não devem ser exportados
	let elementsToRemove = htmlBody.querySelectorAll('[data-export = false], script, link:not(#newsletter)')
	elementsToRemove.forEach((el)=>{
		el.parentElement.removeChild(el)
	})

	//transforma o css em inline
	showStyle(htmlBody)

	//remove o 'contenteditable' das divs
	htmlBody.querySelectorAll('*[contenteditable]').forEach(function(el){
		el.removeAttribute('contenteditable');
	});

	//pega somente o body
	htmlBody = htmlBody.querySelector('body .final').outerHTML

	//remove todos os comentários
	let bodyString = String(htmlBody).replaceAll(/<!--[\s\S]*?-->/g, '')

	//coloca o HTML no clipboarddy.innerHTML);
    navigator.clipboard.writeText(htmlHead.outerHTML + bodyString)
	
	new FlashMessage(flashMessages.Export)
}

//Leitor de estilos - https://stackoverflow.com/questions/42025329/how-to-get-the-applied-style-from-an-element-excluding-the-default-user-agent-s
const proto = Element.prototype;
const slice = Function.call.bind(Array.prototype.slice);
const matches = Function.call.bind(proto.matchesSelector || 
				proto.mozMatchesSelector || proto.webkitMatchesSelector ||
				proto.msMatchesSelector || proto.oMatchesSelector);

// Returns true if a DOM Element matches a cssRule
const elementMatchCSSRule = function(element, cssRule) {
	return matches(element, cssRule.selectorText);
};

// Returns true if a property is defined in a cssRule
const propertyInCSSRule = function(prop, cssRule) {
	return prop in cssRule.style && cssRule.style[prop] !== "";
};

// Here we get the cssRules across all the stylesheets in one arrays
const cssRules = Array.from(document.querySelector("#export-css").sheet.cssRules)

const getAppliedCss = function(elm) {
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

function showStyle(rootEl){
	let elements = rootEl.querySelectorAll(".final *");

	elements.forEach((el)=>{
		let rules= getAppliedCss(el)

		for (let i = 0; i < rules.length; i++){
			el.style.cssText += rules[i].text
		}
	})
}