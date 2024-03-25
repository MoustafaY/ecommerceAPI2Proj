from tests.conftest import client
from flask_jwt_extended import create_access_token

#customer tests
def test_create_customer_code(client):
    response = createCustomer(client, newCustomerData())
    assert response.status_code == 200
    
def test_create_customer_len(client):
    createCustomer(client, multipleCustomerData())
    data = getCustomers(client)
    assert len(data) == 2

def test_invalid_create_customer(client):
    response = createCustomer(client, invalidCustomerData())
    assert response.status_code == 400

def test_repeat_create_customer(client):
    createCustomer(client, newCustomerData())
    response = createCustomer(client, newCustomerData())
    assert response.status_code == 409

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

def test_invalid_update_customer(client):
    createCustomer(client, newCustomerData())
    token = customerLogin(client)
    response = updateCustomer(client, token, {"na": "suality"})
    assert response.status_code == 400

def test_customer_add_to_shoppingCart(client):
    createCustomer(client, newCustomerData())
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = createProduct(client, token, multipleProductData())
    data = response.json
    id1 = data[0]["id"]
    id2 = data[1]["id"]
    createShipment(client, token, newShipmentData(id1, id2))
    logout(client, token)
    token = customerLogin(client)
    response = getInventory(client)
    data = response.json
    id1 = data[0]["id"]
    id2 = data[1]["id"]
    response = addToShoppingCart(client, token, newShoppingCartData(id1, id2))
    assert response.status_code == 200

def test_customer_get_shoppingCart(client):
    createCustomer(client, newCustomerData())
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = createProduct(client, token, multipleProductData())
    data = response.json
    id1 = data[0]["id"]
    id2 = data[1]["id"]
    createShipment(client, token, newShipmentData(id1, id2))
    logout(client, token)
    token = customerLogin(client)
    response = getInventory(client)
    data = response.json
    id1 = data[0]["id"]
    id2 = data[1]["id"]
    addToShoppingCart(client, token, newShoppingCartData(id1, id2))
    data = getShoppingCart(client, token)
    assert len(data['products']) == 2

def test_customer_delete_shoppingCart(client):
    createCustomer(client, newCustomerData())
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = createProduct(client, token, multipleProductData())
    data = response.json
    id1 = data[0]["id"]
    id2 = data[1]["id"]
    createShipment(client, token, newShipmentData(id1, id2))
    logout(client, token)
    token = customerLogin(client)
    response = getInventory(client)
    data = response.json
    id1 = data[0]["id"]
    id2 = data[1]["id"]
    addToShoppingCart(client, token, newShoppingCartData(id1, id2))
    deleteShoppingCart(client, token, id1)
    data = getShoppingCart(client, token)
    assert len(data['products']) == 1

def test_customer_create_order(client):
    createCustomer(client, newCustomerData())
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = createProduct(client, token, multipleProductData())
    data = response.json
    id1 = data[0]["id"]
    id2 = data[1]["id"]
    createShipment(client, token, newShipmentData(id1, id2))
    logout(client, token)
    token = customerLogin(client)
    response = getInventory(client)
    data = response.json
    id1 = data[0]["id"]
    id2 = data[1]["id"]
    addToShoppingCart(client, token, newShoppingCartData(id1, id2))
    response = createOrder(client, token)
    assert response.status_code == 200

def test_transcript_length(client):
    createCustomer(client, newCustomerData())
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = createProduct(client, token, multipleProductData())
    data = response.json
    id1 = data[0]["id"]
    id2 = data[1]["id"]
    createShipment(client, token, newShipmentData(id1, id2))
    logout(client, token)
    token = customerLogin(client)
    response = getInventory(client)
    data = response.json
    id1 = data[0]["id"]
    id2 = data[1]["id"]
    addToShoppingCart(client, token, newShoppingCartData(id1, id2))
    createOrder(client, token)
    response = getTranscripts(client, token)
    data = response.json
    assert len(data) == 1

def test_customer_payment(client):
    createCustomer(client, newCustomerData())
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = createProduct(client, token, multipleProductData())
    data = response.json
    id1 = data[0]["id"]
    id2 = data[1]["id"]
    createShipment(client, token, newShipmentData(id1, id2))
    logout(client, token)
    token = customerLogin(client)
    response = getInventory(client)
    data = response.json
    id1 = data[0]["id"]
    id2 = data[1]["id"]
    addToShoppingCart(client, token, newShoppingCartData(id1, id2))
    createOrder(client, token)
    response = getTranscripts(client, token)
    data = response.json
    oldSum = data[0]["sum"]
    makePayment(client, token)
    response = getCustomers(client)
    newSum = response[0]["balance"]
    assert newSum + 1 == oldSum







#supplier tests
def test_create_supplier_code(client):
    response = createSupplier(client, newSupplierData())
    assert response.status_code == 200
    
def test_create_supplier_len(client):
    createSupplier(client, multipleSupplierData())
    data = getSuppliers(client)
    assert len(data) == 2

def test_invalid_create_supplier(client):
    response = createSupplier(client, invalidSupplierData())
    assert response.status_code == 400

def test_repeat_create_supplier(client):
    createSupplier(client, newSupplierData())
    response = createSupplier(client, newSupplierData())
    assert response.status_code == 409

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

