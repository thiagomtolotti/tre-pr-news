

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
	}

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