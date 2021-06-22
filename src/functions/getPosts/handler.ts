import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Logger } from '@libs/logger';
import { DynamoDBService } from '@libs/services/dynamoService';
import { verifyAccess } from '@libs/verifyAccess';
import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

const getPostExcerpts: APIGatewayProxyHandler = async event => {
  try {
    return formatJSONResponse({
      posts: await DynamoDBService.getPostExcerptsFromDB(
        parseInt(event.queryStringParameters?.count, 10) // base 10 decimal number
      ),
    });
  } catch (error) {
    if (error.status) {
      return formatJSONResponse(error);
    }
    Logger.error('Error retrieving blog posts.', { message: error.message });
    return formatJSONResponse({
      status: 500,
      error: 'Error retrieving blog posts',
      details: error.message,
    });
  }
};

export const main = middyfy(getPostExcerpts).use(verifyAccess());
