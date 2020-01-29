function connect_chat() {
    // WebSocket connection

    Socket = new WebSocket(`wss://repl-chat.p3tray.repl.co?sessionId=${SessionId}`, config.wsProtocol)

    // WebSocket events

    Socket.onopen = () => {
        // Event listeners

        chat_listeners()

        // Display

        document.getElementById("repl_chat").style.display = "block"
    }

    Socket.onmessage = ws_message

    Socket.onclose = event => {
        if (event.code == 1000 && event.reason == "failed") {
            // Prompt login
            
            location.replace("https://repl-chat.p3tray.repl.co/login")
        } else {
            // WebSocket close message (probably an error)

            while (document.body.firstChild) {
                document.body.firstChild.remove()
            }

            if (event.reason) {
                document.body.appendChild(error(event.reason))
            } else {
                document.body.appendChild(error("ERROR: WEBSOCKET CONNECTION FAILED"))
            }
        }
    }

    Socket.onerror = error => {
        // WebSocket connection fail

        while (document.body.firstChild) {
            document.body.firstChild.remove()
        }

        document.body.appendChild(error("ERROR: WEBSOCKET CONNECTION FAILED"))
    }
}

function ws_message(message) {
    // Parse data

    const type = message.data.substr(0, message.data.indexOf("|"))
    const content = message.data.substr(message.data.indexOf("|") + 1)

    // Types

    if (type == "init") {
        // Client init

        init(content)
    } else if (type == "online") {
        // Update online

        update_online(content)

        // Notification

        notify()
    } else if (type == "status") {
        // Display special status message

        status_message(content)

        // Notification

        notify()
    } else if (type == "message") {
        // Display message

        display_message(content)

        // Notification

        notify()
    }
}

function notify() {
    if (self !== top) {
        parent.postMessage("message", "https://repl.it")
    }
}

function init(data) {
    // Parse data

    const username = data.substr(0, data.indexOf("|"))
    const pfp = data.substr(data.indexOf("|") + 1)

    // Init

    Username = username
    document.getElementById("pfp").src = pfp
}

function update_online(data) {

}

function status_message(data) {

}

function display_message(data) {
    
}