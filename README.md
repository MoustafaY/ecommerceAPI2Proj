# Minizon

## Objective
The goal of this project is to represent an ecommerce application where products are created, shipped, and bought. The project has two types of users. A supplier that creates and ships products to a warehouse.
Or a customer that buys products from the warehouse. The project is also deployed in aws using aws elastic beanstalk and s3 buckets. [This is the link to the project](http://minizon-static-bucket.s3-website.eu-north-1.amazonaws.com)

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


#### Login
User logs in to application

* **URL** <br />
/

* **Method** <br />
POST

* **URL Params** <br />
None

* **JWT required** <br />
None

* **Data Params** <br />
**Required:** <br />
```json
{
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
  * **Code:** 404 <br />
  **Content:**  `{"message": "Incorrect email or password"}`


#### Delete customer
Removes customer account from database

* **URL** <br />
/Customer

* **Method** <br />
DELETE

* **URL Params** <br />
None

* **JWT required**

* **Data Params** <br />
None

* **Success Response** <br />
  **Code:** 200 <br />
  **Content:** `{"message": "Customer deleted"}`


#### Update Customer information
Changes customer name

* **URL** <br />
/Customer

* **Method** <br />
PUT

* **URL Params** <br />
None

* **Data Params** <br />
**Required:** <br />
```json
{
    "name": "suality"
}
```

* **Success Response** <br />
**Code:** 200 <br />
**Content:** `{customer_object}`


#### Add to shopping cart
A customer adds a product from inventory to shopping cart

* **URL** <br />
/Customer/ShoppingCart

* **Method** <br />
POST

* **URL Params** <br />
None

* **Data Params** <br />
**Required:** <br />
```json
{
    "products": [
        {
            "id": "aa4ff3d7-db92-4c84-a840-a70e7651df03",
            "quantity": 2
        },
        {
            "id": "9c37b607-75fe-460d-9aae-2f2275ca53f5",
            "quantity": 3
        }
    ]
}
```

* **Success Response** <br />
**Code:** 200 <br />
**Content:** <br />
```json
{
    "id": "d78a2142-fc64-476d-b77c-61cf121f98b8",
    "products": [
        {
            "id": "aa4ff3d7-db92-4c84-a840-a70e7651df03",
            "name": "banana",
            "price": 1.1,
            "quantity": 2
        },
        {
            "id": "9c37b607-75fe-460d-9aae-2f2275ca53f5",
            "name": "apple",
            "price": 5.0,
            "quantity": 3
        }
    ],
    "sum": 17.2
}
```

* **Error Response** <br />
  * **Code:** 400 <br />
  **Content:** `{"message": "invalid input"}`
  OR
  * **Code: 404** <br />
  **Content:** `{"message": "product not found"}`
