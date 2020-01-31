function chat_listeners() {
    // Elements

    const close_chat = document.getElementById("close_chat")

    const pfp = document.getElementById("pfp")
    const menu = document.getElementById("menu")
    const logout = document.getElementById("logout")

    const online_status = document.getElementById("online_status")
    const chat = document.getElementById("chat")
    const online = document.getElementById("online")
    const back = document.getElementById("back")
    const messages_wrapper = document.getElementById("messages_wrapper")

    const input = document.getElementById("input")

    // Event listeners

    close_chat.addEventListener("click", event => {
        if (event.isTrusted && self !== top) {
            // Close window
            console.log("Close window")
            parent.postMessage("close", "*")
        } else {
            console.log("ERROR: Couldn't close window")
        }
    })

    pfp.addEventListener("click", event => {
        if (event.isTrusted) {
            // Toggle menu

            if (menu.style.display == "block") {
                menu.removeAttribute("style")
            } else {
                menu.style.display = "block"
            }
        }
    })

    //Logout menu button

    logout.addEventListener("click", event => {
        if (event.isTrusted) {
            // Request logout

            request(config.server, `logout|${SessionId}`).then(result => {
                if (result == "success") {
                    // Redirect to login

                    delete localStorage.sessionId
                    location.replace("https://repl-chat.p3tray.repl.co/login")
                } else {
                    // Error when logging out (should never happen)

                    logout.innerText = "ERROR"
                    setTimeout(() => {
                        logout.innerText = "Logout"
                    }, 500)
                }
            })
        }
    })

    //Settings menu button

    settings.addEventListener("click", event => {
        if (event.isTrusted) {
            // Go to settings page

            location.replace("https://repl-chat.p3tray.repl.co/settings")
        }
    })

    terms.addEventListener("click", event => {
        if (event.isTrusted) {
            // Go to terms and conditions page

            location.replace("https://repl-chat.p3tray.repl.co/")
        }
    })

    online_status.addEventListener("click", event => {
        if (event.isTrusted) {
            // Toggle online

            if (online.style.display == "flex") {
                online.style.display = "none"
                chat.style.display = "block"
                messages_wrapper.scrollTo(0, messages.scrollHeight)
            } else {
                chat.style.display = "none"
                online.style.display = "flex"
            }
        }
    })

    input.onchange = () => {
        if (input.value.includes("⼁")) {
            input.value = input.value.replace("⼁", "")
        }
    }

    input.addEventListener("keypress", event => {
        if (event.isTrusted && event.keyCode == 13 && input.value && input.value.trim()) {
            Socket.send(`message|${input.value.trim()}`)
            input.value = ""
        }
    })
}