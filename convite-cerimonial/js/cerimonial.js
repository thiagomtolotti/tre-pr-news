const NON_DIGITABLE_KEYS = ['Control', 'Shift', 'Tab', 'CapsLock', 'PageDown', 'PageUp', 'Home', 'End', 'Delete', 'Insert', 'NumLock', 'ScrollLock', 'Pause', 'AltGraph', 'Alt', 'Meta', 'F1', 'F2', 'F3', 'F4', 'F5', 'F6', 'F7', 'F8', 'F9', 'F10', 'F11', 'F12', 'Escape']

class ModalEmail extends Modal{
    constructor(tipo, callback){
        super(tipo, callback)

        this.titulo = tipo.titulo
        this.msg = tipo.msg

        this.render()
        Modal.isOpen = true
    }

    render(){
        this.overlay.classList.add("overlay");
		this.overlay.dataset.export = "false"
		this.modal.classList.add('prompt')
		this.modal.classList.add('email')
		this.modal.dataset.export = "false"

		this.modal.insertAdjacentHTML('afterbegin', `\
		<div class="content"> \
			<h3>Email de confirmação de presença</h3> \
			<p>Adicione o título e o corpo do texto, o destinatário padrão é <strong>cerimonial@tre-pr.jus.br</strong></p> \
		</div> \
		<div class="content"> \
			<div> \
				<label for="subject">Assunto</label> \
				<input type="text" id="subject"> \
				<p class="error-msg">Campo assunto não pode estar vazio</p>\
			</div> \
			<div> \
				<label for="text-content">Corpo do texto</label> \
				<textarea id="text-content" rows="10"></textarea> \
				<p class="error-msg">O texto do email não pode estar vazio</p>\
			</div> \
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

//Adiciona um modal para criar um email
function addEmail(){
    let email = {
        titulo : "Email de confirmação de presença",
        msg: "Adicione o título e o corpo do texto, o destinatário padrão é <strong>cerimonial@tre-pr.jus.br</strong>"
    }

    new ModalEmail(email, ()=>{
        //Valida se os campos estão preenchidos
        let subject = document.querySelector('.prompt input');
        let text = document.querySelector('.prompt textarea');

        // BUG: Sempre cai nesse if
        if(subject.value == '' || text.value == ''){
            //Adiciona o 'status de erro'
            if(subject.value == ''){
                subject.parentElement.classList.add('erro')
            }
            if(text.value == ''){
                text.parentElement.classList.add('erro')
            }
            return false
        }

        //cria a URL com as infos
        //https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Reference/Global_Objects/encodeURI
        let link = encodeURI(`mailto:cerimonial@tre-pr.jus.br?subject=${subject.value}&body=${text.value}`);
        
        //adiciona a URL no botão e no email inferior
        document.querySelectorAll('.link-mailto').forEach((element) =>{
            element.setAttribute('href', link);
        })

        //permite ao usuário exportar o HTML
        document.querySelector('#btn-export').classList.remove('greyed');
        return true
    })
}

document.querySelector('h1').addEventListener("keypress", (e)=>{
    let innerText = e.target.innerText.split('')

    if(NON_DIGITABLE_KEYS.indexOf(e.key) == -1){
        if(innerText.length >= 30){
            e.preventDefault()    
            new FlashMessage(flashMessages.charLimit)
            return
        }
    }
})