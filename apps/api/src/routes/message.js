export default async function messagesRoute(app) {
    app.get('/', async (req, reply) => {
        return { message: 'Messages route ishlayapti' };
    });
}