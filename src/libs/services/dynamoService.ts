import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand, ScanCommand } from '@aws-sdk/lib-dynamodb';
import { Logger } from '@libs/logger';

export class DynamoDBService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  public static async addPostToDB(post: any): Promise<void> {
    const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
    const docClient = DynamoDBDocumentClient.from(dynamoClient);
    const putRequest = new PutCommand({
      TableName: process.env.DYNAMODB_TABLE,
      Item: post,
    });
    Logger.debug('Request to DynamoDB: Put Item', { request: putRequest });

    try {
      const response = await docClient.send(putRequest);
      Logger.debug('Put Item Request successful', { response });
    } catch (error) {
      Logger.error('Error adding blog post to DynamoDB', error);
      throw {
        status: 500,
        error: 'Error adding blog post to DynamoDB',
        details: error,
      };
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static async getAllPostsFromDB(): Promise<any[]> {
    const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
    const docClient = DynamoDBDocumentClient.from(dynamoClient);
    const scanRequest = new ScanCommand({ TableName: process.env.DYNAMODB_TABLE });
    Logger.debug('Request to DynamoDB: Scan Table', { request: scanRequest });

    try {
      const response = await docClient.send(scanRequest);
      Logger.debug('Scan Table Request successful', { response });
      return response.Items ?? [];
    } catch (error) {
      Logger.error('Error retrieving blog posts from DynamoDB', error);
      throw {
        status: 500,
        error: 'Error retrieving blog posts from DynamoDB',
        details: error,
      };
    }
  }
}
