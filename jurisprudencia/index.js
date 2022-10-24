let btnInformativo = document.querySelector(".final .link-mailto")

document.querySelector("#link-informativo").onclick = (()=>{
    new InputModal(tiposModal.addImg, ()=>{
        
        let link = document.getElementById('modal-input').value;

        if(link.startsWith("https://www.tre-pr.jus.br") || link.startsWith("www.tre-pr.jus.br") || link.startsWith("tre-pr.jus.br")){
            btnInformativo.href = link
            new FlashMessage(flashMessages.sucessoLink)
            return true
        }else{
            document.querySelector('.prompt').classList.add('erro');
            document.querySelector('.error-msg').style.display = "block";
        }
    })
})