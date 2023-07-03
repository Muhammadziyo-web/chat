$("#form")?.addEventListener("submit", (e) => {
  let name = $('#nameInput')?.value ,
    userName = $('#userNameInput')?.value,
    password = $('#passwordInput')?.value;

  e.preventDefault();
  let data = {
    name: name,
    userName: userName,
    password: password,
 

  };
  async function fetchs() {
  
 let datas =  await fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
 })
    let res = await datas.json() 
    if (res?.status == 200) {
      localStorage.setItem('userName', res.uuid)
      localStorage.setItem('name', data.name)
      window.location = '/'
    } else {
      note.innerHTML = 'User name already exist'
    }
  }
  fetchs()
});


$("#login-form").addEventListener('submit', (e) => {
  e.preventDefault()
  let  userName = userNameLogin.value,
    password = passwordLogin.value;
  fetchs();
  async function fetchs() { 

    let data = {
      userName: userName,
      password: password,
    };

    let datas = await fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    let res = await datas.json();
    console.log(res);
    if (res?.status == 200) {
      localStorage.setItem("userName", res.uuid);
      localStorage.setItem("name", res.name);
      window.location = "/";
    } else {
      note2.innerHTML = "Wrong username or password ";
    }
  }
})

