import { formatJSONResponse } from '@libs/apiGateway';
import { middyfy } from '@libs/lambda';
import { Logger } from '@libs/logger';
import { DynamoDBService } from '@libs/services/dynamoService';
import { S3Service } from '@libs/services/s3Service';
import { verifyAccess } from '@libs/verifyAccess';
import { APIGatewayProxyHandler } from 'aws-lambda';
import * as matter from 'gray-matter';
import 'source-map-support/register';

const parseAndAddToDB = async (post: string) => {
  // 2a. parse frontmatter and content from posts
  const parsed = matter(post);
  // 2b. add post with metadata into DynamoDB
  const postObj = { ...parsed.data, content: parsed.content };
  // eslint-disable-next-line no-await-in-loop
  await DynamoDBService.addPostToDB(postObj);
};

const restore: APIGatewayProxyHandler = async () => {
  try {
    // 1. fetch archived posts from S3
    const posts = await S3Service.getPostsFromS3();

    // 2. for each post:
    const promises = posts.map(post => parseAndAddToDB(post));

    await Promise.all(promises);

    // 3. Retrieve blog posts from Dynamo
    const dbPosts = await DynamoDBService.getAllPostsFromDB();
    return formatJSONResponse({ posts: dbPosts });
  } catch (error) {
    if (error.status) {
      return formatJSONResponse(error);
    }
    Logger.error('Error restoring blog posts.', { message: error.message });
    return formatJSONResponse({
      status: 500,
      error: 'Error restoring blog posts',
      details: error,
    });
  }
};

export const main = middyfy(restore).use(verifyAccess());
