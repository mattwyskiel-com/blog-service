# `getPost` Function

## Endpoint

`GET /blog/posts/{slug}`

## Input Parameters

### Path Parameters

| name | type   | description                                                                     | required |
| ---- | ------ | ------------------------------------------------------------------------------- | -------- |
| slug | string | The desired URI string for the blog post (e.g. `/posts/2021-01-01-hello-world`) | Yes      |

## Response

A fully-populated `BlogPost` object:

```json
{
  "post": {
    "id": 13,
    "title": "Curiosity and the Value of Diving Deeper - A Personal Testimony",
    "author": "Matthew Wyskiel",
    "published": "2017-04-11T23:11:01+20:00",
    "category": "posts",
    "slug": "2017-04-11-curiosity-and-the-value-of-learning-a-personal-testimony",
    "excerpt": "A short string",
    "tags": ["learning", "curiosity", "testimony", "film", "apps", "ios"],
    "content": "A very, very long string"
  }
}
```

| name           | type     | description                                                                                       |
| -------------- | -------- | ------------------------------------------------------------------------------------------------- |
| post.id        | integer  | The post id                                                                                       |
| post.title     | string   | The post title                                                                                    |
| post.author    | string   | The name of the post author                                                                       |
| post.published | string   | The DateTime of the publishing of the post in ISO 8601 format                                     |
| post.category  | string   | The post category (default: `posts`)                                                              |
| post.slug      | string   | The desired URI string for the blog post (e.g. `/posts/2021-01-01-hello-world`)                   |
| post.excerpt   | string   | A short summary or abstract of the post, primarily for display on the home page or main blog page |
| post.tags      | string[] | Keywords to identify and categorize the post further                                              |
| post.content   | string   | The full text content of the post, in Markdown format                                             |

## Logic

1. Extract `slug` from path parameters
2. On DynamoDB table for blog posts, execute PartiQL query:

```
SELECT * FROM "${process.env.DYNAMODB_TABLE}" WHERE "slug" = '${slug}'
```

3. Return the first item retrieved from DynamoDB
