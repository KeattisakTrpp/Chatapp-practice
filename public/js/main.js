const socket = io()

const name = prompt('Enter name')
socket.emit('new user', name)

socket.on('message', msg => {
    showMessage(msg)   
    const chatMsg = document.querySelector('.chat-messages')
    chatMsg.scrollTop = chatMsg.scrollHeight
})

socket.on('notify', msg => {
    showMessage(msg)
})

socket.on('user list', ({ users }) => {
    userList(users)
})

var chatForm = document.getElementById('chat-form')
chatForm.addEventListener('submit', e => {
    e.preventDefault()
    const msg = e.target.elements.msg.value
    socket.emit('chat message', msg)

    // clear input
    e.target.elements.msg.value = ''
})

showMessage = (msg) => {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta"> ${msg.username} <span>${msg.time}</span></p>
    <p class="text"> ${msg.msg} </p>`
    document.getElementById('chat-messages').appendChild(div)
}

userList = (users) => {
    const userList = document.getElementById('users')
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`
}