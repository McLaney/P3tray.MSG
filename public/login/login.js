document.addEventListener("DOMContentLoaded", () => {
    // Check if iframe or browser

    const repl_auth = document.getElementById("repl_auth")
    if (self !== top) {
        repl_auth.className = "loginEmbed"
    } else {
        repl_auth.className = "loginBrowser"
    }
})

function auth_request() {
    // Request to server

    request("https://repl-chat.p3tray.repl.co", "auth").then(result => {
        if (result != "failed") {
            // Session id data

            localStorage.sessionId = result
            location.replace("https://repl-chat.p3tray.repl.co")
        } else {
            // Error message

            while (document.body.firstChild) {
                document.body.firstChild.remove()
            }

            document.body.appendChild(error("ERROR WHEN AUTHENTICATING"))
        }
    }).catch(error => {
        throw error
    })
}