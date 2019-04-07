# dlc-backend-task
A hub for GOT fans to share their ideas and theories.


## Prerequisites
### Software requirements
Softwares needed for this project

```
node
npm
```

### Installing

Run the followings commands to get the project running

```
$ git clone
$ cd <dir name>
$ npm install
$ npm start 
```

## API Documentation

**Signup**
----
  Registers a user to our system

* **URL**

  /users/signup

* **Method:**

  `POST`
  
*  **URL Params**

   None

* **Data Params**

  ```
  {
	"username":string,
	"firstname":string,
	"lastname":string,
	"email":email,
	"password":"string"
  }
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ message: "Successful Signup." }`
 
* **Error Response:**

  * **Code:** 400  <br />
    **Content:** `{ error : error message , status: 400 }`


**Login**
----
  Registers a user to our system

* **URL**

  /users/login

* **Method:**

  `POST`
  
*  **URL Params**

   None

* **Data Params**

  ```
  {
	"username":string,
  "password":string
  }
  ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** `{ message: "Successful Login.", "token":token }`
 
* **Error Response:**

  * **Code:** 400  <br />
    **Content:** `{ error : error message, status: 400 }`
    
    
**Profile**
----
  See info and posts of a user

* **URL**

  /users/:username

* **Method:**

  `GET`
  
*  **URL Params**

   username

* **Data Params**

   None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```
    {
    "username":string,
    "firstname":string,
    "lastname":string,
    "email":email,
    "posts":[ posts ]
    }
    ```
 
* **Error Response:**

  * **Code:** 400  <br />
    **Content:** `{ error : error message, status: 400 }`
  
  * **Code:** 401  <br />
    **Content:** `unauthorized`
    
 **Post**
----
  Allow user to post.

* **URL**

  /posts/

* **Method:**

  `POST`
  
*  **URL Params**

   None

* **Data Params**

   ```
   {
    "content":string
   }
   ```

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```
    {
      message: "Your post has been posted."
    }
    ```
 
* **Error Response:**

  * **Code:** 400  <br />
    **Content:** `{ error : error message, status: 400 }`
    
  * **Code:** 401  <br />
    **Content:** `unauthorized`
    
 **RecentPost**
----
  Allow user to view last 10 posts posted by all users.

* **URL**

  /posts/recent

* **Method:**

  `GET`
  
*  **URL Params**

   None

* **Data Params**
  
  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```
    [{
      id: id,
      creator: string,
      content: string
    }]
    ```
 
* **Error Response:**

  * **Code:** 400  <br />
    **Content:** `{ error : error message, status: 400 }`
         
  * **Code:** 401  <br />
    **Content:** `unauthorized`
    
 **Hashtag filter**
----
  Allow user to view posts that contain a specific hashtag

* **URL**

  /hashtag/:hashtag

* **Method:**

  `GET`
  
*  **URL Params**

   hashtag

* **Data Params**
  
  None

* **Success Response:**

  * **Code:** 200 <br />
    **Content:** 
    ```
    [{
      id: id,
      creator: string,
      content: string
    }]
    ```
 
* **Error Response:**

  * **Code:** 400  <br />
    **Content:** `{ error : error message, status: 400 }`
    
   * **Code:** 401  <br />
    **Content:** `unauthorized`
    
  



