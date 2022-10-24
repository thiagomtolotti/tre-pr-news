// Flash-Messages
//objeto JSON com os 'tipos' de modal
let flashMessages = JSON.parse('{ \
    "HTML": { \
       "tipo": "aviso", \
       "titulo" : "Edição bloqueada", \
       "texto": "A partir desse momento não é mais posível editar a newsletter" \
    }, \
    "Export": { \
       "tipo" : "sucesso", \
       "titulo" : "Conteúdo Exportado", \
       "texto" : "O conteúdo da newsletter foi exportado, basta colá-lo no seu provedor de email"\
    }, \
    "removeMateria": { \
       "tipo" : "sucesso", \
       "titulo" : "Matéria removida", \
       "texto" : "Matéria removida com sucesso"\
    }, \
    "notRemoveMateria": { \
       "tipo" : "erro", \
       "titulo" : "Não é possível remover a matéria", \
       "texto" : "Não há matérias a serem removidas"\
    }, \
    "addMateria": { \
       "tipo" : "sucesso", \
       "titulo" : "Matéria Adicionada", \
       "texto" : "Matéria adicionada com sucesso"\
    }, \
    "addImg": { \
        "tipo" : "sucesso",\
        "titulo" : "Imagem Adicionada",\
        "texto": "imagem adicionada com sucesso ao email"\
    },\
    "erroHTML" : { \
        "tipo" : "erro",\
        "titulo" : "Houve um erro inesperado",\
        "texto": "Houve um erro inesperado ao exportar o HTML, favor entrar em contato com a SCV"\
    },\
    "avisoLink" : { \
        "tipo": "aviso",\
        "titulo": "Não é possível adicionar o link", \
        "texto" : "Não é possível adicionar o link pois não há texto selecionado" \
    }, \
    "sucessoLink" : { \
        "tipo": "sucesso",\
        "titulo": "Link adicionado com sucesso", \
        "texto" : "O link foi adicionado com sucesso" \
    }, \
    "charLimit" : { \
        "tipo": "erro",\
        "titulo": "Limite de caracteres",\
        "texto": "Favor limitar o título a no máximo 30 caracteres"\
    } \
}')

class FlashMessage{
    constructor(flashCard){
        this.tipo = flashCard.tipo
        this.titulo = flashCard.titulo
        this.texto = flashCard.texto

        this.flash_message = document.createElement("div")

        this.render()
    }

    delete(){
        let container = document.querySelector(".flash-message-container")
        
        this.flash_message.classList.remove("show");
        this.flash_message.ontransitionend = function() {
            this.remove()
        }
    }

    render(){
        let container = document.querySelector(".flash-message-container")

        this.flash_message.classList.add("flash-message")
        this.flash_message.classList.add(this.tipo)

        this.flash_message.innerHTML = `<div class="barra-lateral"></div> \
        <div class="icon"></div> \
        <div class="conteudo"> \
            <h4>${this.titulo}</h4> \
            <p>${this.texto}</strong></p> \
        </div> \
        <div class="close-icon" onclick='document.querySelector(".flash-message-container").removeChild(this.parentNode)'></div>`

        container.insertAdjacentElement("beforeend", this.flash_message)
        setTimeout(()=>{this.flash_message.classList.add("show")}, 0)

        setTimeout(()=>{
            try{
                this.delete()
            }catch{}
        }, 7000)
    }
}