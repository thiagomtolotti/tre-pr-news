const main_container = document.querySelector('#container-main')
const outras_container = document.querySelector('#container-outras')

//classe abstrata para os métodos e variáveis comuns a todos os tipos de matéria
class Materia{
    constructor(){}

    renderedCallback(){
        new FlashMessage(flashMessages.addMateria)
    }

    allowRepositioning(){ 
        let initY, initMouseY;
        let mouseDown = false
        let materiaPos

        this.element.addEventListener("mousedown", (ev)=>{
            if(ev.target != this.element.querySelector('td')){
                if((ev.target.tagName == 'P' && ev.target.innerHTML != '') || ev.target.classList.contains("remove-btn")){
                    return
                }
            } 

            mouseDown = true
            this.element.classList.add('grab')
            
            //Determina a posição da materia selecionada no array de matérias
            materiaPos = Array.apply(null, document.querySelectorAll(".remove-materia")).indexOf(this.element)

            //Pega a posição do mouse na hora em que foi clicado
            initY = this.element.style.top.replace("px", "")

            initMouseY = ev.clientY - initY
        })
        this.element.addEventListener("mousemove", debounce((ev)=>{
            if(!mouseDown) return

            //move o elemento de acordo com o movimento
            this.element.style.top = (ev.clientY - initMouseY) + "px"
        },6))
        this.element.addEventListener("mouseup", (ev)=>{
            this.mouseOut(ev)
        })
        this.element.addEventListener("mouseleave", (ev)=>{
            this.mouseOut(ev)
        })

        this.mouseOut = (ev)=>{
            if(!mouseDown) return
            let finalY = this.element.getBoundingClientRect().top
            let outrasMaterias = document.querySelectorAll(".remove-materia");
            let finalPos
    
            //avalia se o usuário subiu ou desceu o item e então avalia os itens para baixo ou para cima dele
            if (this.element.style.top.replace("px", "") > 0) {
                for(let i = materiaPos; i < outrasMaterias.length; i++){
                    //somente verifica as matérias que não são a que foi movimentada
                    if(outrasMaterias[i] != this.element){
                        //se a matéria 'passou' a matéria sendo avaliada salva a posição dela, até que não tenha passado mais
                        if(finalY > outrasMaterias[i].getBoundingClientRect().top){
                            finalPos = i
                        }else{
                            break;
                        }
                    }
                }
                if(finalPos != undefined){
                    this.element.parentNode.insertBefore(this.element, outrasMaterias[finalPos].nextSibling)
                }
            }else{
                for(let i = materiaPos; i >= 0 ; i--){
                    //somente verifica as matérias que não são a que foi movimentada
                    if(outrasMaterias[i] != this.element){
                        //se a matéria 'passou' a matéria sendo avaliada salva a posição dela, até que não tenha passado mais
                        if(finalY < outrasMaterias[i].getBoundingClientRect().top){
                            finalPos = i;
                        }else{
                            break;
                        }
                    }
                }
                if(finalPos != undefined){
                    this.element.parentNode.insertBefore(this.element, outrasMaterias[finalPos])
                }
            }
    
            //reseta as variáveis
            mouseDown = false
            this.element.classList.remove('grab')
            this.element.style.top = "0px"
        }
    }

    addRemoveBtn(){
        let removeBtn

        this.element.addEventListener("mouseenter", debounce((ev)=>{
            removeBtn = document.createElement("td")
            removeBtn.classList.add("remove-btn")

            this.element.insertAdjacentElement('beforeend', removeBtn)

            removeBtn.addEventListener("click", ()=>{this.deleteMateria()})
        },50))
    
        this.element.addEventListener("mouseleave", debounce((ev)=>{
            removeBtn.remove()
        },50))
    }
    
    render(rendered){
        this.container.insertAdjacentElement("beforeend", this.element)
        setTimeout(()=>{this.element.classList.add('show')},0)

        this.allowRepositioning();
        this.addRemoveBtn();

        rendered();
    }

    deleteMateria(){
        let content = this.element.querySelectorAll(".titulo-materia, .texto-materia p")
        let isEmpty =  function(){
            for(let i = 0; i < content.length; i++){
                if(content[i].innerHTML != ''){
                    return false
                }
            }
            return true
        }
        let deleteMateria = function(){
            this.element.classList.remove('show')
            this.element.addEventListener("transitionend",()=>{
                this.element.remove();
            })
    
            //retira o elemento do array das materias
            this.constructor.allInstances.splice(this.constructor.allInstances.indexOf(this.element), 1)
            new FlashMessage(flashMessages.removeMateria)
        }.bind(this)

        if(!isEmpty()){
            new ConfirmModal(tiposModal.deleteMateria, ()=>{
                deleteMateria()
            })
        }else{
            deleteMateria()
        }

    }
}

function debounce(func, wait, immediate){
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

/* TODO
 - Animação dinâmica (descer ou subir as outras matérias enquanto arrasta)
*/