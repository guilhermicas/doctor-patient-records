document.querySelector(".logoutBtn").addEventListener("click", async (e) => {
  e.preventDefault();
  console.log("LOGGIN OUT");
  let res = await fetch("/logout", {
    method: "GET",
    redirect: "follow",
  });

  if (res.redirected) {
    document.location.href = "/";
  }
});
