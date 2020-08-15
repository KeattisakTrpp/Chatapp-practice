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
var image = document.getElementById('file')

chatForm.addEventListener('submit', e => {
    e.preventDefault()
    const msg = e.target.elements.msg.value
    const file = e.target.elements.file.files[0]
    console.log(file)
    if(file != null) {
        readFile(file, msg)
    } else {
        socket.emit('chat message', {msg})
    }
    // clear input
    e.target.elements.msg.value = ''
    e.target.elements.file.value = ''
})

showMessage = (msg) => {
    const div = document.createElement('div')
    div.classList.add('message')
    div.innerHTML = `<p class="meta"> ${msg.username} <span>${msg.time}</span></p>
        <p class="text"> ${msg.msg} </p>`
    if(msg.img != null) {
        div.innerHTML += `<img src="${msg.img}" id="picture" />`
    }
    document.getElementById('chat-messages').appendChild(div)
}

userList = (users) => {
    const userList = document.getElementById('users')
    userList.innerHTML = `${users.map(user => `<li>${user.username}</li>`).join('')}`
}

readFile = (file, msg) => {
    const reader = new FileReader()
        reader.onloadend = e => {
            socket.emit('chat message', {msg,  file: e.target.result})
        }
        reader.readAsDataURL(file)
}