from tests.conftest import client
from flask_jwt_extended import create_access_token

#customer tests
def test_create_customer_code(client):
    response = createCustomer(client, newCustomerData())
    assert response.status_code == 200

def test_repeat_create_customer(client):
    createCustomer(client, newCustomerData())
    response = createCustomer(client, newCustomerData())
    assert response.status_code == 409

def test_customer_login(client):
    createCustomer(client, newCustomerData())
    loginData = {
        "email": "email@gmail.com",
        "password": "pass",
        "user": "Customer"
    }
    response = client.post("http://127.0.0.1:5000/login", json=loginData)
    assert response.status_code == 200

def test_customer_missing_login(client):
    loginData = {
        "email": "email@gmail.com",
        "password": "pass",
        "user": "Customer"
    }
    response = client.post("http://127.0.0.1:5000/login", json=loginData)
    assert response.status_code == 404    

def test_delete_customer_len(client):
    data = getCustomers(client)
    createCustomer(client, newCustomerData())
    token = customerLogin(client)
    deleteCustomer(client, token)
    data = getCustomers(client)
    assert len(data) == 0

def test_update_customer_name(client):
    createCustomer(client, newCustomerData())
    token = customerLogin(client)
    response = updateCustomer(client, token, {"name": "suality"})
    data = response.json
    assert data["name"] == "suality"

def test_customer_add_to_shoppingCart(client):
    createCustomer(client, newCustomerData())
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = createProduct(client, token, newProductData())
    data = response.json
    product1 = data
    response = createProduct(client, token, secondProductData())
    data = response.json
    product2 = data
    createShipment(client, token, newShipmentData(product1, product2))
    logout(client, token)
    token = customerLogin(client)
    response = getInventory(client)
    data = response.json
    product = data[0]
    response = addToShoppingCart(client, token, newShoppingCartData(product))
    assert response.status_code == 200

def test_customer_get_shoppingCart(client):
    createCustomer(client, newCustomerData())
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = createProduct(client, token, newProductData())
    data = response.json
    product1 = data
    response = createProduct(client, token, secondProductData())
    data = response.json
    product2 = data
    createShipment(client, token, newShipmentData(product1, product2))
    logout(client, token)
    token = customerLogin(client)
    response = getInventory(client)
    data = response.json
    product = data[0]
    response = addToShoppingCart(client, token, newShoppingCartData(product))
    data = getShoppingCart(client, token)
    assert response.status_code == 200

def test_customer_delete_shoppingCart(client):
    createCustomer(client, newCustomerData())
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = createProduct(client, token, newProductData())
    data = response.json
    product1 = data
    response = createProduct(client, token, secondProductData())
    data = response.json
    product2 = data
    createShipment(client, token, newShipmentData(product1, product2))
    logout(client, token)
    token = customerLogin(client)
    response = getInventory(client)
    data = response.json
    product = data[0]
    response = addToShoppingCart(client, token, newShoppingCartData(product))
    deleteShoppingCart(client, token, product["id"])
    data = getShoppingCart(client, token)
    assert response.status_code == 200

def test_customer_create_order(client):
    createCustomer(client, newCustomerData())
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = createProduct(client, token, newProductData())
    data = response.json
    product1 = data
    response = createProduct(client, token, secondProductData())
    data = response.json
    product2 = data
    createShipment(client, token, newShipmentData(product1, product2))
    logout(client, token)
    token = customerLogin(client)
    response = getInventory(client)
    response = getInventory(client)
    data = response.json
    product = data[0]
    addToShoppingCart(client, token, newShoppingCartData(product))
    response = createOrder(client, token)
    assert response.status_code == 200

def test_transcript(client):
    createCustomer(client, newCustomerData())
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = createProduct(client, token, newProductData())
    data = response.json
    product1 = data
    response = createProduct(client, token, secondProductData())
    data = response.json
    product2 = data
    createShipment(client, token, newShipmentData(product1, product2))
    logout(client, token)
    token = customerLogin(client)
    response = getInventory(client)
    response = getInventory(client)
    data = response.json
    product = data[0]
    addToShoppingCart(client, token, newShoppingCartData(product))
    createOrder(client, token)
    response = getTranscripts(client, token)
    assert response.status_code == 200

def test_customer_payment(client):
    createCustomer(client, newCustomerData())
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = createProduct(client, token, newProductData())
    data = response.json
    product1 = data
    response = createProduct(client, token, secondProductData())
    data = response.json
    product2 = data
    createShipment(client, token, newShipmentData(product1, product2))
    logout(client, token)
    token = customerLogin(client)
    response = getInventory(client)
    response = getInventory(client)
    data = response.json
    product = data[0]
    addToShoppingCart(client, token, newShoppingCartData(product))
    createOrder(client, token)
    response = makePayment(client, token)
    assert response.status_code == 200







