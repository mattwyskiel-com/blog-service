# `restore` Function

## Endpoint

`POST /blog/restore`

## Input Parameters

None, but this function makes some key assumptions:

- There exist `.md` files in the `/posts/*` path of the `BlogBucket` (as defined in `serverless.ts`)
- There are no existing items in the `BlogPostsTable` (as defined in `serverless.ts`)

## Authentication

An authenticated Cognito user JWT is required in the Authorization header, where the user is in a
group called 'admin'.

## Response

An array of fully-populated `BlogPost` objects:

```json
{
  "posts": [
    {
      "id": 13,
      "title": "Curiosity and the Value of Diving Deeper - A Personal Testimony",
      "author": "Matthew Wyskiel",
      "published": "2017-04-11T23:11:01+20:00",
      "category": "posts",
      "slug": "2017-04-11-curiosity-and-the-value-of-learning-a-personal-testimony",
      "excerpt": "A short string",
      "tags": ["learning", "curiosity", "testimony", "film", "apps", "ios"],
      "content": "A very, very long string"
    },
    ...
  ]
}
```

| name              | type     | description                                                                                       |
| ----------------- | -------- | ------------------------------------------------------------------------------------------------- |
| posts[].id        | integer  | The post id                                                                                       |
| posts[].title     | string   | The post title                                                                                    |
| posts[].author    | string   | The name of the post author                                                                       |
| posts[].published | string   | The DateTime of the publishing of the post in ISO 8601 format                                     |
| posts[].category  | string   | The post category (default: `posts`)                                                              |
| posts[].slug      | string   | The desired URI string for the blog post (e.g. `/posts/2021-01-01-hello-world`)                   |
| posts[].excerpt   | string   | A short summary or abstract of the post, primarily for display on the home page or main blog page |
| posts[].tags      | string[] | Keywords to identify and categorize the post further                                              |
| posts[].content   | string   | The full text content of the post, in Markdown format                                             |

## Logic

1. Retrieve all `.md` files under the `/posts/*` path of the `BlogBucket` S3 Bucket.
2. Parse each `.md` file for front-matter and content, and add the consolidated object to the
   `BlogPostsTable` DynamoDB table.
3. Retrieve all the posts in that database and return those to the client, so that accuracy in the
   restore action can be checked by the client.
