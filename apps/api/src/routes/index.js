import users from './users.js';
import messages from './message.js';

export default async function routes(app) {
    await app.register(users, { prefix: '/users' });
    await app.register(messages, { prefix: '/messages' });
}