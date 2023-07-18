let token = localStorage.getItem("token")?.trim();
let name = localStorage.getItem("name")?.trim();
let username = localStorage.getItem("username")?.trim();

if (token && username) {
  window.location.pathname = "/";
}

$("#form")?.addEventListener("submit", (e) => {
  let name = $("#nameInput")?.value,
    userName = $("#userNameInput")?.value,
    password = $("#passwordInput")?.value;

  e.preventDefault();
  let data = {
    name,
    userName,
    password,
  };
  async function fetchs() {
    console.log(data);
    let datas = await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (datas?.status == 200) {
      let res = await datas.json();
      // console.log(datas.status);
      // console.log(res);
      localStorage.setItem("token", res.uuid);
      localStorage.setItem("username", res.username);
      localStorage.setItem("name", res.name);
      window.location = "/";
    } else {
    //   console.log(
    // datas.json()
    //   );
     datas= await datas.json();
      // console.log();
      console.log(datas);
    note.innerHTML = (await datas).err;
    }
  }
  fetchs();
});

$("#login-form")?.addEventListener("submit", (e) => {
  e.preventDefault();
  let userName = userNameLogin.value,
    password = passwordLogin.value;
  fetchs();
  async function fetchs() {
    let data = {
      username: userName,
      password: password,
    };

    let datas = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (datas?.status == 200) {
      let res = await datas.json();
      localStorage.setItem("username", res.username);
      localStorage.setItem("token", res.uuid);
      localStorage.setItem("name", res.name);
      window.location = "/";
    } else {
      note2.innerHTML = "Wrong username or password ";
    }
  }
});
