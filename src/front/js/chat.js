
let mainurl = "https://chat-2ojp.onrender.com/";
let token = localStorage.getItem("token")?.trim();

const socket = io({
  query: {
    token: token,
  },
});

socket.emit("active", {
  token: token,
});

// socket.emit("disconnect", { token });
// socket.disconnect();

let name = localStorage.getItem("name")?.trim();
let username =localStorage.getItem("username")?.trim();

if (!token || !username) {
  window.location.pathname = "/login";
}

textInput.addEventListener("keydown", function (e) {
  if (e.shiftKey && e.keyCode === 13) {
    e.target.value = e.target.value + "\n";
    // console.log(e.target.value);

    e.preventDefault(); // Prevents the default behavior of adding a new line
  }
});

messageForm.onsubmit = async(e) => {
  e.preventDefault();
  let img = $("#messageFileUpload").files[0];
  if (textInput.value.trim()||img) {
    // console.log('hiiii');
    let data 
if (!img) {
  // console.log("hii");
  data= {
    senderUsername: username,
    receiverUsername: window.location.hash.split("#")[1],
    message: textInput.value.trim(),
  };
} else {

  let formData = new FormData();
  formData.append("img", img);
  formData.append("senderUsername", username);
  formData.append("receiverUsername", window.location.hash.split("#")[1]);
  formData.append("message", textInput.value.trim());

  // console.log( await img.arrayBuffer());
  
  const formDataJSON = {};
  for (const [key, value] of formData.entries()) {
    formDataJSON[key] = value;
  }
  data = formDataJSON;
  // console.log(data);
  // img=''
    }
      
    socket.emit("message1",
      data
    );


    textInput.value = "";
    desc.innerHTML = "";
  }
};

socket.on("hello", (data) => {
  // console.log(data);
  // mainChatsRender();
  
  messageMaker(data);
  hashDirector();
});
mainChatsRender();

function messageMaker(data, $usernamePath = "") {

  let dataUser = $usernamePath ? data[$usernamePath] : data;
  let message = createEl(
    "div",
    dataUser.username == username ? "our messages" : "their messages"
  );

  if (data.type == 'img') {
    let messageIn = createEl(
      "div",
      "message",
      `
      <img src="${data.path}" alt="${data.text}">

    ${data.text?`<p>${escapeHtml(data.text)}</p>`:''}
    `
    );
            message.appendChild(messageIn);

    
  } else {
    let messageIn = createEl("div", "message", escapeHtml(data.text));
            message.appendChild(messageIn);

  }
   
      
      
      let nameSpan = createEl(
        "span",
        "nameSpan",
        data.name == name ? "" : data.name
        );
        // messageIn.appendChild(nameSpan)
        
        chat.appendChild(message);
        
        scrollToBottom();
}

function scrollToBottom() {
  chat.scrollTop = chat.scrollHeight;
  rightClick();
}
scrollToBottom();

rightClick();

// textInput.focus();
textInput.addEventListener("blur", (e) => {
  // e.target.focus();
});

function rightClick() {
  $a(".message")?.forEach((el) => {
    el.oncontextmenu = function () {
      return false;
    };
  });
}

chatFocuser();

hashDirector();

// Search
$("#searchInput").addEventListener("focus", (e) => {
  searchResRen();
});

// Back Search
$("#searchIcon").addEventListener("click", (e) => {
  if (e.target.getAttribute("class").includes("fa-arrow-left")) {
    mainChatsRender();
  }
});

$("#searchInput").addEventListener("input", async (e) => {
  $(".searchRes").innerHTML = "";
  let data = await searchUsers(e.target.value);
  renderChats(data, ".searchRes");
  chatFocuser();
});

mainChatsRender();

chatFocuser();

async function mainChatsRender() {
  $(".searchRes").style.display = "none";
  $(".searchRes").innerHTML = "";
  $(".chats").style.display = "block";
  chatFocuser();
  $("#searchInput").value = "";
  $("#searchIcon").setAttribute("class", "fa-solid fa-magnifying-glass");
  renderChats(await getChats(username), ".chats");
} 

function searchResRen() {
  $("#searchIcon").setAttribute("class", "fa-solid fa-arrow-left");
  $(".chats").style.display = "none";
  $(".searchRes").style.display = "block";
}

window.addEventListener("hashchange", () => {
  hashDirector();
});



function renderChats(data, parent) {
  $(parent).innerHTML = "";
  data.forEach(async (el) => {
    let user = createEl(
      "div",
      "user",
      `<div id="user-${el.username}" class="img-users">
      </div>
    
              <div>
              <h6>${el.name}</h6>
              <span>${el.username}</span>
              </div>
              `
    );
    user.setAttribute("data-username", el.username);
    user.onclick = () => {
      window.location.hash = el.username;
    };
    $(parent).appendChild(user);
    await avaUser(`#user-${el.username}`,el.uuid) 
  });
}

