/* eslint-disable no-template-curly-in-string */
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'post-excerpts',
        cors: true,
      },
    },
  ],
};
