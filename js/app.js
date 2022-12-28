
//Carregar dados dos produtos (AJAX)

var ajax = new XMLHttpRequest();

ajax.open("GET", "./dados.json", true);

ajax.send();

ajax.onreadystatechange = function(){

    var conteudo = document.getElementById("conteudo");

    if(ajax.readyState == 4 && ajax.status == 200){

        var data = ajax.responseText;

        var data_json = JSON.parse(data);

        //Caso não tenha produtos no JSON mostra uma mensagem
        if(data_json.length == 0){

            conteudo.innerHTML = '<div class="alert alert-warning" role="alert">Não há produtos cadastrados no sistema!</div>';

        //Tendo produtos, vamos processar a renderização
        }else{

            var html_conteudo = "";
            
            for(var i =0; i < data_json.length; i++)
            {
                html_conteudo += '<div class="col-12"><h2 class="categoria">'+data_json[i].categoria+'</h2></div>';

                if(data_json[i].produtos.length == 0){

                    html_conteudo += '<div class="col-lg-12"><div class="alert alert-warning" role="alert">Não há produtos cadastrados nesta categoria</div></div>';

                }else{

                    for(var j = 0; j < data_json[i].produtos.length; j++)
                    {
                        html_conteudo += card_produto(data_json[i].produtos[j].titulo,data_json[i].produtos[j].descricao,data_json[i].produtos[j].imagem,data_json[i].produtos[j].url_compra,data_json[i].produtos[j].html_amostra);
                    }

                }

            }
            cache_dinamico(data_json);
            conteudo.innerHTML = html_conteudo;
        }

    }

}

//Template Engine
var card_produto = function (titulo, descricao, imagem, url_compra, html_amostra){

    var html_modal = '<p><strong>Descrição:</strong>'+descricao+'</p><hr><p><strong>Amostra:</strong></p>'+html_amostra;

    var html ='<div class="col-lg-3 col-md-4 col-6 mb-3">'+
                '<div class="card">'+
                    '<img src="'+imagem+'" class="card-img-top" alt="Foto do produtos">'+
                    '<div class="card-body">'+
                    '<h5 class="card-title">'+titulo+'</h5>'+
                    '<div class="d-grid gap-2">'+
                        '<a href="#" data-bs-toggle="modal" onClick="javascript:dadosModal(\''+titulo+'\',\''+html_modal+'\',\''+url_compra+'\');" data-bs-target="#amostraProduto" class="btn btn-amostra btAmostra">Amostra</a>'+
                        '<a href="'+url_compra+'" target="_blank" class="btn btn-comprarProduto">Comprar produtos</a>'+
                    '</div>'+
                    '</div>'+
                '</div>'+
                '</div>';

    return html;

}

//Alterar Modal

var dadosModal = function(titulo, html_amostra, url_compra){

    var tituloHTML = document.getElementById("tituloProduto");
    var corpoHTML = document.getElementById("corpoModal");
    var btComprarModal = document.getElementById("btComprarModal");

    tituloHTML.innerHTML = titulo;
    corpoHTML.innerHTML = html_amostra;

    btComprarModal.setAttribute('href', url_compra);

}

//Cache Dinâmico

var cache_dinamico = function(data_json){

    if('caches' in window){

        caches.delete('produtos-app-dinamico').then(function(){
            console.log("Deletando cache antigo");
        });

        caches.open('produtos-app-dinamico').then(function(cache){

            if(data_json.length > 0){

                var arquivos_dinamicos = ['dados.json'];

                for(var i =0; i < data_json.length; i++){

                    for(var j = 0; j < data_json[i].produtos.length; j++){

                        if(arquivos_dinamicos.indexOf(data_json[i].produtos[j].imagem) == -1){
                            arquivos_dinamicos.push(data_json[i].produtos[j].imagem);
                        }

                    }

                }
            }

            cache.addAll(arquivos_dinamicos).then(function(){
                console.log("Cache dinâmico criado com sucesso!");
            });
        });
    }
}

//Botão de Instalação

let disparoInstalacao = null;
const btInstalar = document.getElementById("btInstalar");

let inicializarInstalacao = function(){

    btInstalar.removeAttribute("hidden");
    btInstalar.addEventListener("click", function(){

        disparoInstalacao.prompt();

        disparoInstalacao.userChoice.then((choice) => {

            if(choice.outcome === 'accepted'){
                console.log("Usuário aceitou a instalação");
            }else{
                console.log("Usuário NÃO aceitou a instalação");
            }

        });

    });

}

window.addEventListener('beforeinstallprompt', (evt) => {

    disparoInstalacao = evt;

});

