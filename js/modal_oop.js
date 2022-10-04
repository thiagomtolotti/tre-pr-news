let modalOpen = null;

class Modal{
	//constructor
	constructor(msg, funcaoExec){
		//verifica se já tem um modal aberto
		if(modalOpen){
			throw new Error('Já existe um modal aberto');
		}
		modalOpen = this;
		
		this.msg = msg;
		this.funcaoExec = funcaoExec;
	}
	
	render(){
			//cria os elementos para o modal
			let overlay = document.createElement("div");
			overlay.classList.add("overlay");
			document.body.appendChild(overlay);
		
			let modal = document.createElement("div");
			modal.setAttribute('id','modal')
			modal.classList.add('prompt');
			modal.classList.add('alert');
			document.body.appendChild(modal);


			//TODO: focusonly
		}
}

class ConfirmModal extends Modal{
	constructor(msg, funcaoExec){
		super(msg, funcaoExec);
		
		this.titulo = "Confirmação"
		let modalBtn = `<button onclick='${funcaoExec};fechaModal()' id='ok-btn'>OK</button>`;
		this.modalHTML = `<div> \
			<h3>${this.titulo}</h3> \
				<p>${msg}</p> \
			</div> \
		<div class="container"> \
			${modalBtn}\
			<button onclick="fechaModal()">Cancelar</button> \
		</div>`
		
		super.render()
		
		let modal = document.querySelector('#modal');

		modal.insertAdjacentHTML('beforeend', this.modalHTML);

		document.getElementById('ok-btn').focus();
	}
}

class InputModal extends Modal{
	constructor(msg, funcaoExec, titulo){
		super(msg, funcaoExec);
		
		this.titulo = titulo;
		let modalBtn = `<button onclick='${funcaoExec};fechaModal()' id='ok-btn'>OK</button>`;
	}
	
}

function fechaModal(){
	let overlay = document.querySelector(".overlay");
	let modal = document.querySelector("#modal");

	document.body.style.overflow = "visible";

	document.body.removeChild(overlay);
	document.body.removeChild(modal);

	modalOpen = null
	//TODO: focusonly
}