async function searchUsers(arg) {
  if (arg.trim().length) {
    let users = await fetch("/search", {
      method: "POST",
      contentType: "application/json",
      body: JSON.stringify({
        text: arg,
        userToken: token,
      }),
    }).then((res) => res.json());
    return users;
  } else {
    return [];
  }
}

function chatFocuser() {
  $a(".user").forEach((e) => {
    e.addEventListener("click", (ev) => {
      window.location.hash = e.getAttribute("data-username");
      // hashDirector();
    });
  });
}

async function hashDirector() {
  if (window.location.hash.length > 1) {
    messageForm.classList.remove("chatNonActive");
    $(".chat-header").classList.remove("none");
    $(".chat-window").classList.add("active");
    $(".selectChat").classList.add("none");
    nameChanger(window.location.hash.split("#")[1]);
    // console.log(username);
    let data = await getMessages(username, window.location.hash.split("#")[1]);
    $a(".messages").forEach((e) => {
      e.remove();
    });
    // console.log(data);
    data.forEach((e) => {
      messageMaker(e, "sender");
    });

    $a(".user").forEach((e) => {
      if (
        window.location.hash.split("#")[1] == e.getAttribute("data-username")
      ) {
        e.classList.add("active-chat");
      } else {
        // console.log('hi');
        e.classList.remove("active-chat");
      }
    });
  } else {
    messageForm.classList.add("chatNonActive");
    $(".chat-header").classList.add("none");
    $a(".messages").forEach((e) => {
      e.remove();
    });
    $(".chat-window").classList.remove("active");
    $(".selectChat").classList.remove("none");
  }
}

async function getMessages(user1, user2) {
  let res = await fetch("/getMessages", {
    method: "POST",
    ContentType: "application/json",
    body: JSON.stringify({ user1, user2 }),
  });
  if (res.status == 200) {
    let data = await res.json();
    return data;
  } else {
    return [];
  }
}

async function getChats(username) {
  let res = await fetch("/getChats", {
    method: "POST",
    ContentType: "application/json",
    body: JSON.stringify({ username: username }),
  });
  if (res.status == 200) {
    let data = await res.json();
    // console.log(data);
    return data;
  }
}

function escapeHtml(unsafe) {
  return unsafe.replace(/[&<"']/g, function (match) {
    switch (match) {
      case "&":
        return "&amp;";
      case "<":
        return "&lt;";
      case '"':
        return "&quot;";
      default:
        return "&#039;";
    }
  });
}

async function nameChanger(username) {
  $(".chattingName").innerHTML = await getFetcher2(
    "getNameByUsername",
    username
  );
  $(".lastseen").innerHTML =await activeStatus(await getFetcher2("getActiveByUsername", username))
if ($(".lastseen").innerHTML.trim().toLowerCase() == "online") {
  $(".lastseen").style.color = "blue";
} else {
  $(".lastseen").style.color = "black";
}
}

async function activeStatus(data) {
 let time = data.split("")
  time.pop()
  time.shift()
  time = time.join('')

  let checkedTime = isValidDate(time)

  try {
    if (data == "online") {
      return data;
    } else if (checkedTime) {
      // console.log(getLastActiveTimestamp(checkedTime));
return getLastActiveTimestamp(checkedTime)
    }
  } catch (error) {
    return error.message;
  }
}

function isValidDate(dateString) {
  const dateObj = new Date(dateString);
  return dateObj instanceof Date && !isNaN(dateObj)?dateObj:false;
}

async function getFetcher2(url, arg) {
  let res = await fetch(`/${url}/` + arg);
  if (res.status == 200) {
    //   console.log(await res.text());
    let data = await res.text();
    return data;
  }
}

// Times

function getLastActiveTimestamp(lastActiveDate) {
  const now = new Date();
  const lastActive = new Date(lastActiveDate);

  const yearDiff = now.getFullYear() - lastActive.getFullYear();
  const monthDiff = now.getMonth() - lastActive.getMonth();
  const dayDiff = now.getDate() - lastActive.getDate();
  const hourDiff = now.getHours() - lastActive.getHours();
  const minuteDiff = now.getMinutes() - lastActive.getMinutes();

  // Check if the timestamp is from today
  if (yearDiff === 0 && monthDiff === 0 && dayDiff === 0) {
    return `${lastActive.getHours()}:${padZero(lastActive.getMinutes())}`;
  }

  // Format the timestamp as "year month day hour:minute"
  return `${lastActive.getFullYear()} year ${lastActive.getDate()}-${getMonthName(
    lastActive.getMonth()
  )} ${padZero(lastActive.getHours())}:${padZero(lastActive.getMinutes())}`;
}

function getMonthName(month) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[month];
}

function padZero(value) {
  return value.toString().padStart(2, "0");
}
async function avaUser(id, token = tokens) {
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