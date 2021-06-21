import { GetObjectCommand, ListObjectsV2Command, S3Client } from '@aws-sdk/client-s3';
import { Logger } from '@libs/logger';

export class S3Service {
  public static async getPostsFromS3(): Promise<string[]> {
    const s3Client = new S3Client({ region: process.env.AWS_REGION });
    const listObjectsRequest = new ListObjectsV2Command({
      Bucket: process.env.BUCKET_NAME,
    });
    Logger.debug('Request to S3: List Objects', { request: listObjectsRequest });

    try {
      const response = await s3Client.send(listObjectsRequest);
      Logger.info('List Objects Request successful', { response });

      const objectKeys = response.Contents.map(val => val.Key).filter(val =>
        val.startsWith('posts/')
      );
      objectKeys.shift();

      const promises = objectKeys.map(key => this.postContentForKey(key));

      const rawPosts = await Promise.all(promises);

      return rawPosts;
    } catch (error) {
      Logger.error(`Error retrieving blog posts from S3: ${error.name}`, {
        message: error.message,
      });
      throw {
        status: 500,
        error: `Error retrieving blog posts from S3: ${error.name}`,
        details: error,
      };
    }
  }

  private static streamToString = async (stream): Promise<string> =>
    new Promise((resolve, reject) => {
      const chunks = [];
      stream.on('data', chunk => chunks.push(chunk));
      stream.on('error', reject);
      stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });

  private static async postContentForKey(key: string): Promise<string> {
    const s3Client = new S3Client({ region: process.env.AWS_REGION });
    const getObjectRequest = new GetObjectCommand({
      Bucket: process.env.BUCKET_NAME,
      Key: key,
    });
    Logger.debug('Request to S3: Get Object', { request: getObjectRequest });
    // eslint-disable-next-line no-await-in-loop
    const object = await s3Client.send(getObjectRequest);
    Logger.debug('Get Object Request successful');
    // eslint-disable-next-line no-await-in-loop
    const bodyContents = await this.streamToString(object.Body);
    // const bodyContents = `---id:${Date.now()}\ntitle: ${key}---\nThis is starting`;
    return bodyContents;
  }
}