#supplier tests
def test_create_supplier_code(client):
    response = createSupplier(client, newSupplierData())
    assert response.status_code == 200

def test_repeat_create_supplier(client):
    createSupplier(client, newSupplierData())
    response = createSupplier(client, newSupplierData())
    assert response.status_code == 409

def test_supplier_login(client):
    createSupplier(client, newSupplierData())
    loginData = {
        "email": "joe@gmail.com",
        "password": "joe",
        "user": "Supplier"
    }
    response = client.post("http://127.0.0.1:5000/login", json=loginData)
    assert response.status_code == 200

def test_supplier_missing(client):
    loginData = {
        "email": "joe@gmail.com",
        "password": "joe",
        "user": "Supplier"
    }
    response = client.post("http://127.0.0.1:5000/login", json=loginData)
    assert response.status_code == 404

def test_delete_supplier_len(client):
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    deleteSupplier(client, token)
    data = getSuppliers(client)
    assert len(data) == 0

def test_update_supplier_name(client):
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = updateSupplier(client, token, {"name": "suality"})
    data = response.json
    assert data["name"] == "suality"

def test_supplier_create_product(client):
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = createProduct(client, token, newProductData())
    assert response.status_code == 200

def test_supplier_get_products(client):
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    createProduct(client, token, newProductData())
    response = getProducts(client, token)
    assert response.status_code == 200

def test_supplier_delete_product(client):
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = createProduct(client, token, newProductData())
    data = response.json
    deleteProduct(client, token, {"id": data["id"]})
    response = getProducts(client, token)
    assert response.status_code == 200

def test_supplier_update_product(client):
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = createProduct(client, token, newProductData())
    data = response.json
    response = updateProduct(client, token, {"id": data["id"], "name": "kiwi", "quantity": 1, "price" : 0.3})
    assert response.status_code == 200


def test_supplier_create_shipment(client):
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = createProduct(client, token, newProductData())
    data = response.json
    product1 = data
    response = createProduct(client, token, secondProductData())
    data = response.json
    product2 = data
    response = createShipment(client, token, newShipmentData(product1, product2))
    assert response.status_code == 200

def test_supplier_get_shipping(client):
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = createProduct(client, token, newProductData())
    data = response.json
    product1 = data
    response = createProduct(client, token, secondProductData())
    data = response.json
    product2 = data
    createShipment(client, token, newShipmentData(product1, product2))
    response = getShipments(client, token)
    assert response.status_code == 200



# authentication and setup
def newCustomerData():
    return {
        "name": "Moustafa",
        "email": "email@gmail.com",
        "password": "pass",
        "user": "Customer"
    }

def customerLogin(client):
    loginData = {
        "email": "email@gmail.com",
        "password": "pass",
        "user": "Customer"
    }
    response = client.post("http://127.0.0.1:5000/login", json=loginData)
    data = response.json
    token = data['token']
    return token

def logout(client, token):
    headers = {"Authorization": f"Bearer {token}"}
    client.delete("http://127.0.0.1:5000/logout", headers=headers)

def newSupplierData():
    return {
        "name": "Yousef",
        "email": "joe@gmail.com",
        "password": "joe",
        "user": "Supplier"
    }

def supplierLogin(client):
    loginData = {
        "email": "joe@gmail.com",
        "password": "joe",
        "user": "Supplier"
    }
    response = client.post("http://127.0.0.1:5000/login", json=loginData)
    data = response.json
    token = data['token']
    return token

def newProductData():
    return {
        "name": "banana",
        "quantity": 10,
        "price": 1.2
    }

def secondProductData():
    return {
        "name": "kiwi",
        "quantity": 20,
        "price": 2.9
    }

def multipleProductData():
    return {
        "products": [{
            "name": "banana",
            "quantity": 10,
            "price": 1.1
        },
        {
            "name": "apple",
            "quantity": 10,
            "price": 5.2
        }]
    }

def invalidProductData():
    return {
        "products": [{
            "na": "Yousef",
            "email": "joe@gmail.com",
            "password": "joe"
        }]
    }

def newShipmentData(product1, product2):
    return {"products":[
        {
            "productId": product1["id"],
            "name": product2["name"],
            "quantity": 1
        },
        {
            "productId": product2["id"],
            "name": product2["name"],
            "quantity": 1
        }
    ]}

