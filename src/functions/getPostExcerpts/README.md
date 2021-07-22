# `getPostExcerpts` Function

## Endpoint

`GET /blog/post-excerpts`

## Input Parameters

### Query Parameters

| name  | type   | description                                       | required |
| ----- | ------ | ------------------------------------------------- | -------- |
| count | number | The number of posts to retrieve - defaults to all | No       |

### Example request

```
GET /blog/post-excerpts?count=2
```

## Response

An array of partially-populated `BlogPost` objects:

```json
{
  "posts": [
    {
      "id": 14,
      "title": "Outsourcing Requests - Retaining Control of Application Stability",
      "published": "2019-02-09T02:25:22+05:00",
      "slug": "2019-02-09-outsourcing-requests",
      "excerpt": "A short string"
    },
    ...
  ]
}
```

| name              | type    | description                                                                                       |
| ----------------- | ------- | ------------------------------------------------------------------------------------------------- |
| posts[].id        | integer | The post id                                                                                       |
| posts[].title     | string  | The post title                                                                                    |
| posts[].published | string  | The DateTime of the publishing of the post in ISO 8601 format                                     |
| posts[].slug      | string  | The desired URI string for the blog post (e.g. `/posts/2021-01-01-hello-world`)                   |
| posts[].excerpt   | string  | A short summary or abstract of the post, primarily for display on the home page or main blog page |

## Logic

1. Extract `count` from query parameters
2. On DynamoDB table for blog posts, execute PartiQL query:

```
SELECT id, title, published, slug, excerpt FROM "${process.env.DYNAMODB_TABLE}"
```

3. Sort the results by `id` descending
4. If `count` exists, then truncate array of posts to the first [`count`] items
5. Return the truncated array to the client
