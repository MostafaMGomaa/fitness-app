# ERD: Fitness App

## Storage

We 'll use a docment database (mongoDB).
We 'll host db at mongo atlas.

### Schema

We 'll need at least the following documents to implement
the Service

**User**:
| Attribute | Type |
|-----------|------|
| Name | String|
| Email | String |
| Photo | String |
| Role | String |
| Password | String|  
| PasswordConfirm| String|  
| PasswordChangedAt | Date |
| PasswordResetToken | String |
| PasswordResetExpires | Date |
| Active | Boolean |

## Server

A Simple HTTP server us responsible to authentication serving stored data ,
user can filter data via query string.

**WE WILL USE**

- Node.js for implementing server .
- Express.js is the web server framework.
- Mongoose ODM.

### Auth

A simple JWT-based auth mechanism is to be used , with passwords
encrypted and stored in the database.

### API

**Auth**:

```
/signup                     [POST]
/login                      [POST]
/logout                     [GET]
/forgetpassword             [POST]
/resetpassword/:token       [PATCH]
/updatepassword             [PATCH]
```

**USERS**:

```
users/                      [GET]
users/:id                   [GET]
users/me                    [GET]
users/deleteMe              [DELETE]
users/updateMyPassword      [PATCH]
users/updateUserData        [PATCH]

```
