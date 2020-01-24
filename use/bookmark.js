!function() {
    if (location.href.startsWith("http")) {
        if (!document.getElementById("repl_chat_style") && !document.getElementById("repl_chat")) {
            // Methods

            function toggle_chat(type, self) {
                if (type == "show") {
                    // Show chat / hide buttons
                    
                    chat = true
                    repl_chat_button.className = "chatButtonOut"

                    if (self) {
                        repl_chat.style.pointerEvents = "auto"
                        repl_chat.className = "replChatIn"
                        notification.style.display = "none"

                        if (multiplayer) {
                            const mchat_button = document.getElementsByClassName("floating-icon-wrapper")[0]
                            mchat_button.style.pointerEvents = "none"
                            mchat_button.style.transition = "all 300ms ease-out 0s"
                            mchat_button.style.opacity = 0

                            if (mchat_button.getBoundingClientRect().x == 0) {
                                mchat_button.style.left = "-50px"
                            } else {
                                mchat_button.style.right = "-50px"
                            }
                        }
                    }
                } else {
                    // Hide chat / show buttons

                    repl_chat_button.disabled = false

                    chat = false
                    repl_chat_button.className = "chatButtonIn"

                    if (self) {
                        repl_chat.style.pointerEvents = "none"
                        repl_chat.className = "replChatOut"

                        if (multiplayer) {
                            const mchat_button = document.getElementsByClassName("floating-icon-wrapper")[0]
                            mchat_button.removeAttribute("style")
                        }
                    }
                } 
            }
            
            // Stuff

            let multiplayer = false
            let chat = false

            // Add repl chat styles

            const repl_chat_style = document.createElement("link")
            repl_chat_style.id = "repl_chat_style"
            repl_chat_style.href = "https://repl-chat.p3tray.repl.co/use/repl_chat.css"
            repl_chat_style.rel = "stylesheet"
            document.head.appendChild(repl_chat_style)

            // Create wrapper

            const repl_chat_wrapper = document.createElement("div")
            repl_chat_wrapper.id = "repl_chat_wrapper"
            document.body.appendChild(repl_chat_wrapper)

            // Create button

            const repl_chat_button = document.createElement("button")
            repl_chat_button.id = "repl_chat_button"
            if (document.getElementsByClassName("floating-icon-wrapper")[0] && document.getElementsByClassName("floating-icon-wrapper")[0].classList.value.includes("hidden")) {
                repl_chat_button.className = "chatButtonOut"
            } else {
                repl_chat_button.className = "chatButtonIn"
            }
            repl_chat_wrapper.appendChild(repl_chat_button)

            // Create button icon

            const button_icon = document.createElement("img")
            button_icon.id = "repl_chat_icon"
            button_icon.src = "https://repl-chat.p3tray.repl.co/public/images/repl-chat.png"
            repl_chat_button.appendChild(button_icon)

            // Create button notification

            const notification = document.createElement("div")
            notification.id = "repl_chat_notification"
            repl_chat_button.appendChild(notification)

            // Add repl chat iframe

            const repl_chat = document.createElement("iframe")
            repl_chat.id = "repl_chat"
            repl_chat.className = "replChatOut"
            repl_chat.src = "https://repl-chat.p3tray.repl.co"
            repl_chat_wrapper.appendChild(repl_chat)

            // Messages from iframe

            repl_chat.onload = () => {
                window.addEventListener("message", event => {
                    if (event.origin == "https://repl-chat.p3tray.repl.co") {
                        // Parse data

                        const request = event.data.includes("|") ? event.data.substr(0, event.data.indexOf("|")) : event.data
                        const data = event.data.includes("|") ? event.data.substr(event.data.indexOf("|") + 1) : null

                        // Requests

                        if (request == "close") {
                            toggle_chat("hide", true)
                        } else if (request == "message") {
                            if (repl_chat.className == "replChatOut") {
                                notification.style.display = "block"
                            }
                        }
                    }
                })
            }

            // Interval to detect multiplayer

            setInterval(() => {
                if (!multiplayer && document.getElementsByClassName("floating-icon-wrapper")[0] && document.getElementsByClassName("close-chat")[0]) {
                    // Elements

                    const mchat_button = document.getElementsByClassName("floating-icon-wrapper")[0]
                    const mchat_close = document.getElementsByClassName("close-chat")[0]
                    
                    // Multiplayer event listeners

                    mchat_button.addEventListener("click", () => {                     
                        mchat_button.style.pointerEvents = "none"
                        toggle_chat("show", false)
                    })

                    mchat_close.addEventListener("click", () => {
                        mchat_button.removeAttribute("style")
                        toggle_chat("hide", false)
                    })

                    multiplayer = true
                } else if (!document.getElementsByClassName("floating-icon-wrapper")[0] || !document.getElementsByClassName("close-chat")[0]) {
                    multiplayer = false
                }
            }, 100)

            // Button click

            repl_chat_button.addEventListener("click", event => {
                if (event.isTrusted) {
                    toggle_chat("show", true)
                }
            })

            // Remove script

            document.getElementById("repl_chat_script").remove()

            // Success

            //alert("repl chat successfully loaded!")
        } else {
            // Already in use

            document.getElementById("repl_chat_script").remove()
            alert("repl chat already in use!")
        }
    } else {
        // Wrong location

        document.getElementById("repl_chat_script").remove()
        alert("Go to https://repl.it to use repl chat!")
    }
}()