# ERD: Fitness App

Fitness App about making groups between people and athletics to motivate them for doing sports like running challenges and swimming .. etc

## Storage

We'll use a relational database (schema follows).
We 'll use Mysql

Data will be stored on the server on a separate, backed
up volume for resilience. There will be no replication or sharding of data at
this early stage.

### Schema

We 'll need at least the following documents to implement
the Service

**User**:
| Attribute | Type |
|-----------|------|
| ID | STRING/UUID |
| Name | STRING|
| Email | STRING |
| Photo | STRING |
| Role | STRING |
| Password | STRING|  
| PasswordConfirm| STRING|  
| PasswordChangedAt | DATE |
| PasswordResetToken | STRING |
| PasswordResetExpires | DATE |
| Active | BOOLEAN |

**Room**:
| Attribute | Type |
|-----------|------|
| ID | STRING/UUID |
| Title | STRING|
| Type | STRING |
| Photo | STRING |
| Members | [ USER_ID ] |
| Message | [ Meassge_ID ]|
| CreatedAt | DATE |

**Message**
| Attribute | Type |
|-----------|------|
| ID | STRING/UUID |
| Sender | USER_ID |
| Caption | STRING |
| Photo | STRING |
| CreatedAt | DATE |

## Server

A Simple HTTP server us responsible to authentication serving stored data ,
user can filter data via query string.

**WE WILL USE**

- Node.js is selected for implementing the server for speed of development.
- Express.js is the web server framework.
- Sequelize to be used as an ORM.

### Auth

A simple JWT-based auth mechanism is to be used , with passwords
encrypted and stored in the database.

### API

**Auth**:

```
/api/v1//signup                     [POST]
/api/v1//login                      [POST]
/api/v1//logout                     [GET]
/api/v1//forgetpassword             [POST]
/api/v1//resetpassword/:token       [PATCH]
/api/v1//updatepassword             [PATCH]

```

**Users**:

```
/api/v1/users/                     [GET]
/api/v1/users/:id                  [GET]
/api/v1/users/me                   [GET]
/api/v1/users/deleteMe             [DELETE]
/api/v1/users/updateMyPassword     [PATCH]
/api/v1/users/updateUserData       [PATCH]
```

**Rooms**:

```
/api/v1/rooms           [GET]
/api/v1/rooms           [POST]
/api/v1/rooms/:id       [GET]
/api/v1/rooms/:id       [PATCH]
/api/v1/rooms/:id       [DELETE]
```

**Message**:

```
/api/v1/messages        [GET]
/api/v1/messages        [POST]
/api/v1/messages/:id    [GET]
/api/v1/messages/:id    [PATCH]
/api/v1/messages/:id    [DELETE]
```

## Clients

We'll start with a mobile clients, possibly adding web clients later.

## Hosting

The code will be hosted on Github, PRs and issues welcome.