def newTranscriptData():
    return {
         "products":[
        {
            "name": "banana",
            "quantity": 1
        },
        {
            "name": "apple",
            "quantity": 1
        }
    ]
    }

def newShoppingCartData(product):
    return {
            "id": product["id"],
            "name": product["name"],
            "price": product["price"],
            "quantity": 1
        }


def createCustomer(client, customerData):
    return client.post("http://127.0.0.1:5000/Signup", json=customerData)

def getCustomers(client):
    response = client.get("http://127.0.0.1:5000/Customers")
    return response.json

def deleteCustomer(client, token):
    headers = {"Authorization": f"Bearer {token}"}
    return client.delete("http://127.0.0.1:5000/Customer", headers=headers)

def updateCustomer(client, token, customerData):
    headers = {"Authorization": f"Bearer {token}"}
    return client.put("http://127.0.0.1:5000/Customer", json=customerData, headers=headers)


def createSupplier(client, supplierData):
    return client.post("http://127.0.0.1:5000/Signup", json=supplierData)

def getSuppliers(client):
    response = client.get("http://127.0.0.1:5000/Suppliers")
    return response.json

def deleteSupplier(client, token):
    headers = {"Authorization": f"Bearer {token}"}
    return client.delete("http://127.0.0.1:5000/Supplier", headers=headers)

def updateSupplier(client, token, supplierData):
    headers = {"Authorization": f"Bearer {token}"}
    return client.put("http://127.0.0.1:5000/Supplier", json=supplierData, headers=headers)


def createProduct(client, token, productData):
    headers = {"Authorization": f"Bearer {token}"}
    return client.post("http://127.0.0.1:5000/Supplier/Products", json=productData, headers=headers)

def getProducts(client, token):
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("http://127.0.0.1:5000/Supplier/Products", headers=headers)
    return response

def deleteProduct(client, token, productData):
    headers = {"Authorization": f"Bearer {token}"}
    return client.delete(f"http://127.0.0.1:5000/Supplier/Product", json=productData, headers=headers)

def updateProduct(client, token, newProductData):
    headers = {"Authorization": f"Bearer {token}"}
    return client.put(f"http://127.0.0.1:5000/Supplier/Product", json=newProductData, headers=headers)


def createTranscript(client, token, transcriptData):
    headers = {"Authorization": f"Bearer {token}"}
    return client.post("http://127.0.0.1:5000/Customer/Transcripts", json=transcriptData, headers=headers)

def getTranscripts(client, token):
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("http://127.0.0.1:5000/Customer/Transcripts", headers=headers)
    return response.json

def deleteTranscript(client, token, id):
    headers = {"Authorization": f"Bearer {token}"}
    return client.delete("http://127.0.0.1:5000/Customer/Transcripts", json={"transcriptId": id}, headers=headers)


def createShipment(client, token, ShipmentData):
    headers = {"Authorization": f"Bearer {token}"}
    return client.post("http://127.0.0.1:5000/Supplier/Shipments", json=ShipmentData, headers=headers)

def getShipments(client, token):
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("http://127.0.0.1:5000/Supplier/Shipments", headers=headers)
    return response

def deleteShipment(client, token, id):
    headers = {"Authorization": f"Bearer {token}"}
    return client.delete("http://127.0.0.1:5000/Supplier/Shipment", json={"ShipmentId": id}, headers=headers)


def addToShoppingCart(client, token, shoppingCartData):
    headers = {"Authorization": f"Bearer {token}"}
    return client.post("http://127.0.0.1:5000/Customer/ShoppingCart", json=shoppingCartData, headers=headers)

def getShoppingCart(client, token):
    headers = {"Authorization": f"Bearer {token}"}
    response = client.get("http://127.0.0.1:5000/Customer/ShoppingCart", headers=headers)
    return response.json

def deleteShoppingCart(client, token, id):
    headers = {"Authorization": f"Bearer {token}"}
    return client.delete("http://127.0.0.1:5000/Customer/ShoppingCart", json={"productId": id}, headers=headers)

def createOrder(client, token):
    headers = {"Authorization": f"Bearer {token}"}
    return client.post("http://127.0.0.1:5000/Customer/Transcripts", headers=headers)

def getTranscripts(client, token):
    headers = {"Authorization": f"Bearer {token}"}
    return client.get("http://127.0.0.1:5000/Customer/Transcripts", headers=headers)

def makePayment(client, token):
    headers = {"Authorization": f"Bearer {token}"}
    return client.post("http://127.0.0.1:5000/Customer", json={"payment": 1}, headers=headers)




def getInventory(client):
    return client.get("http://127.0.0.1:5000/Inventory")

