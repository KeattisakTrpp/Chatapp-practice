var express = require('express')
var app =  express()
var server = require('http').createServer(app)
var io = require('socket.io')(server)
var path = require('path')
const formatMessage = require('./messages')
const {userJoin, getUser, userLeave, getUserList} = require('./users')

app.use(express.static(path.join(__dirname, 'public')))

io.on('connection', socket => {
    // Welcome user
    socket.emit('notify', formatMessage('Bot','Welcome to chat'))

    // Notify when user join
    socket.on('new user', username => {
        userJoin(socket.id, username)
        socket.broadcast.emit('notify', formatMessage(username, `has joined the chat`))
        // update user list
        io.emit('user list', { users: getUserList()})
    })

    socket.on('disconnect', () => {
        const user = userLeave(socket.id)
        if(user) {
            io.emit('notify', formatMessage(user.username, `left the chat`))
        }
        // update user list
        io.emit('user list', { users: getUserList()})
    });

    // Listen to chat message
    socket.on('chat message', msg => {
        const user = getUser(socket.id)
        io.emit('message', formatMessage(user.username, msg))
    });
})

server.listen(3000, () => {
    console.log('listening on port: 3000')
})
