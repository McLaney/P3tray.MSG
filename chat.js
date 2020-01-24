// Files and modules

const config = require("./config.js").config
const util = require("./util.js")

const axios = require("axios")
const fs = require("fs")

// Stuff

const users = []

// Methods

function check_connected(username) {
    for (let u = 0; u < users.length; u ++) {
        if (users[u].username == username) {
            return true
        }
    }
    
    return false
}

function init_ws(connection) {
    // New connection

    util.log(`New connection: ${connection.username}`)
    users.push(connection)

    // WebSocket events

    connection.on("message", message => {
        process_message(connection, message)
    })

    connection.on("close", () => {
        util.log(`Disconnect: ${connection.username}`)
        disconnect_user(connection)
    })

    // Client init

    connection.send(`init|${connection.username}|${connection.pfp}`)

    const messages = JSON.parse(fs.readFileSync("messages.json"))
    
    for (let m = 0; m < messages.length; m ++) {
        if (messages[m].type == "status") {
            if (messages[m].statusType == "connect" || messages[m].statusType == "disconnect") {
                connection.send(`status|${messages[m].statusType}|${messages[m].user}|${messages[m].pfp}`)
            }
        } else if (messages[m].type == "message") {
            connection.send(`message|${messages[m].from}${config.splitChars[0]}${messages[m].pfp}${config.splitChars[0]}${messages[m].content}`)
        }
    }

    // Broadcast connection

    broadcast(`status|connect|${connection.username}|${connection.pfp}`)
    
    // Online users
    
    let online = ""
    for (let u = 0; u < users.length; u ++) {
        online += `${users[u].username}|${users[u].pfp}`
        if (u != users.length - 1) {
            online += config.splitChars[0]
        }
    }
    broadcast(`online|${online}`)

    // Store connect

    messages.push({type: "status", statusType: "connect", user: connection.username, pfp: connection.pfp})
    
    if (messages.length > 50) {
        while (messages.length > 50) {
            messages.shift()
        }
    }

    fs.writeFileSync("messages.json", JSON.stringify(messages, null, 4))
}

function broadcast(message) {
    // Send message to all users

    for (let u = 0; u < users.length; u ++) {
        users[u].send(message)
    }
}

function process_message(connection, message) {
    // Parse data

    const msg_data = message.utf8Data
    const request = msg_data.substr(0, msg_data.indexOf("|"))
    const content = msg_data.substr(msg_data.indexOf("|") + 1)

    // Requests

    if (request == "message") {
        // Get rid of bad characters

        if (content.includes(config.splitChars[0])) {
            content.replace(config.splitChars[0], "")
        }

        // Broadcast message

        broadcast(`message|${connection.username}${config.splitChars[0]}${connection.pfp}${config.splitChars[0]}${content}`)

        // Store message

        const messages = JSON.parse(fs.readFileSync("messages.json"))
        messages.push({type: "message", from: connection.username, pfp: connection.pfp, content: content})
        
        if (messages.length > 50) {
            while (messages.length > 50) {
                messages.shift()
            }
        }

        fs.writeFileSync("messages.json", JSON.stringify(messages, null, 4))
    }
}

function disconnect_user(connection) {
    // Find user

    for (let u = 0; u < users.length; u ++) {
        if (users[u].username == connection.username) {
            users.splice(u, 1)
            break
        }
    }

    // Broadcast disconnect

    broadcast(`status|disconnect|${connection.username}|${connection.pfp}`)

    // Online users
    
    let online = ""
    for (let u = 0; u < users.length; u ++) {
        online += `${users[u].username}|${users[u].pfp}`
        if (u != users.length - 1) {
            online += config.splitChars[0]
        }
    }
    broadcast(`online|${online}`)

    // Store disconnect

    const messages = JSON.parse(fs.readFileSync("messages.json"))
    messages.push({type: "status", statusType: "disconnect", user: connection.username, pfp: connection.pfp})
    
    if (messages.length > 50) {
        while (messages.length > 50) {
            messages.shift()
        }
    }

    fs.writeFileSync("messages.json", JSON.stringify(messages, null, 4))
}

// Exports

module.exports = {
    check_connected: check_connected,
    init_ws: init_ws
}