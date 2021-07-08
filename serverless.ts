/* eslint-disable no-template-curly-in-string */
import type { AWS } from '@serverless/typescript';
import restore from '@functions/restore';
import postExcerpts from '@functions/getPostExcerpts';
import getPost from '@functions/getPost';

const serverlessConfiguration: AWS = {
  service: 'blog-service',
  useDotenv: true,
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
    customDomain: {
      basePath: 'blog',
      domainName: '${self:custom.domains.${self:provider.stage}}',
      stage: '${self:provider.stage}',
    },
    domains: {
      prod: 'api.mattwyskiel.com',
      dev: 'api-dev.mattwyskiel.com',
    },
    prune: {
      automatic: true,
      number: 3,
    },
  },
  plugins: [
    'serverless-webpack',
    'serverless-domain-manager',
    'serverless-offline',
    'serverless-prune-plugin',
  ],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    stage: '${opt:stage, "dev"}',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      BUCKET_NAME: 'mattwyskiel-blog-${self:provider.stage}',
      DYNAMODB_TABLE: 'mattwyskiel-blog-posts-${opt:stage, "dev"}',
    },
    lambdaHashingVersion: '20201221',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: ['s3:PutObject', 's3:PutObjectTagging', 's3:GetObject'],
        Resource: ['arn:aws:s3:::${self:provider.environment.BUCKET_NAME}/*'],
      },
      {
        Effect: 'Allow',
        Action: ['s3:ListBucket'],
        Resource: ['arn:aws:s3:::${self:provider.environment.BUCKET_NAME}'],
      },
      {
        Effect: 'Allow',
        Action: [
          'dynamodb:BatchGet*',
          'dynamodb:DescribeStream',
          'dynamodb:DescribeTable',
          'dynamodb:Get*',
          'dynamodb:Query',
          'dynamodb:Scan',
          'dynamodb:BatchWrite*',
          'dynamodb:CreateTable',
          'dynamodb:Delete*',
          'dynamodb:Update*',
          'dynamodb:PutItem',
          'dynamodb:PartiQLSelect',
        ],
        Resource: 'arn:aws:dynamodb:*:*:table/${self:provider.environment.DYNAMODB_TABLE}',
      },
    ],
  },
  // import the function via paths
  functions: { restore, postExcerpts, getPost },
  resources: {
    Resources: {
      BlogBucket: {
        Type: 'AWS::S3::Bucket',
        Properties: {
          BucketName: '${self:provider.environment.BUCKET_NAME}',
        },
      },
      BlogPostsTable: {
        Type: 'AWS::DynamoDB::Table',
        Properties: {
          TableName: '${self:provider.environment.DYNAMODB_TABLE}',
          AttributeDefinitions: [
            {
              AttributeName: 'id',
              AttributeType: 'N',
            },
          ],
          KeySchema: [
            {
              AttributeName: 'id',
              KeyType: 'HASH',
            },
          ],
          ProvisionedThroughput: {
            ReadCapacityUnits: 1,
            WriteCapacityUnits: 1,
          },
        },
      },
    },
  },
};

module.exports = serverlessConfiguration;
