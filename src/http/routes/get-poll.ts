import { prisma } from '@lib/prisma';
import { FastifyInstance } from 'fastify';
import z from 'zod';

export async function getPoll(app: FastifyInstance) {
  app.get('/polls/:id', async (req, reply) => {
    const getPollParams = z.object({
      id: z.string().uuid(),
    });
    const { id } = getPollParams.parse(req.params);
    const poll = await prisma.poll.findUnique({
      where: { id },
      include: {
        options: {
          select: {
            title: true,
            id: true,
          },
        },
      },
    });

    if (!poll) {
      return reply.status(422).send({ message: 'Poll not found' });
    }

    return reply.send({ poll });
  });
}
