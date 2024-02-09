import fastify from 'fastify';
import { env } from '../env';
import z from 'zod';
import { PrismaClient } from '@prisma/client';

const app = fastify();
const prisma = new PrismaClient();

app.post('/polls', async (req, reply) => {
  const createPollBody = z.object({
    title: z.string(),
  });
  const { title } = createPollBody.parse(req.body);
  const { id } = await prisma.poll.create({
    data: {
      title,
    },
  });

  return reply.status(201).send({ id });
});

app.listen({ port: env.PORT }).then(() => {
  console.log(`🚀 HTTP Server is running on port ${env.PORT}`);
});
