import { io } from 'socket.io-client'

const apiUrl = 'http://localhost:3001'
const socket = io(apiUrl)
let currentUser = null

const container = document.getElementById('container')

const appendMessage = (message) => {
  const item = document.createElement('div')
  item.className = message.author === 'You' ? 'message out' : 'message in'
  item.innerHTML = `<div class="meta"><span class="author">${message.author}</span> <span class="ts">${new Date(message.ts).toLocaleTimeString()}</span></div><div class="body">${message.text}</div>`
  const messagesEl = document.getElementById('messages')
  if (!messagesEl) return
  messagesEl.appendChild(item)
  messagesEl.scrollTop = messagesEl.scrollHeight
}

socket.on('connect', () => {
  if (currentUser) {
    appendMessage({ author: 'System', text: 'Serverga ulandi', ts: new Date().toISOString() })
  }
})

socket.on('new_message', (data) => {
  if (currentUser) appendMessage(data)
})

socket.on('disconnect', () => {
  if (currentUser) appendMessage({ author: 'System', text: 'Aloqa uzildi', ts: new Date().toISOString() })
})

const showError = (text) => {
  const errorEl = document.getElementById('auth-error')
  if (errorEl) {
    errorEl.textContent = text
    errorEl.style.display = text ? 'block' : 'none'
  }
}

const renderChat = () => {
  container.innerHTML = `
    <div class="chat-shell">
      <div class="header">PublicChat (Telegram uslubida) - ${currentUser}</div>
      <div id="messages" class="messages"></div>
      <div class="input-row">
        <input id="text" type="text" placeholder="Xabaringizni yozing..." />
        <button id="send">Yuborish</button>
      </div>
    </div>
  `

  const textEl = document.getElementById('text')
  const sendBtn = document.getElementById('send')

  sendBtn.addEventListener('click', async () => {
    const text = textEl.value.trim()
    if (!text) return

    const payload = {
      author: currentUser,
      text,
      ts: new Date().toISOString()
    }

    socket.emit('send_message', payload)
    appendMessage({ ...payload, author: 'You' })
    textEl.value = ''
  })

  appendMessage({ author: 'System', text: 'Chat ishga tushdi', ts: new Date().toISOString() })
}

const renderAuth = () => {
  currentUser = null
  container.innerHTML = `
    <div class="chat-shell">
      <div class="header">Ro‘yxatdan o‘tish / Kirish</div>
      <div id="messages" class="messages auth-info">
        <p>Hozircha oddiy login + parol, ma’lumotlar serverda xeshlanmagan saqlanmaydi.</p>
      </div>
      <div class="input-row">
        <input id="auth-username" type="text" placeholder="Ismingiz" />
        <input id="auth-password" type="password" placeholder="Parol" />
      </div>
      <div class="auth-buttons">
        <button id="register" class="register">Ro‘yxatdan o‘tish</button>
        <button id="login" class="login">Kirish</button>
      </div>
      <div id="auth-error" class="auth-error">&nbsp;</div>
    </div>
  `

  document.getElementById('register').addEventListener('click', async () => {
    const username = document.getElementById('auth-username').value.trim()
    const password = document.getElementById('auth-password').value.trim()
    if (!username || !password) {
      showError('Iltimos foydalanuvchi va parol kiriting')
      return
    }

    const res = await fetch(`${apiUrl}/users/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    const data = await res.json()
    if (!res.ok) {
      showError(data.error || 'Ro‘yxatdan o‘tishda xato')
      return
    }

    showError('Ro‘yxatdan muvaffaqiyatli o‘tildi, endi kirish qiling')
  })

  document.getElementById('login').addEventListener('click', async () => {
    const username = document.getElementById('auth-username').value.trim()
    const password = document.getElementById('auth-password').value.trim()
    if (!username || !password) {
      showError('Iltimos foydalanuvchi va parol kiriting')
      return
    }

    const res = await fetch(`${apiUrl}/users/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })

    const data = await res.json()
    if (!res.ok) {
      showError(data.error || 'Tizimga kirishda xato')
      return
    }

    currentUser = username
    showError('')
    renderChat()
  })
}

renderAuth()
