document.querySelector(".logoutBtn").addEventListener("click", (e) => {
  fetch("/logout", {
    method: "GET",
    redirect: "follow",
  }).then((res) => {
    if (res.redirected) {
      window.location.href = "/";
    }
  });
});
