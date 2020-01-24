const config = {
    port: 8080,
    origins: ["https://repl.it", "https://repl-chat.p3tray.repl.co", "https://repl-chat--p3tray.repl.co"],
    reqByteLimit: 100000,

    splitChars: ["⼁", "¦"],

    wsProtocol: "repl-chat-client",

    database: "https://repl-chat-database.p3tray.repl.co"
}

module.exports = {
    config: config
}