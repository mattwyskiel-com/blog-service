/* eslint-disable no-template-curly-in-string */
import { handlerPath } from '@libs/handlerResolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'post',
        path: 'restore',
        cors: true,
        authorizer: {
          name: 'restoreBlogPostsAuthorizer',
          arn: '${env:cognito_user_pool_arn}',
          scopes: ['aws.cognito.signin.user.admin'],
        },
      },
    },
  ],
};
