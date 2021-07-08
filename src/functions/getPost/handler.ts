import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Logger } from '@libs/logger';
import { DynamoDBService } from '@libs/services/dynamoService';
import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';

const getPost: APIGatewayProxyHandler = async event => {
  try {
    const post = await DynamoDBService.getPostFromDB(event.pathParameters.slug);
    return formatJSONResponse({ post });
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

export const main = middyfy(getPost);
