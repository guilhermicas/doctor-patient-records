let btnSubmit = document.querySelector(".submit");
let formElement = document.querySelector(".form");

btnSubmit.addEventListener("click", async (e) => {
  e.preventDefault();
  //TODO: Frontend validation
  //Dados do form
  const data = new URLSearchParams(new FormData(formElement));

  let response = await fetch("/registo", {
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