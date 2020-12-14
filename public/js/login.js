document.querySelector(".logoutBtn").addEventListener("click", async (e) => {
  e.preventDefault();

  let res = await fetch("/logout", {
    method: "GET",
    redirect: "follow",
  });

  if (res.redirected) {
    return (document.location.href = "/");
  } else {
    //TODO:Incluir mensagem caso o server estar abaixo
  }
});
