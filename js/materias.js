const main_container = document.querySelector('#container-main')
const outras_container = document.querySelector('#container-outras')

//TODO: esses objetos estão obsoletos mas ainda não consegui remover a necessidade deles (melhorar os modais)
const main = {
    msg: "Há conteúdo na matéria sendo excluída, deseja continuar mesmo assim?",
}

//classe abstrata para os métodos e variáveis comuns a todos os tipos de matéria
class Materia{
    constructor(){}

    renderedCallback(){
        new FlashMessage(flashMessages.addMateria)
    }

    //BUG: Reaplica os eventListeners em TODAS as instâncias das matérias toda vez que uma nova matéria é criada, fazer aplicar apenas a que foi criada
    //BUG: não entende o 'mouseup' as vezes 
    //BUG: GRAVE: Não é possível selecionar para colocar os links pois o modal se movimenta
    allowRepositioning(){
        document.querySelectorAll('.remove-materia').forEach((materia)=>{
            let initY, initMouseY;
            let mouseDown = false
            let materiaPos
    
            materia.addEventListener("mousedown", (ev)=>{
                mouseDown = true
    
                materia.style.position = "relative"
                
                //Determina a posição da materia selecionada no array de matérias
                materiaPos = Array.apply(null, document.querySelectorAll(".remove-materia")).indexOf(materia)
    
                //Pega a posição do mouse na hora em que foi clicado
                initY = materia.style.top.replace("px", "")
    
                initMouseY = ev.clientY - initY
    
                document.querySelectorAll("*").forEach((el)=>{
                    el.style.userSelect = "none"
                })
            })
            document.addEventListener("mousemove", (ev)=>{
                if(!mouseDown) return
    
                //move o elemento de acordo com o movimento
                let currY = ev.clientY;
    
                let deltaY = (currY - initMouseY)
    
                materia.style.top = deltaY + "px"
            })
            materia.addEventListener("mouseup", (ev)=>{
                let finalY = materia.getBoundingClientRect().top
                let outrasMaterias = document.querySelectorAll(".remove-materia");
                let finalPos
    
                //avalia se o usuário subiu ou desceu o item e então avalia os itens para baixo ou para cima dele
                if (materia.style.top.replace("px", "") > 0) { //MELHORIA: materia.style.top parece sensível, tentar colocar o delta
                    for(let i = materiaPos; i < outrasMaterias.length; i++){
                        //somente verifica as matérias que não são a que foi movimentada
                        if(outrasMaterias[i] != materia){
                            //se a matéria 'passou' a matéria sendo avaliada salva a posição dela, até que não tenha passado mais
                            if(finalY > outrasMaterias[i].getBoundingClientRect().top){
                                finalPos = i
                            }else{
                                break;
                            }
                        }
                    }
                    if(finalPos != undefined){
                        materia.parentNode.insertBefore(materia, outrasMaterias[finalPos].nextSibling)
                    }
                }else{
                    for(let i = materiaPos; i >= 0 ; i--){
                        //somente verifica as matérias que não são a que foi movimentada
                        if(outrasMaterias[i] != materia){
                            //se a matéria 'passou' a matéria sendo avaliada salva a posição dela, até que não tenha passado mais
                            if(finalY < outrasMaterias[i].getBoundingClientRect().top){
                                finalPos = i;
                            }else{
                                break;
                            }
                        }
                    }
                    if(finalPos != undefined){
                        materia.parentNode.insertBefore(materia, outrasMaterias[finalPos])
                    }
                }
    
    
                //reseta as variáveis
                mouseDown = false
                document.querySelectorAll("*").forEach((el)=>{
                    el.style.userSelect = "auto"
                })
                materia.style.position = "relative"
                materia.style.top = "0px"
            })
        })
    }

    addRemoveBtn(){
        document.querySelectorAll(".remove-materia").forEach((materia)=>{
            materia.addEventListener("mouseenter", this.debounce((ev)=>{
                let removeBtn = `<td class="remove-btn" onclick="achaElemento(this.parentNode).deleteMateria()"></td>`
                materia.insertAdjacentHTML('beforeend', removeBtn)
            },50))
    
            materia.addEventListener("mouseleave", this.debounce((ev)=>{
                let removeBtn = materia.querySelector('.remove-btn')
    
                removeBtn.remove()
            },50))
        })
    }

    debounce(func, wait, immediate){
        var timeout;
        
        return function executedFunction() {
            var context = this;
            var args = arguments;
        
            var later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
        
            var callNow = immediate && !timeout;
        
            clearTimeout(timeout);
        
            timeout = setTimeout(later, wait);
        
            if (callNow) func.apply(context, args);
        };
    };
    
    render(rendered){
        this.container.insertAdjacentElement("beforeend", this.element)

        this.allowRepositioning();
        this.addRemoveBtn();

        rendered();
    }

    //BUG: Verificar se tem conteúdo (como callback faz a função em si)
    deleteMateria(){
        this.element.remove();

        //retira o elemento do array das materias
        this.constructor.allInstances.splice(this.constructor.allInstances.indexOf(achaElemento(this.element)), 1)
        new FlashMessage(flashMessages.removeMateria)
    }
}

class MateriaMain extends Materia{
    constructor(){
        super();

        MateriaMain.allInstances.push(this)

        this.container = main_container;

        this.element = document.createElement("tr")
        this.element.classList.add('main-materia-container');
        this.element.classList.add('remove-materia');
        this.element.insertAdjacentHTML("afterbegin", ` \
            <td style="padding: 20px 20px 0;"> \
                <p class="titulo-materia" contenteditable placeholder="Título da matéria"></p> \
                <hr> \
                <div class="texto-materia" contenteditable> \
                    <p placeholder="Texto da matéria"></p> \
                </div> \
            </td>`)

        this.render(this.renderedCallback)
    }
}

class OutraMateria extends Materia{
    constructor(){
        super();

        OutraMateria.allInstances.push(this)

        this.container = outras_container

        this.element = document.createElement("tr")
        this.element.classList.add('outra-materia-container');
        this.element.classList.add('remove-materia');
        this.element.insertAdjacentHTML("afterbegin", ` \
            <td style="padding: 20px 20px 0;"> \
                <div class="outra-materia"> \
                    <p class="titulo-materia outro" contenteditable placeholder="Título da Matéria"></p> \
                    <div class="texto-materia" contenteditable=""> \
                        <p placeholder="Gravata da matéria"></p> \
                    </div> \
                </div> \
            </td>`)
        
        this.render(this.renderedCallback);
    }
}

//arrays com todas as matérias (necessárias para pegar a referência do objeto na hora de deletar matérias)
OutraMateria.allInstances = []
MateriaMain.allInstances = []

function achaElemento(element){
    if(element.classList.contains("outra-materia-container")){
        for(let i = 0; i < OutraMateria.allInstances.length; i++){
            if(OutraMateria.allInstances[i].element == element){
                return OutraMateria.allInstances[i]
            }
        }
    }else{
        console.log('aa')
        for(let i = 0; i < MateriaMain.allInstances.length; i++){
            if(MateriaMain.allInstances[i].element == element){
                console.log(MateriaMain.allInstances[i])
                return MateriaMain.allInstances[i]
            }
        }
    }
}

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
    }\
}')

//BUG: CSS: Container dos modais bloqueia a edição pois 'fica na frente'
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

/* TODO
 - Bloquear movimentação após exportar o HTML
 - Animação dinâmica (descer ou subir as outras matérias enquanto arrasta)
*/