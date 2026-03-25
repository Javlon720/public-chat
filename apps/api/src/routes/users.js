const users = []

export default async function usersRoute(app) {
    app.get('/', async (req, reply) => {
        return { message: 'Users route ishlayapti', users: users.map(u => ({ username: u.username })) }
    })

    app.post('/register', async (req, reply) => {
        const { username, password } = req.body || {}
        if (!username || !password) {
            reply.status(400)
            return { error: 'username va password talab qilinadi' }
        }

        if (users.some((u) => u.username === username)) {
            reply.status(400)
            return { error: 'username allaqachon mavjud' }
        }

        const user = { username, password }
        users.push(user)
        return { message: 'Ro‘yxatdan o‘tildi', user: { username } }
    })

    app.post('/login', async (req, reply) => {
        const { username, password } = req.body || {}
        if (!username || !password) {
            reply.status(400)
            return { error: 'username va password talab qilinadi' }
        }

        const user = users.find((u) => u.username === username && u.password === password)
        if (!user) {
            reply.status(401)
            return { error: 'Username yoki parol noto‘g‘ri' }
        }

        return { message: 'Tizimga kirdingiz', user: { username } }
    })
}