async function carregarPacientes(elem) {
  let idCategoria = elem.srcElement.id;
  window.location.pathname = "/pacientes/c/" + idCategoria;
}

async function carregarCategorias() {
  let div_container_categorias = document.querySelector(".container-items");
  div_container_categorias.innerHTML = "";

  let res = await fetch("/buscarCategorias");

  if (res.ok) {
    res = await res.json();
    for (categoria of res) {
      let newCategoria = document.createElement("div");
      newCategoria.className = "item";
      newCategoria.style = "background-color:" + categoria.cor + ";";
      newCategoria.id = categoria.categoria_id;
      newCategoria.addEventListener("click", carregarPacientes);

      let newParagrafo = document.createElement("p");
      newParagrafo.className = "titulo-categoria";
      newParagrafo.innerText = categoria.titulo;

      newCategoria.appendChild(newParagrafo);
      div_container_categorias.appendChild(newCategoria);
    }
  } else {
    alert("Ocorreu algum erro");
  }
}

document
  .querySelector(".categoriaSubmit")
  .addEventListener("click", async (e) => {
    e.preventDefault();

    //Dados para inserir categoria
    let formElement = document.querySelector(".formCategoria");
    const data = new URLSearchParams(new FormData(formElement));

    let response = await fetch("/categorias", {
      method: "POST",
      body: data,
    });

    let msg = await response.json();
    msg = msg.message;

    switch (response.status) {
      case 201:
        carregarCategorias();
        //Atualizar div com as categorias, se calhar em vez de passar as categorias pelo PUG, alterar para formato API para poder atualizar o div sem ter de re entrar na página
        alert(msg);
        break;
      case 409:
        alert(msg);
        break;
      default:
        alert(msg);
    }
  });

//Cria uma tabela com os clientes de uma categoria em especifico
//Ao clicar num div, fazer um fetch com o id da categoria a /buscarPacientes e os pacientes que devolver, listar numa tabela

//Buscar pacientes da categoria ao clicar em div
carregarCategorias();
