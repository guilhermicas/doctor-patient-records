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
