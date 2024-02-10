import { prisma } from '@lib/prisma';
import { redis } from '@lib/redis';
import { FastifyInstance } from 'fastify';
import z from 'zod';

export async function getPoll(app: FastifyInstance) {
  app.get('/polls/:pollId', async (req, reply) => {
    const getPollParams = z.object({
      pollId: z.string().uuid(),
    });
    const { pollId } = getPollParams.parse(req.params);
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
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

    const result = await redis.zrange(pollId, 0, -1, 'WITHSCORES');

    const votes = result.reduce((obj, line, index) => {
      if (index % 2 === 0) {
        const score = result[index + 1];
        obj[line] = Number(score);
      }
      return obj;
    }, {} as Record<string, number>);

    return reply.send({
      ...poll,
      options: poll.options.map((option) => ({
        ...option,
        score: votes[option.id] || 0,
      })),
    });
  });
}
