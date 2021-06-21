/* eslint-disable consistent-return,@typescript-eslint/no-explicit-any */
import middy from '@middy/core';
import { APIGatewayProxyResult, APIGatewayProxyWithCognitoAuthorizerEvent } from 'aws-lambda';
import { formatJSONResponse } from './apiGateway';

interface VerifyAccessOptions {
  accessControlGroups: string[];
}

const defaultOptions: VerifyAccessOptions = {
  accessControlGroups: ['admin'],
};

export const verifyAccess: middy.Middleware<VerifyAccessOptions> = opt => {
  const options = { ...defaultOptions, ...opt };

  const verifyAccessBefore: middy.MiddlewareFunction<
    APIGatewayProxyWithCognitoAuthorizerEvent,
    APIGatewayProxyResult
  > = async request => {
    const { event } = request;
    if (event.requestContext?.authorizer?.claims['cognito:groups']) {
      const claims = event.requestContext.authorizer.claims['cognito:groups'];
      let claimsArray: string[];
      if (Array.isArray(claims)) {
        claimsArray = claims;
      } else {
        claimsArray = claims.split(',');
      }
      if (!claimsArray.some(claim => options.accessControlGroups.includes(claim))) {
        return formatJSONResponse({
          status: 401,
          message: 'Unauthorized',
        });
      }
    } else {
      return formatJSONResponse({
        status: 401,
        message: 'Unauthorized',
      });
    }
  };
  return {
    before: verifyAccessBefore,
  };
};
