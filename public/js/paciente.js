async function eliminarPaciente() {
  let idPaciente = document.querySelector(".idPaciente").innerText;
  let res = await fetch("/paciente/" + idPaciente, {
    method: "delete",
  });

  let status = res.status;
  res = await res.json();
  console.log(res);
  alert(res.msg);

  switch (status) {
    case 200:
      window.location.href = "/pacientes";
      break;
    case 500:
      alert(res.err);
  }
  alert("Eliminando");
}
