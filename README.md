# Minizon

## Objective
The goal of this project is to represent an ecommerce application where products are created, shipped, and bought. The project has two types of users. A supplier that creates and ships products to a warehouse.
Or a customer that buys products from the warehouse. The project uses flask and sqlalchemy for its backend, and uses reactjs for its frontend. The project is also deployed in aws using aws elastic beanstalk and s3 buckets. [This is the link to the project](http://minizon-static-bucket.s3-website.eu-north-1.amazonaws.com)

## Flask backend
### API calls

#### Create a user
Creates a user
* **URL** <br />
/Signup

* **Method** <br />
POST

* **URL Params** <br />
None

* **JWT required** <br />
None

* **Data Params** <br />
```json
{
  "name": "Moustafa",
  "email": "email@gmail.com",
  "password": "pass",
  "user": "Customer"
}
```

* **Success Response** <br />
  **Code:** 200 <br />
  **Content:** <br />
  ```json
  {
    "name" : "Moustafa",
    "token" : access_token,
    "refresh_token" : refresh_token,
    "user": user_obj
  }
  ```

* **Error response** <br />
  * **Code:** 409 <br />
  **Content:**  `{"message": "User already exists"}`
