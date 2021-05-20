document.querySelector(".submit").addEventListener("click", async (e) => {
  e.preventDefault();
  let formElement = document.querySelector(".form");
  //TODO: Frontend validation
  //Dados do form
  const data = new URLSearchParams(new FormData(formElement));

  let response = await fetch("/paciente", {
    method: "POST",
    body: data,
  });

  let msg = await response.json();
  msg = msg.message;

  //TODO: Dependendo no status, mostrar ao user corretamente
  switch (response.status) {
    case 201:
      alert(msg);
      break;
    case 409:
      alert(msg);
      break;
    default:
      alert(msg);
  }
});

async function carregarCategorias() {
  let lst = await fetch("/buscarCategorias");

  let containerCategorias = document.querySelector(".container-categorias");

  if (lst.ok) {
    lst = await lst.json();
    console.log(lst);
    for (cat of lst) {
      let newCat = document.createElement("div");
      let newCatNome = document.createElement("p");
      newCatNome.innerText = cat.titulo;
      newCat.appendChild(newCatNome);

      containerCategorias.appendChild(newCat);
    }
  } else {
    alert("Ocorreu algum erro a obter as categorias");
  }
}

carregarCategorias();
