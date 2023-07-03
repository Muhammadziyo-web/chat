const socket = io();

let userName = localStorage.getItem("userName")?.trim();
let name = localStorage.getItem("name")?.trim();
console.log(userName);
if (!userName) {
  window.location.pathname = "/login";
}

messageForm.onsubmit = (e) => {
  e.preventDefault();
  if (textInput.value.trim()) {
    socket.emit("message1", { name: name, text: textInput.value.trim(),uuid:userName });
    textInput.value = "";
    desc.innerHTML = "";
  }
};

socket.on("hello", (data) => {
    console.log(data);
    messageMaker(data)
});


function messageMaker (data) {
    let message = createEl(
      "div",
      data.uuid == userName ? "our messages" : "their messages"
  );
  let messageIn = createEl('div','message',data.text)
    let nameSpan = createEl(
      "span",
      "nameSpan",
      data.name == name ? "" : data.name
    );
    messageIn.appendChild(nameSpan)
    message.appendChild(messageIn)

    chat.appendChild(message);

    scrollToBottom();
}

function scrollToBottom() {
  chat.scrollTop = chat.scrollHeight;
  rightClick()
}
scrollToBottom();

  rightClick();

textInput.focus();
textInput.addEventListener("blur", (e) => {
  e.target.focus();
});

function rightClick() {
  // console.log($a('.message'));
$a(".message")?.forEach((el) => {
    console.log("asd");
    el.oncontextmenu = function () {
      console.log("hello");
      return false;
    };
  });
}