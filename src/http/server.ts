import fastify from 'fastify';
import { env } from '../env';

const app = fastify();

app.post('/polls', (req) => {
  console.log(req.body);
});

app.listen({ port: env.PORT }).then(() => {
  console.log(`🚀 HTTP Server is running on port ${env.PORT}`);
});
