// Arquivo para o Javascript de uma barra de ferramentas 'inteligente'

document.querySelectorAll('.outra-materia-container').forEach((materia)=>{
    let initX, initY, initMouseX, initMouseY;
    let mouseDown = false
    let materiaPos

    materia.addEventListener("mousedown", (ev)=>{
        mouseDown = true
        materia.style.position = "relative"
        for(let i = 0; i < document.getElementsByClassName('outra-materia-container').length; i++){
            if(document.getElementsByClassName('outra-materia-container')[i] == materia){
                materiaPos = i;
                break;
            } 
        }

        //Pega a posição do mouse na hora em que foi clicado
        initY = materia.style.top.replace("px", "")

        initMouseY = ev.clientY - initY

        document.querySelectorAll("*").forEach((el)=>{
            el.style.userSelect = "none"
        })
    })
    document.addEventListener("mousemove", debounce((ev)=>{
        if(!mouseDown) return

        //move o elemento de acordo com o movimento
        let currY = ev.clientY;

        let deltaY = (currY - initMouseY)

        materia.style.top = deltaY + "px"
    }, 5))
    materia.addEventListener("mouseup", (ev)=>{
        let finalY = materia.getBoundingClientRect().top
        let outrasMaterias = document.querySelectorAll(".outra-materia-container");
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
            console.log(finalPos)
            if(finalPos != undefined){
                materia.parentNode.insertBefore(materia, outrasMaterias[finalPos])
            }
        }


        //reseta as variáveis
        mouseDown = false
        document.querySelectorAll("*").forEach((el)=>{
            el.style.userSelect = "auto"
        })
        materia.style.position = "static"
        materia.style.top = "0px"
    })
})

function debounce(func, wait, immediate) {
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