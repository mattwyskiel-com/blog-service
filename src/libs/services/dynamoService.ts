import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  DynamoDBDocumentClient,
  ExecuteStatementCommand,
  PutCommand,
  ScanCommand,
} from '@aws-sdk/lib-dynamodb';
import { Logger } from '@libs/logger';
import { BlogPost } from '@libs/model/BlogPost';

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
  public static async getAllPostsFromDB(): Promise<BlogPost[]> {
    const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
    const docClient = DynamoDBDocumentClient.from(dynamoClient);
    const scanRequest = new ScanCommand({ TableName: process.env.DYNAMODB_TABLE });
    Logger.debug('Request to DynamoDB: Scan Table', { request: scanRequest });

    try {
      const response = await docClient.send(scanRequest);
      Logger.debug('Scan Table Request successful', { response });
      return (response.Items as BlogPost[]) ?? [];
    } catch (error) {
      Logger.error('Error retrieving blog posts from DynamoDB', error);
      throw {
        status: 500,
        error: 'Error retrieving blog posts from DynamoDB',
        details: error,
      };
    }
  }

  public static async getPostExcerptsFromDB(count?: number): Promise<BlogPost[]> {
    const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
    const docClient = DynamoDBDocumentClient.from(dynamoClient);
    const executeStatementRequest = new ExecuteStatementCommand({
      Statement: `SELECT id, title, published, slug, excerpt FROM "${process.env.DYNAMODB_TABLE}"`,
    });
    Logger.debug('Request to DynamoDB: Execute PartiQL Statement', {
      request: executeStatementRequest,
    });

    try {
      const response = await docClient.send(executeStatementRequest);
      Logger.debug('Execute PartiQL Statement Request successful', { response });
      let posts: BlogPost[] = (response.Items as BlogPost[]) ?? [];
      posts = posts.sort((a, b) => b.id - a.id);
      Logger.debug('Sorted posts', { posts });
      if (count) {
        posts.length = count;
      }
      Logger.debug('Sliced posts', { posts });
      return posts;
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
