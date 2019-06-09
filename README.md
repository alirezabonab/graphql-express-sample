# graphql express app

The assignment is to :

Create a GraphQL server which allows to look up a country by name and
returns the full name, population and a list of its official
currencies including current exchange rate to SEK. Requests should
require a valid JWT obtained from a separate /login endpoint and
should be rate limited to 10 requests per token per minute.

**Solution**

The solution is a express app which is implemented with **MVC** architecture. the core code is around **_routes, controller and services (models)_**.

### To start using

```
yarn
yarn start
```

In order to consume **APIs** you need first to sign up in service and then login with the credentials to get a **Token**, with the token you are able to run **Graphql** queries.

The endpoints are as below:

- /api/v1/user/singup -> post method ( body : {name , username, password})

- /api/v1/user/login -> post method ( body : {username, password})

- /api/v1/graphql 

------------

**Register**
```
curl -X POST \
  http://localhost:4000/api/v1/user/signup \
  -H 'Accept: */*' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/json' \
  -H 'Host: localhost:4000' \
  -H 'Postman-Token: 70f63265-7a89-46fc-9cab-e418cc60fa95,1176fc83-3f27-4fd9-b5e0-5d572487657d' \
  -H 'User-Agent: PostmanRuntime/7.13.0' \
  -H 'accept-encoding: gzip, deflate' \
  -H 'cache-control: no-cache' \
  -H 'content-length: 71' \
  -d '{
	"name":"John Smith",
	"username":"skywalker",
	"password":"asd123"
}'
```

----------------
**Login**
```
curl -X POST \
  http://localhost:4000/api/v1/user/login \
  -H 'Accept: */*' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/json' \
  -H 'Host: localhost:4000' \
  -H 'Postman-Token: eb380a6e-4eb3-48a7-ae34-0a3d5299a0d6,7dc3e30e-3277-4e71-8e19-0fa09257ab2e' \
  -H 'User-Agent: PostmanRuntime/7.13.0' \
  -H 'accept-encoding: gzip, deflate' \
  -H 'cache-control: no-cache' \
  -H 'content-length: 49' \
  -d '{
	"username":"skywalker",
	"password":"asd123"
}'
```

In the response you will get a Token which we will use in Graphql query request in header as 

`Authorization : Bearer {token}`

Sample response is: 
```
{
    "username": "skywalker",
    "name": "John Smith",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNreXdhbGtlciIsImlhdCI6MTU2MDEyMTQzMX0.pChgYyRumZXBbb_rdIyPEwRTiRJU1GotbOPDBOQXoKM"
}
```
-------------
**Graphql Query**

```
curl -X GET \
  'http://localhost:4000/api/v1/graphql?query=query%20getCountryInfo%28%24name%3A%20String%29%20%7B%0A%20%20%20%20country%28name%3A%20%24name%29%7B%0A%20%20%20%20name%2C%0A%20%20%20%20population%2C%0A%20%20%20%20currencies%20%7B%0A%20%20%20%20%20%20code%0A%20%20%20%20%20%20name%0A%20%20%20%20%20%20symbol%0A%20%20%20%20%20%20sekRate%0A%20%20%20%20%7D%0A%20%20%7D%20%0A%7D&variables=%7B%0A%20%20%22name%22%3A%20%22denmark%22%0A%7D&operationName=getCountryInfo' \
  -H 'Accept: */*' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InNreXdhbGtlciIsImlhdCI6MTU2MDEyMTQzMX0.pChgYyRumZXBbb_rdIyPEwRTiRJU1GotbOPDBOQXoKM' \
  -H 'Cache-Control: no-cache' \
  -H 'Connection: keep-alive' \
  -H 'Host: localhost:4000' \
  -H 'Postman-Token: b4e748d2-9ee4-4228-9ee4-c7476c153928,2b42b73e-96ca-4d92-9471-d211c171f39b' \
  -H 'User-Agent: PostmanRuntime/7.13.0' \
  -H 'accept-encoding: gzip, deflate' \
  -H 'cache-control: no-cache'
```

***If you send more than 10 requests per token per minutes app will reject the request.***