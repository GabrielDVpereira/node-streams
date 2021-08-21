import net from 'net'


// node example02.mjs - create a socket server on port 3333

// node -e "process.stdin.pipe(require("net").connect(3333))" - connect to the socket server 

// this way, everything we type in the terminal will be displayed to the terminal as well


net.createServer(socket => socket.pipe(process.stdout)).listen(3333)