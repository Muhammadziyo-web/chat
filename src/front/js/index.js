let tokens = localStorage.getItem("token").trim();

// (async () => {
// $("#customFile").value= await getFetcher("getImgByToken", tokens);
// })()

async function nameChanger() {
  await avaUser("#img-canvas");
  await avaUser("#img-edit");

  $("#offcanvasExampleLabel").innerHTML = await getFetcher(
    "getNameByToken",
    tokens
  );
  $("#offcanvasExampleLabel2").innerHTML = await getFetcher(
    "getUserNameByToken",
    tokens
  );

  $("#form12").value = await getFetcher("getNameByToken", tokens);
  $("#form13").value = await getFetcher("getUserNameByToken", tokens);
  $("#form14").value = await getFetcher("getNameByToken", tokens);
}
nameChanger();

$(".username-field").addEventListener("click", async (e) => {
  toast("Username copied to clipboard");
  navigator.clipboard.writeText(await getFetcher("getUserNameByToken", tokens));
});
$(".name-field").addEventListener("click", async (e) => {
  toast("name copied to clipboard");
  navigator.clipboard.writeText(await getFetcher("getNameByToken", tokens));
});

async function getFetcher(url, tokens) {
  let res = await fetch(`/${url}/` + tokens);
  if (res.status == 200) {
    //   console.log(await res.text());
    let data = await res.text();
    return data;
  }
}

$("#LogOut").addEventListener("click", () => {
  localStorage.clear();
  window.location.hash = "";
  window.location.pathname = "/login";
});

$("#userEditForm").addEventListener("submit", (e) => {
  e.preventDefault();
  editUser(tokens);
});

function toast(text) {
  $(".toastify")?.remove();
  $("body").appendChild(createEl("div", "toastify", text));
  setTimeout(() => {
    $(".toastify")?.remove();
  }, 2000);
}

async function avaUser(id,token=tokens) {
  if (await getFetcher("getImgByToken", token)) {
    $(id).innerHTML = `<img
        src="${await getFetcher("getImgByToken", token)}"
        alt="ava"
        />`;
  } else {
    $(id).innerHTML = `<span>${(
      await getFetcher("getNameByToken", token)
    ).substring(0, 1)}</span>`;
  }
}

async function editUser(token) {
  let img = $("#customFile").files[0];
  let name = $("#form12").value;
  let userName = $("#form13").value;
  let bio = $("#form14").value;

  let formData = new FormData();
  console.log(formData);
  formData.append("img", img);
  formData.append("name", name);
  formData.append("userName", userName);
  formData.append("bio", bio);

  let res = await fetch("/editUser/" + token, {
    method: "PUT",
    ContentType: "application/json",
    body: formData,
  });

  if (!res.ok) {
    let result = await res.text();
    $("#modalError").innerHTML = result;
  } else {
    let data =await res.json()
    localStorage.setItem("username",data.username)
    let modal = $("#exampleModal");
    let bootstrapModal = bootstrap.Modal.getInstance(modal);
    bootstrapModal.hide();
    $(".modal-backdrop").remove()
    nameChanger();
    avaUser("#img-canvas");
  }

}

// let img = $("#customFile");