def test_invalid_update_supplier(client):
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = updateSupplier(client, token, {"na": "suality"})
    assert response.status_code == 400



def test_supplier_create_product(client):
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = createProduct(client, token, newProductData())
    assert response.status_code == 200

def test_supplier_get_products(client):
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    createProduct(client, token, multipleProductData())
    data = getProducts(client, token)
    assert len(data) == 2

def test_supplier_create_invalid_products(client):
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = createProduct(client, token, invalidProductData())
    assert response.status_code == 400

def test_supplier_delete_product(client):
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = createProduct(client, token, multipleProductData())
    data = response.json
    product = data[0]
    deleteProduct(client, token, {"id": product["id"]})
    data = getProducts(client, token)
    assert len(data) == 1

def test_supplier_update_product(client):
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = createProduct(client, token, multipleProductData())
    data = response.json
    product = data[0]
    response = updateProduct(client, token, {"id": product["id"], "name": "kiwi", "quantity": 1, "price" : 0.3})
    assert response.status_code == 200

def test_supplier_update_invalid_product(client):
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = createProduct(client, token, multipleProductData())
    data = response.json
    product = data[0]
    response = updateProduct(client, token, {"id": product["id"], "na": "kiwi", "quantity": 1, "price" : 0.3})
    assert response.status_code == 400


def test_supplier_create_shipment(client):
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = createProduct(client, token, multipleProductData())
    data = response.json
    id1 = data[0]["id"]
    id2 = data[1]["id"]
    response = createShipment(client, token, newShipmentData(id1, id2))
    assert response.status_code == 200

def test_supplier_get_shipping(client):
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = createProduct(client, token, multipleProductData())
    data = response.json
    id1 = data[0]["id"]
    id2 = data[1]["id"]
    createShipment(client, token, newShipmentData(id1, id2))
    data = getShipments(client, token)
    assert len(data) == 1

def test_product_after_shipment(client):
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = createProduct(client, token, multipleProductData())
    data = response.json
    id1 = data[0]["id"]
    id2 = data[1]["id"]
    createShipment(client, token, newShipmentData(id1, id2))
    data = getProducts(client, token)
    assert data[0]["quantity"] == 9

def test_inventory_length_after_shipment(client):
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = createProduct(client, token, multipleProductData())
    data = response.json
    id1 = data[0]["id"]
    id2 = data[1]["id"]
    createShipment(client, token, newShipmentData(id1, id2))
    response = getInventory(client)
    data = response.json
    assert len(data) == 2

def test_inventory_quantity_after_shipment(client):
    createSupplier(client, newSupplierData())
    token = supplierLogin(client)
    response = createProduct(client, token, multipleProductData())
    data = response.json
    id1 = data[0]["id"]
    id2 = data[1]["id"]
    createShipment(client, token, newShipmentData(id1, id2))
    createShipment(client, token, newShipmentData(id1, id2))
    response = getInventory(client)
    data = response.json
    assert data[0]["quantity"] == 2



# authentication and setup
def newCustomerData():
    return {
        "customers": [{
            "name": "Moustafa",
            "email": "email@gmail.com",
            "password": "pass"
        }]
    }

def multipleCustomerData():
    return {
        "customers": [{
            "name": "Moustafa",
            "email": "email@gmail.com",
            "password": "pass"
        },
        {
            "name": "Lily",
            "email": "lil@gmail.com",
            "password": "lil"
        }]
    }

def invalidCustomerData():
    return {
        "customers": [{
            "na": "Moustafa",
            "email": "email@gmail.com",
            "password": "pass"
        }]
    }

def customerLogin(client):
    loginData = {
        "email": "email@gmail.com",
        "password": "pass",
        "user": "customer"
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
        "suppliers": [{
            "name": "Yousef",
            "email": "joe@gmail.com",
            "password": "joe"
        }]
    }

def multipleSupplierData():
    return {
        "suppliers": [{
            "name": "Yousef",
            "email": "joe@gmail.com",
            "password": "joe"
        },
        {
            "name": "Mohamed",
            "email": "kebz@gmail.com",
            "password": "kebz"
        }]
    }

def invalidSupplierData():
    return {
        "suppliers": [{
            "na": "Yousef",
            "email": "joe@gmail.com",
            "password": "joe"
        }]
    }

def supplierLogin(client):
    loginData = {
        "email": "joe@gmail.com",
        "password": "joe",
        "user": "supplier"
    }
    response = client.post("http://127.0.0.1:5000/login", json=loginData)
    data = response.json
    token = data['token']
    return token

def newProductData():
    return {
        "products": [{
            "name": "banana",
            "quantity": 3,
            "price": 1.1
        }]
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

def newShipmentData(id1, id2):
    return {"products":[
        {
            "productId": id1,
            "name": "banana",
            "quantity": 1
        },
        {
            "productId": id2,
            "name": "apple",
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

def newShoppingCartData(id1, id2):
    return {
    "products": [
        {
            "id": id1,
            "quantity": 1
        },
        {
            "id": id2,
            "quantity": 1
        }
    ]
}

def createCustomer(client, customerData):
    return client.post("http://127.0.0.1:5000/Customers", json=customerData)

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
    return client.post("http://127.0.0.1:5000/Suppliers", json=supplierData)

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
    return response.json

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
    return response.json

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

