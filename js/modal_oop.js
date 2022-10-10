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
		msg: "Gerar o HTML é uma ação irreversível, tem certeza de que deseja continuar?"
	}
}

//Orientação a objetos
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
		this.modal.querySelector("#ok-btn").onclick = (()=>{
			this.callback() ? this.fechaModal() : ''
		})
		this.modal.querySelector("button:nth-child(2)").onclick = (()=>{
			this.fechaModal();
		})
	}

	fechaModal(){
		this.overlay.remove()
		this.modal.remove();

		Modal.isOpen = false
	}

	//BUG: no InputModal o campo de input não é ADA compliant
	focusOnly(){
		let focusableElements = 'button'

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
		<div> \
			<h3>${this.titulo}</h3> \
			<p>${this.msg}</p> \
		</div> \
		<div class="container"> \
			<button id="ok-btn">OK</button> \
			<button>Cancelar</button> \
		</div>`)

		document.body.appendChild(this.overlay);
		document.body.appendChild(this.modal)

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
		this.modal.dataset.export = "false"

		this.modal.insertAdjacentHTML('afterbegin', `\
		<div> \
			<h3>${this.titulo}</h3> \
			<p>${this.msg}</p> \
		</div> \
		<div> \
			<input type="text" id="modal-input"> \
			<p class="err-msg hidden">Link inválido, tente novamente</p>\
		</div> \
		<div class="container"> \
			<button id="ok-btn">Enviar</button> \
			<button>Cancelar</button> \
		</div>`)

		document.body.appendChild(this.overlay);
		document.body.appendChild(this.modal)

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
		let textToLink = selection.extractContents()

		new InputModal(tiposModal.link, ()=>{
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
	}
})

//Adiciona o modal perguntando se o usuário deseja exportar o HTML
document.querySelector("#btn-export").onclick = (()=>{
	new ConfirmModal(tiposModal.HTML, ()=>{
		geraHTML();

		return true;
	})
})