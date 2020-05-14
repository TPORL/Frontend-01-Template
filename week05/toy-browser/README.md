## HTTP 标准

HTTP/1.1

- [RFC7230](http://tools.ietf.org/html/7230)
- [RFC7231](http://tools.ietf.org/html/7231)
- [RFC7232](http://tools.ietf.org/html/7232)
- [RFC7233](http://tools.ietf.org/html/7233)
- [RFC7234](http://tools.ietf.org/html/7234)
- [RFC7235](http://tools.ietf.org/html/7235)

HTTPS

- [RFC2818](http://tools.ietf.org/html/2818)

HTTP/2

- [RFC7540](http://tools.ietf.org/html/7540)
- [RFC8740](http://tools.ietf.org/html/8740)

## Request Message

Syntax

> 仅供参考

```
RequestMessage::
  RequestLine HeaderFields EmptyLine MessageBody(opt)

RequestLine::
  Method <SP> RequestTarget <SP> HTTPVersion <CR><LF>

Method::
  GET
  HEAD
  POST
  PUT
  DELETE
  CONNECT
  OPTIONS
  TRACE

HeaderFields::
  HeaderFields
  HeaderField

HeaderField::
  FiledName ":" <SP>(opt) FieldValue <SP>(opt)

EmptyLine::
  <CR><LF>

MessageBody::
  any
```

Example

```
GET / HTTP/1.1
X-Foo2: customized
Content-Type: application/x-www-form-urlencoded
Content-Length: 10

name=TPORL
```

## Response Message

Syntax

> 仅供参考

```
ResponseMessage::
  StatusLine HeaderFields EmptyLine MessageBody

StatusLine::
  HTTPVersion <SP> StatusCode <SP> ReasonPhrase <CR><LF>

HeaderFields::
  HeaderFields
  HeaderField

HeaderField::
  FiledName ":" <SP>(opt) FieldValue <SP>(opt)

EmptyLine::
  <CR><LF>

MessageBody::
  any
```

Example

```
HTTP/1.1 200 OK
Content-Type: text/plain
X-Foo: bar
Date: Wed, 13 May 2020 04:22:59 GMT
Connection: keep-alive
Transfer-Encoding: chunked

2
ok
0
```
