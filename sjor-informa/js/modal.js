let modalopen = false;

const link = {
	titulo: "Link",
	texto: "Adicione o link",
	funcaoExec: `addLink(selection.extractContents())`
};
const imgCapa = {
	titulo: "Imagem",
	texto: "Adicione o link do Google Drive",
	funcaoExec : `adicionaImg('materia-capa')`
};
const imgRedes = {
	titulo: "Imagem",
	texto: "Adicione o link do Google Drive",
	funcaoExec : `adicionaImg('imagem-redes')`
};
const HTML = {
	msg: "Gerar o HTML é uma ação irreversível, tem certeza de que deseja continuar?",
	funcaoRemove: 'geraHTML(enviaproInliner)'
};

//adiciona modal com o texto indicado
function addModal(tipo){
	if(!modalopen){
		
		let titulo, texto, funcaoExec;
		
		if(tipo == null || tipo == undefined){
			console.log('Modal com tipo inválido');
			return;
	 	}
		
		//cria os elementos para o modal
		let overlay = document.createElement("div");
		overlay.classList.add("overlay");
		document.body.appendChild(overlay);

		let modal = document.createElement("div");
		modal.classList.add('prompt');

		modal.insertAdjacentHTML('beforeend',
		`<div> \
			<h3>${tipo.titulo}</h3> \
				<p>${tipo.texto}</p> \
			</div> \
		<div> \
			<input type="text" id="modal-text"> \
			<p class = "err-msg hidden">Link inválido, tente novamente</p>\
		</div> \
		<div class="container"> \
			<button onclick="${tipo.funcaoExec}">Enviar</button> \
			<button onclick="fechaModal()">Cancelar</button> \
		</div>`);

		document.body.appendChild(modal);
		
		document.getElementById('modal-text').focus();
		modalopen = true;
	}
	
	focusOnly('#modal-text, button');
}

//fecha o modal
function fechaModal(){
	let overlay = document.querySelector(".overlay");
	let modal = document.querySelector(".prompt");
	
	document.body.style.overflow = "visible";
	
	document.body.removeChild(overlay);
	document.body.removeChild(modal);
	
	modalopen = false;
}

//adiciona um alert
function addConfirm(tipo){
	if(tipo == undefined || tipo == null){
		console.log("Alert com tipo inválido")
	}
	
	if(!modalopen){
		//cria os elementos para o modal
		let overlay = document.createElement("div");
		overlay.classList.add("overlay");
		document.body.appendChild(overlay);

		let modal = document.createElement("div");
		modal.classList.add('prompt');
		modal.classList.add('alert');

		modal.insertAdjacentHTML('beforeend',
		`<div> \
			<h3>Confirmação</h3> \
				<p>${tipo.msg}</p> \
			</div> \
		<div class="container"> \
			<button onclick="${tipo.funcaoRemove};fechaModal()" id="ok-btn">OK</button> \
			<button onclick="fechaModal()">Cancelar</button> \
		</div>`);

		document.body.appendChild(modal);
		
		document.getElementById('ok-btn').focus();
		modalopen = true;
	}else{console.log('não foi possível abrir o modal pois já há um aberto')}
	
	focusOnly('button');
	
}

//bloqueia o acesso via 'tab' em qualquer elemento enquanto o modal estiver aberto
function focusOnly(focusableElements){
	// add all the elements inside modal which you want to make focusable
	const modal = document.querySelector('.prompt'); // select the modal by it's id

	const firstFocusableElement = modal.querySelectorAll(focusableElements)[0]; // get first element to be focused inside modal
	const focusableContent = modal.querySelectorAll(focusableElements);
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

//adiciona a imagem com o link desejado
function adicionaImg(id){
	
	let link = document.getElementById('modal-text').value;
	
    //confere se o campo de texto é um link do drive
    if(link.startsWith("https://drive.google.com/file/d/")){
        //separa a id do Google Drive
        let driveId;
        driveId = link.split("https://drive.google.com/file/d/").pop();
        driveId = driveId.split('/')[0];

        //adiciona ao novo link
        let newLink = "https://drive.google.com/uc?export=view&id=" + driveId;
        //adiciona a tag img com o src sendo o link
        let img = document.querySelector('#' + id);
		
		img.src = newLink;
		
		fechaModal();
    }else{
        document.querySelector('.prompt').classList.add('erro');
		document.querySelector('.err-msg').style.display = "block";
    }
}

//adiciona a tag <a> ao html com o atributo 'href' com o valor digitado na caixa
function addLink(selectedText){
	let link = document.getElementById('modal-text').value;
	
	if(link !="" && link != null){
		let linkElement = document.createElement('a');
		
		linkElement.target = "_blank";
		linkElement.href = link;
    	linkElement.appendChild(selectedText);
		selection.insertNode(linkElement);
		
		fechaModal();
	}else{
        document.querySelector('.prompt').classList.add('erro');
		document.querySelector('.err-msg').style.display = "block";
	}
}