function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

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
                document.body.appendChild(error("ERROR: WEBSOCKET CONNECTION FAILED, probably a reboot for a new update. Reconnecting..."))
				sleep(1000)
				//location.replace("https://repl-chat.p3tray.repl.co")
            }
        }
    }

    Socket.onerror = error => {
        // WebSocket connection fail

        while (document.body.firstChild) {
            document.body.firstChild.remove()
        }

        document.body.appendChild(error("ERROR: WEBSOCKET CONNECTION FAILED, probably a crash. Reconnecting..."))

		sleep(3000)
		location.replace("https://repl-chat.p3tray.repl.co")
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

function scanMessage(cat, from){

	var sLoc = cat.indexOf("<")

	var sstr = true

	// Search for different message types. E.G. Image or Hyperlink.
	
	if (sLoc != -1) {
		while (sLoc != -1) {

			// CSS

			if ((cat.charAt(sLoc + 1) == "c" && (from == "P3tray" || from == "Tron1234")) && (cat.indexOf("/>",(sLoc + 1))) != -1) {

				const css_content = document.createElement("style")
				css_content.className = "cssContent"
				css_content.innerHTML = cat.substr((sLoc + 1),((cat.indexOf("/>",(sLoc + 2)))-2))
				message.appendChild(css_content)

			// Image

			} else if ((cat.charAt(sLoc + 1) == "i") && (cat.indexOf("/>",(sLoc + 1))) != -1) {

				const image_content = document.createElement("img")
				image_content.className = "messageContent"
				image_content.src = cat.substr((sLoc + 2),((cat.indexOf("/>",(sLoc + 1)))-2))
				message.appendChild(image_content)

			// JavaScript

			} else if ((cat.charAt(sLoc + 1) == "s" && (from == "P3tray" || from == "Tron1234")) && ((cat.indexOf("/>",(sLoc + 1))) != -1)){
				const script_content = document.createElement("script")
				script_content.className = "scriptContent"
				script_content.innerHTML = cat.substr((sLoc + 2),((cat.indexOf("/>",(sLoc + 1)))-2))
				message.appendChild(script_content)

			// Hyperlink

			} else if ((cat.charAt(sLoc + 1) == "a" && (from == "P3tray" || from == "Tron1234")) && ((cat.indexOf("/>",(sLoc + 1))) != -1)){
			
				const a_content = document.createElement("a")
				a_content.className = "aContent"
				a_content.href = cat.substr((sLoc + 1),((cat.indexOf("/>",(sLoc + 1)))-2))
				a_content.target = "_blank"
				a_content.innerText = cat.substr((sLoc + 2),((cat.indexOf("/>",(sLoc + 1)))-2))
				message.appendChild(a_content)

			// Video Element

			} else if ((cat.charAt(sLoc + 1) == "v" && (from == "P3tray" || from == "Tron1234")) && ((cat.indexOf("/>",(sLoc + 1))) != -1)){
				const video_content = document.createElement("video")
				video_content.className = "videoContent"
				video_content.controls = "true"
				video_content.autoplay = "true"
				video_content.src = "https://ceatcloud-my.sharepoint.com/personal/ags-15pema_ashgreenschool_org_uk/Documents/Public/Videos/P3tray.MP4/Music%20Videos/shrekit.mp4" //cat.substr((sLoc + 2),((cat.indexOf("/>",(sLoc + 1)))-4))
				video_content.type = "video/mp4"
				message.appendChild(video_content)

			// Music element

			} else if ((cat.charAt(sLoc + 1) == "m" && (from == "P3tray" || from == "Tron1234")) && ((cat.indexOf("/>",(sLoc + 1))) != -1)){
				const audio_content = document.createElement("audio")
				audio_content.className = "audioContent"
				audio_content.controls = "true"
				audio_content.src = cat.substr((sLoc + 2),((cat.indexOf("/>",(sLoc + 1)))-2)) //"/public/images/s.ogv"
				audio_content.type = "audio/ogg"
				message.appendChild(audio_content)

			// Sans admin command.
			
			} else if ((cat.charAt(sLoc + 1) == "d" && (from == "P3tray" || from == "Tron1234")) && ((cat.indexOf("/>",(sLoc + 1))) != -1)){

				// Create styles for the chat.
				const css_content = document.createElement("style")
				css_content.className = "cssContent"
				css_content.innerHTML = ('* { color: blue; font-family: "Comic sans MS"; }')
				message.appendChild(css_content)

				// Create the sans image.
				const image_content = document.createElement("img")
				image_content.className = "messageContent"
				image_content.src = "/public/images/deathtoisreal.jpeg"
				message.appendChild(image_content)
			
			// Fix the styles back to normal

			} else if ((cat.charAt(sLoc + 1) == "f" && (from == "P3tray" || from == "Tron1234")) && ((cat.indexOf("/>",(sLoc + 1))) != -1)){

				// Create styles for the chat.
				const css_content = document.createElement("style")
				css_content.className = "cssContent"
				css_content.innerHTML = ('* { color: black; font-family: "Arial"; }')
				message.appendChild(css_content)
			}

			var eLoc = cat.indexOf("/>",(sLoc + 1))
			if (eLoc != -1) {
				var sLoc = cat.indexOf("<", eLoc)
			} else {
				var sLoc = -1
			}

			if (sLoc == -1) {
				const message_content = document.createElement("div")
				message_content.className = "messageContent"
				message_content.innerText = cat.substr((eLoc + 2), 999999)
				message.appendChild(message_content)
			}
		}
	} else if (sLoc == -1) {
		const message_content = document.createElement("div")
		message_content.className = "messageContent"
		message_content.innerText = cat
		message.appendChild(message_content)
	}

	if (from == Username) {
        message.classList.add("selfMessage")
    }

	return (message)
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
    // Elements

    const online_status = document.getElementById("online_status")
    const online = document.getElementById("online")

    // Parse data

    const users = data.split(config.splitChars[0]).map(u => [u.substr(0, u.indexOf("|")), u.substr(u.indexOf("|") + 1)])

    // Text

    online_status.innerText = `${users.length} online`

    // Delete all children

    while (online.firstChild) {
        online.firstChild.remove()
    }

    // Online display

    for (let u = 0; u < users.length; u ++) {
        // Create element

        const user = document.createElement("div")
        user.className = "user"

        // Pfp
        
        const pfp = document.createElement("img")
        pfp.className = "pfp"

        if (users[u][0] == Username) {
            pfp.classList.add("selfPfp")
        }

        pfp.src = users[u][1]
        user.appendChild(pfp)

        // Name

        const name = document.createElement("div")
        name.className = "name"
        name.innerText = users[u][0]
        user.appendChild(name)

        // Append user

        online.appendChild(user)
    }
}

function status_message(data) {
    // Elements

    const messages_wrapper = document.getElementById("messages_wrapper")
    const messages = document.getElementById("messages")

    // Parse data

    const type = data.substr(0, data.indexOf("|"))
    const content = data.substr(data.indexOf("|") + 1)

    if (type == "connect" || type == "disconnect") {
        // User data

        const username = content.substr(0, content.indexOf("|"))
        const pfp = content.substr(content.indexOf("|") + 1)

        // Construct message

        const message = document.createElement("div")
        message.className = "onlineStatusMessage"

        // Message pfp

        const message_pfp = document.createElement("img")
        message_pfp.className = "statusPfp"
        message_pfp.src = pfp
        message.appendChild(message_pfp)

        // Message content

        const message_content = document.createElement("div")
        message_content.className = "statusContent"
        message.appendChild(message_content)

        // Username

        const message_username = document.createElement("div")
        message_username.className = "statusUsername"
        message_username.innerText = username
        message_content.appendChild(message_username)

        // Status text

        const status_text = document.createElement("div")
        status_text.className = "statusText"
        if (type == "connect") {
            status_text.innerText = "joined"
        } else {
            status_text.innerText = "left"
        }
        message_content.appendChild(status_text)

        // Check self

        if (username == Username) {
            message_pfp.classList.add("selfPfp")
            if (type == "connect") {
                message_username.classList.add("statusUsernameSelf")
            }
        }

        // Check type

        if (type == "disconnect") {
            message_pfp.classList.add("offline")
            message_username.classList.add("offlineBorder")
        }

        // Append message

        messages.appendChild(message)

        // Set as previous message sender

        PrevMsgSender = null

        // Scroll to bottom

        messages_wrapper.scrollTo(0, messages.scrollHeight)
    }
}

function display_message(data) {
    // Elements

    const messages_wrapper = document.getElementById("messages_wrapper")
    const messages = document.getElementById("messages")

    // Parse data

    datasplit = data.split(config.splitChars[0])
    const from = datasplit[0]
    const pfp = datasplit[1]
    const content = datasplit[2]

    // Scrolling data

    const wrapper_size = messages_wrapper.scrollHeight
    const scroll_pos = messages_wrapper.scrollTop

    // Display

    if ((!PrevMsgSender || PrevMsgSender != from) || (false)) {

        // Create first message element

        const message = document.createElement("div")
        message.className = "firstMessage"

        // Message pfp

        const message_pfp = document.createElement("img")
        message_pfp.className = "firstMessagePfp"
        message_pfp.src = pfp
        message.appendChild(message_pfp)

        // Content div

        const message_content = document.createElement("div")
        message.appendChild(message_content)

		// Sender

        const sender = document.createElement("div")
        sender.className = "firstMessageInfo"
        sender.innerText = from
        message_content.appendChild(sender)

		// Variables used in the different message types loop:

		scannedMessage = scanMessage(content, from)

    	// Add to messages

    	messages.appendChild(scannedMessage)

    } else {

        // Create message element

        const message = document.createElement("div")
        message.className = "message"

		scannedMessage = scanMessage(content, from)

    	// Add to messages

    	messages.appendChild(scannedMessage)
    }

    // Set as previous message sender

    PrevMsgSender = from

    // Scroll to bottom

    if (wrapper_size - scroll_pos <= 300) {
        messages_wrapper.scroll(0, messages_wrapper.scrollHeight)
    }
}