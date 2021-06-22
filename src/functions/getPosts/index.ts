/* eslint-disable no-template-curly-in-string */
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'get',
        path: 'postExcerpts',
        cors: true,
        authorizer: {
          name: 'getBlogPostsAuthorizer',
          arn: '${env:cognito_user_pool_arn}',
          scopes: ['aws.cognito.signin.user.admin'],
        },
      },
    },
  ],
};
