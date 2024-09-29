# exhibitArt Backend

## Description

The exhibitArt backend is the API that supports the exhibitArt application. It offers a comprehensive set of endpoints for managing user interactions, including liking artworks, organizing them into collections, and facilitating user registration, login, and profile management. Built with Node.js, Express and MongoDB.

## Table of Contents

- [Endpoints](#endpoints)
- [Prerequisites](#prerequisites)
- [Environment Variables](#environment-variables)
- [Installation and Running Locally](#installation-and-running-locally)
- [Frontend Repository](#frontend-repository)

## Endpoints

### User Signup

- **POST** `/api/auth/signup`

  - **Description**: Creates a new user.
  - **Request Body**:

    ```json
    {
      "username": "string",
      "email": "string",
      "password": "string",
      "img": "string"
    }
    ```

### User Signin

- **POST** `/api/auth/signin`

  - **Description**: Authenticates a user.
  - **Request Body**:

    ```json
    {
      "username": "string",
      "password": "string"
    }
    ```

### Search and Sort Art

- **GET** `/api/art/search`

  - **Description**: Searches and sorts artworks based on query parameters.
  - **Query Parameters**:

        - `search`: Search term to filter artworks by title or artist.
        - `sortBy`: Criteria to sort the results by, e.g., date, title, or artist.
        - `orderBy`: Order of sorting. Use asc for ascending and desc for descending order.
        - `limit`: Number of artworks to return per page.
        - `page`: Page number for pagination.

### View Single Artwork

- **GET** `/api/art/:artId`

  - **Description**: Retrieves details of a single artwork by ID.
  - **Request Parameters**:

    - `artId`: ID of the artwork to retrieve.

### Update User

- **PUT** `/api/user/:id`

  - **Description**: Updates user details (username, email, password, img).
  - **Request Parameters**:
    - `id`: User ID to update.
  - **Request Body**:
    ```json
    {
      "username": "string",
      "email": "string",
      "password": "string",
      "img": "string"
    }
    ```
### Get User Profile

- **GET** `/api/user/:id`
  - **Description**: Retrieves user profile information.
  - **Request Parameters**:
    - `id`: User ID to retrieve.

### Delete User

- **DELETE** `/api/user/:id`
  - **Description**: Deletes a user account.
  - **Request Parameters**:
    - `id`: User ID to delete.

### Like Artwork

- **POST** `/api/user/:id/likes/:artId`
  - **Description**: Likes a specific artwork.
  - **Request Parameters**:
    - `id`: User ID to like artwork.
    - `artId`: ID of the artwork to like.

### Unlike Artwork

- **DELETE** `/api/user/:id/likes/:artId`
  - **Description**: Unlikes a specific artwork.
  - **Request Parameters**:
    - `id`: User ID to unlike artwork
    - `artId`: ID of the artwork to unlike.

### Add to Collection

- **POST** `/api/user/:id/collections/:artId`
  - **Description**: Adds an artwork to a user's collection.
  - **Request Parameters**:
    - `id`: User ID to add artwork to user collection.
    - `artId`: ID of the artwork to add to collection.
  - **Request Body**:
    ```json
    {
      "collectionName": "string"
    }
    ```

### Delete from Collection

- **DELETE** `/api/user/:id/collections/:collectionName/:artId`
  - **Description**: Removes an artwork from a user's collection.
  - **Request Parameters**:
    - `id`: User ID to remove artwork from user collection.
    - `collectionName` : Name of the collection to remove from.
    - `artId`: ID of the artwork to remove from collection.

### Delete Collection

- **DELETE** `/api/user/:id/collections/:collectionName`
  - **Description**: Deletes a user's collection.
  - **Request Parameters**:
    - `id`: User ID to remove user collection.
    - `collectionName` : Name of the collection to remove from.

### View Likes

- **GET** `/api/user/:id/likes`
  - **Description**: Retrieves a list of artworks liked by the user.
  - **Request Parameters**:
    - `id`: User ID to retrieve likes.

### View All Collections

- **GET** `/api/user/:id/collections`
  - **Description**: Retrieves all collections of the user.
- **Request Parameters**:
  - `id`: User ID to retrieve collection.

### View Single Collection

- **GET** `/api/user/:id/collections/:collectionName`
  - **Description**: Retrieves a single collection by collection name.
  - **Request Parameters**:
    - `id`: User ID to retrieve collection.
    - `collectionName`: Collection name to retrieve.

## Prerequisites

Ensure you have the following installed on your machine:

- Node.js
- npm
- MongoDB

## Environment Variables

Create a `.env` file in the root directory of your project with the following variables:

```plaintext
MONGO=your_mongodb_connection_string_here
```

```plaintext
API=your-harvard-api-key
```

You can obtain the API key from the Harvard API website.

## Installation and Running Locally

### Clone the Repository

```bash
git clone https://github.com/sawm2000/exhibition_curator.git
```

### Navigate to the project directory

```bash
cd exhibition_curator
```

### Install Dependencies

```bash
npm install
```

### Seed the Database

```bash
node seed.js
```

### Run the server

```bash
npm start
```

## Frontend Repository

The frontend code for the exhibitArt project can be found at [exhibitArt Frontend Repository](https://github.com/sawm2000/exhibition_curator_fe.git).
