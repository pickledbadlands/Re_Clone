// front user에게만 보이는 JS

const msgList = document.querySelector("ul");
const nickForm = document.querySelector("#nick");
const msgForm = document.querySelector("#msg");
// back-front connect 요청
const frontSocket = new WebSocket(`ws://${window.location.host}`);


function makeMessage(type, payload) {
    const msg = {type, payload}
    return JSON.stringify(msg); // object -> string
}

frontSocket.addEventListener("open", () => {
    console.log("connected browser 🍕");
});

frontSocket.addEventListener("message", (message) => {
    const li = document.createElement("li");
    li.innerHTML = message.data;
    msgList.append(li);
});

frontSocket.addEventListener("close", () => {
    console.log("disconnected! 🍳");
});


/* setTimeout(() => {
    frontSocket.send("hello from the browser 🍔");
}, 10000);
 */


function handleSubmit(e) {
    e.preventDefault();
    const input = msgForm.querySelector("input");
    frontSocket.send(makeMessage("new_msg", input.value));
    const li = document.createElement("li");
    li.innerText =`You: ${input.value}`;
    input.value = ""; // backend로 보내주고 비우기 ~
}

function handleNickSubmit(e) {
    e.preventDefault();
    const input = nickForm.querySelector("input");
    frontSocket.send(makeMessage("nickname", input.value));
    input.value = "";
}


msgForm.addEventListener("submit", handleSubmit);
nickForm.addEventListener("submit", handleNickSubmit);