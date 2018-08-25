var path = window.location.pathname;
const room = path.split("/").pop();
//const socket = io('/tech');

socket.on('connect', () => {
    socket.emit('join', { room: room } );
});

$('#chatBtn').click(() => {
    let msg = $('#messageInput').val();
    socket.emit('messagesPush', { msg: msg, room: room } );
    $('#messageInput').val('');
});
$('#messageInput').keyup((e) => {
    if (event.keyCode === 13) {
        $('#chatBtn').click();
    }
});

socket.on('messagesReceive', (msg) => {
    console.log(`messaged received: ${msg}`)
    $('#messages').append($('<li>').text(msg));
});