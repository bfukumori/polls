import { voting } from '@utils/voting-pub-sub';
import { FastifyInstance } from 'fastify';
import z from 'zod';

export async function pollResults(app: FastifyInstance) {
  app.get('/polls/:pollId/results', { websocket: true }, (connection, req) => {
    const getPollParams = z.object({
      pollId: z.string().uuid(),
    });

    const { pollId } = getPollParams.parse(req.params);

    voting.subscribe(pollId, (message) => {
      connection.socket.send(JSON.stringify(message));
    });
  });
}
