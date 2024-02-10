import { env } from '@env/index';
import { app } from '@lib/fastify';
import { createPoll } from './routes/create-poll';
import { getPoll } from './routes/get-poll';
import { voteOnPoll } from './routes/vote-on-poll';
import cookie from '@fastify/cookie';

app.register(cookie, {
  secret: env.COOKIE_SECRET,
  hook: 'onRequest',
});
app.register(createPoll);
app.register(getPoll);
app.register(voteOnPoll);

app.listen({ port: env.PORT }).then(() => {
  console.log(`🚀 HTTP Server is running on port ${env.PORT}`);
});
