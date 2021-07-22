# mattwyskiel.com - Blog Service

This project structure is based on the `aws-nodejs-typescript` template from the
[Serverless framework](https://www.serverless.com/).

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

### Requirements

- NodeJS `lts/fermium (v.14.15.0)`
  > If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the
  > same Node version in local and in your lambda's runtime.
- An AWS Cognito User Pool, with at least one user in the group 'admin'

### Using NPM

- Run `npm i` to install the project dependencies
- Create a `.env` file in the root of the repository with the following keys and values:

```sh
cognito_user_pool_arn="YOUR_VALUE" # The ARN of your cognito user pool
prod_domain="YOUR_VALUE" # The production domain where the API will be deployed/mapped
dev_domain="YOUR_VALUE" # The development domain where the API will be deployed/mapped
```

- _If your API domains have not been set up yet:_ once you define them in `.env`, run the following
  commands (only need once per domain -
  [across all services](https://www.serverless.com/blog/api-gateway-multiple-services)):

```sh
$ npx sls create_domain --stage prod
$ npx sls create_domain --stage dev
```

- Run `npx sls deploy` to deploy this stack to AWS

### Using Yarn

- Run `yarn` to install the project dependencies
- Create a `.env` file in the root of the repository with the following keys and values:

```sh
cognito_user_pool_arn="YOUR_VALUE" # The ARN of your cognito user pool
prod_domain="YOUR_VALUE" # The production domain where the API will be deployed/mapped
dev_domain="YOUR_VALUE" # The development domain where the API will be deployed/mapped
```

- _If your API domains have not been set up yet:_ once you define them in `.env`, run the following
  commands (only need once per domain -
  [across all services](https://www.serverless.com/blog/api-gateway-multiple-services)):

```sh
$ yarn sls create_domain --stage prod
$ yarn sls create_domain --stage dev
```

- Run `yarn sls deploy` to deploy this stack to AWS
