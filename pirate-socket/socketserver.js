const server = require('http').createServer();
const io = require('socket.io')(server);
const PORT = 3003;
io.on('connection', client => {
    console.log("Server detects a new client has connected.");

    
    client.on('message', function(data){ 
        console.log(data);
        setTimeout(() => {
            resolve(client.send("PLAY"));
        }, 2000);
    });

    client.on('disconnect', () => { 
        console.log("Server detects that a client has disconnected");
    });
});


server.listen(PORT, function(){
    console.log(`Listening on PORT ${PORT}`);
});