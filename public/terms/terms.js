// Stuff

let SessionId = localStorage.sessionId
let Username

let Socket
let PrevMsgSender

// When document is loaded...

document.addEventListener("DOMContentLoaded", () => {
    // Check embed

    if (self !== top) {
        // Embed

        document.getElementById("repl_chat").className = "replChatEmbed"
    } else {
        // Special browser client classes

        document.getElementById("repl_chat").className = "replChatBrowser"
        document.getElementById("close_chat").style.display = "none"
        document.getElementById("online").classList.add("onlineBrowser")
    }
})