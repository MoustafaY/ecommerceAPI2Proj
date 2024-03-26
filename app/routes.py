from flask import Blueprint, jsonify, request
from app.services import customerService, supplierService, productService, transcriptService, shoppingCartService, shipmentService, inventoryService, tokenService
from app.extensions import jwt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from datetime import timedelta, datetime
from werkzeug.exceptions import BadRequest
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm.exc import UnmappedInstanceError, NoResultFound
import uuid

routesBP = Blueprint('routes', __name__, url_prefix="/")

## /home

@routesBP.route('/Home', methods=['GET', 'POST'])
def homePage():
    return jsonify({"message": "welcome"}), 200

## /Customers
@routesBP.route('/Customers', methods=['GET'])
def getCustomers():
    return jsonify(customerService.get_all()), 200

@routesBP.route('/Customers', methods=['DELETE'])
def resetCustomers():
    customerService.reset()
    return jsonify({"message": "Customer table reset"}), 200
    
@routesBP.route('/Customers', methods=['POST'])
def createCustomer():
    try:
        data = request.json
        customers = data.get('customers', [])
        customersCreated = []
        for customer in customers:
            if 'name' not in customer or 'email' not in customer or 'password' not in customer:
                raise BadRequest
            newCustomer = customerService.create(name=customer.get("name"), email=customer.get("email"), password=customer.get("password"))
            customersCreated.append(newCustomer)
        return jsonify(customersCreated), 200
    except BadRequest:
        return jsonify({"message": "Invalid error"}), 400
    except IntegrityError:
        return jsonify({"message": "customer already exists"}), 409


## /Customer
@routesBP.route('/Customer', methods=['DELETE'])
@jwt_required()
def deleteCustomer():
    try:
        id = get_jwt_identity()
        customerService.delete(uuid.UUID(id))
        return jsonify({"message": "Customer deleted"}), 200
    except UnmappedInstanceError:
        return jsonify({"message": "Customer not found"}), 404
    
@routesBP.route('/Customer', methods=['PUT'])
@jwt_required()
def updateCustomer():
    try:
        id = get_jwt_identity()
        data = request.json
        updatedCustomer = customerService.update(uuid.UUID(id), name=data.get("name"))
        return jsonify(updatedCustomer), 200
    except BadRequest:
        return jsonify({"message": "Invalid input"}), 400
    
@routesBP.route('/Customer', methods=['POST'])
@jwt_required()
def payBalance():
    try:
        id = get_jwt_identity()
        data = request.json
        if 'payment' not in data:
            raise BadRequest
        customer = customerService.pay_balance(uuid.UUID(id), data.get("payment"))
        return jsonify(customer), 200
    except BadRequest:
        return jsonify({"message": "Invalid input"}), 400
    except ValueError:
        return jsonify({"message": "invalid amount"}), 401
    
@routesBP.route('/Customer', methods=["GET"])
@jwt_required()
def getCustomer():
    try:
        id = get_jwt_identity()
        customer = customerService.get_by_id(uuid.UUID(id))
        return jsonify(customer), 200
    except BadRequest:
        return jsonify({"message": "invalid input"}), 400

@routesBP.route('/Customer/ShoppingCart', methods=['GET'])
@jwt_required()
def getShoppingCart():
    try:
        id = get_jwt_identity()
        shoppingCart = shoppingCartService.get_by_customer(uuid.UUID(id))
        return jsonify(shoppingCart), 200
    except NoResultFound :
        return jsonify({"message": "Customer not found"}), 404
    
@routesBP.route('/Customer/ShoppingCart', methods=['POST'])
@jwt_required()
def addToShoppingCart():
    try:
        id = get_jwt_identity()
        data = request.json
        products = data.get('products', [])
        inventoryProducts = []
        for product in products:
            inventoryProduct = inventoryService.get_by_id(uuid.UUID(product["id"]))
            inventoryProduct["quantity"] = product["quantity"]
            inventoryProducts.append(inventoryProduct)
        shoppingCart = shoppingCartService.add_to_cart(uuid.UUID(id), inventoryProducts)
        return jsonify(shoppingCart), 200
    except NoResultFound:
        return jsonify({"message": "Customer not found"}), 404
    except KeyError:
        return jsonify({"message": "invalid input"}), 400

@routesBP.route('/Customer/ShoppingCart', methods=['PUT'])
@jwt_required()
def updateShoppingCart():
    try:
        id = get_jwt_identity()
        data = request.json
        products = data.get('products', [])
        shoppingCart = shoppingCartService.update_cart(uuid.UUID(id), products)
        return jsonify(shoppingCart), 200
    except NoResultFound:
        return jsonify({"message": "product not found"}), 404
    except KeyError:
        return jsonify({"message": "invalid input"}), 400

@routesBP.route('/Customer/ShoppingCart', methods=['DELETE'])
@jwt_required()
def removeFromShoppingCart():
    try:
        id = get_jwt_identity()
        data = request.json
        productId = data.get('productId')
        shoppingCart = shoppingCartService.remove_from_cart(uuid.UUID(id), uuid.UUID(productId))
        return jsonify(shoppingCart), 200
    except NoResultFound:
        return jsonify({"message": "Product not found"}), 404
    except KeyError:
        return jsonify({"message": "invalid input"}), 400


@routesBP.route('/Customer/Transcripts', methods=["POST"])
@jwt_required()
def createTranscript():
    try:
        id = get_jwt_identity()
        products = shoppingCartService.create_order(uuid.UUID(id))
        if len(products) == 0:
            return jsonify({"message": "shopping cart is empty"})
        inventoryService.accept_order(products)
        transcript = transcriptService.create(products, date=datetime.now(), customerId=uuid.UUID(id))
        customerService.update(uuid.UUID(id), balance = transcript["sum"])
        shoppingCartService.confirm_order(uuid.UUID(id))
        return jsonify(transcript), 200
    except NoResultFound:
        return jsonify({"message": "product not found"}), 404


@routesBP.route('Customer/Transcripts', methods=['GET'])
@jwt_required()
def getTranscripts():
    try:
        id = get_jwt_identity()
        transcripts = transcriptService.get_by_customer(uuid.UUID(id))
        return jsonify(transcripts), 200
    except NoResultFound:
        return jsonify({"message": "Customer not found"}), 404



## /Suppliers
@routesBP.route('/Suppliers', methods=['GET'])
def getSuppliers():
    return jsonify(supplierService.get_all()), 200

@routesBP.route('/Suppliers', methods=['DELETE'])
def resetSuppliers():
    supplierService.reset()
    return jsonify({"message": "Supplier table reset"}), 200
    
@routesBP.route('/Suppliers', methods=['POST'])
def createSupplier():
    try:
        data = request.json
        suppliers = data.get('suppliers', [])
        suppliersCreated = []
        for supplier in suppliers:
            if 'name' not in supplier or 'email' not in supplier or 'password' not in supplier:
                raise BadRequest
            newSupplier = supplierService.create(name=supplier.get("name"), email=supplier.get("email"), password=supplier.get("password"))
            suppliersCreated.append(newSupplier)
        return jsonify(suppliersCreated), 200
    except BadRequest:
        return jsonify({"message": "Invalid error"}), 400
    except IntegrityError:
        return jsonify({"message": "customer already exists"}), 409
    

## /Supplier
@routesBP.route('/Supplier', methods=['DELETE'])
@jwt_required()
def deleteSupplier():
    try:
        id = get_jwt_identity()
        supplierService.delete(uuid.UUID(id))
        return jsonify({"message": "Supplier deleted"}), 200
    except UnmappedInstanceError:
        return jsonify({"message": "Supplier not found"}), 404
    
@routesBP.route('/Supplier', methods=['PUT'])
@jwt_required()
def updateSupplier():
    try:
        id = get_jwt_identity()
        data = request.json
        if 'name' not in data:
            raise BadRequest
        updatedSupplier = supplierService.update(uuid.UUID(id), name=data.get("name"))
        return jsonify(updatedSupplier), 200
    except BadRequest:
        return jsonify({"message": "Invalid input"}), 400

@routesBP.route('/Supplier', methods=["GET"])
@jwt_required()
def getSupplier():
    try:
        id = get_jwt_identity()
        supplier = supplierService.get_by_id(uuid.UUID(id))
        return jsonify(supplier), 200
    except BadRequest:
        return jsonify({"message": "invalid input"}), 400
    

##/Supplier/Products
@routesBP.route('/Supplier/Products', methods=['GET'])
@jwt_required()
def getProductsFromSupplier():
    try:
        id = get_jwt_identity()
        products = productService.get_all_by_supplier(uuid.UUID(id))
        return jsonify(products), 200
    except UnmappedInstanceError:
        return jsonify({"message": "Supplier not found"}), 404

@routesBP.route('/Supplier/Products', methods=['POST'])
@jwt_required()
def createProduct():
    try:
        print("ehllo")
        id = get_jwt_identity()
        data = request.json
        newProduct = productService.create(name=data.get("name"), quantity=data.get("quantity"), price=data.get("price"), supplierId=uuid.UUID(id))
        return jsonify(newProduct), 200
    except UnmappedInstanceError:
        return jsonify({"message": "Supplier not found"}), 404
    except BadRequest:
        return jsonify({"message": "Invalid input"}), 400
    except IntegrityError:
        return jsonify({"message": "product already exists"}), 409
    

 ##/Supplier/Product   
@routesBP.route('/Supplier/Product', methods=['DELETE'])
@jwt_required()
def deleteProduct():
    try:
        data = request.json
        id = data.get("id")
        print(id)
        productService.delete(uuid.UUID(id))
        return jsonify({"message": "product deleted"}), 200
    except NoResultFound:
        return jsonify({"message": "product not found"}), 404

@routesBP.route('/Supplier/Product', methods=['PUT'])
@jwt_required()
def updateProduct():
    try:
        id = get_jwt_identity()
        data = request.json
        product = productService.update(uuid.UUID(id), uuid.UUID(data.get("id")), name=data.get("name"), quantity=data.get("quantity"), price=data.get("price"))
        return jsonify(product), 200
    except NoResultFound:
        return jsonify({"message": "product not found"}), 404
    except BadRequest:
        return jsonify({"message": "Invalid input"}), 400
    except PermissionError:
        return jsonify({"message": "You do not have permission for this product"}), 403


##/Products
@routesBP.route('/Products', methods=['DELETE'])
def resetProducts():
    productService.reset()
    return jsonify({"message": "Product table reset"}), 200


##/Supplier/Shipments
@routesBP.route('/Supplier/Shipments', methods=['GET'])
@jwt_required()
def getshipments():
    try:
        id = get_jwt_identity()
        shipments = shipmentService.get_all_by_supplier(uuid.UUID(id))
        return jsonify(shipments), 200
    except UnmappedInstanceError:
        return jsonify({"message": "Supplier not found"}), 404

@routesBP.route('/Supplier/Shipments', methods=['POST'])
@jwt_required()
def createShipment():
    try:
        id = get_jwt_identity()
        data = request.json
        inputProducts = data.get('products', [])
        products = productService.process_shipment(uuid.UUID(id), inputProducts)
        inventoryService.accept_shipment(products)
        shipment = shipmentService.create(inputProducts, date=datetime.now(), supplierId=uuid.UUID(id))
        return jsonify(shipment), 200
    except NoResultFound:
        return jsonify({"message": "product not found"}), 404
    except BadRequest:
        return jsonify({"message": "Invalid input"}), 400
    
@routesBP.route('/Supplier/Shipment', methods=['GET'])
@jwt_required()
def get_shipment():
    try:
        data = request.json
        shipmentId = data.get("shipmentId")
        shipment = shipmentService.get_by_id(uuid.UUID(shipmentId))
        return jsonify(shipment), 200
    except NoResultFound:
        return jsonify({"message": "shipment not found"}), 404
    except ValueError:
        return jsonify({"message": "Invalid ID"}), 400

## might delete, no need to delete shipment it is a record of the past
@routesBP.route('/Supplier/shipment', methods=['DELETE'])
@jwt_required()
def delete_shipment():
    try:
        data = request.json
        shipmentId = data.get("shipmentId")
        supplierService.delete_shipment(shipmentId)
        return jsonify({"message": "shipment deleted"}), 200
    except NoResultFound:
        return jsonify({"message": "shipment not found"}), 404
    except ValueError:
        return jsonify({"message": "Invalid ID"}), 400
    
@routesBP.route('/Supplier/Shipments', methods=['DELETE'])
def resetshipment():
    shipmentService.reset()
    return jsonify({"message": "reset shipment table"}), 200



##/Inventory
@routesBP.route('/Inventory', methods=['GET'])
def get_inventory():
    products = inventoryService.get_all()
    return jsonify(products), 200




## jwt
@jwt.token_in_blocklist_loader
def check_token(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    token = tokenService.getToken(jti)
    return token is not None

@routesBP.route('/logout', methods=['DELETE'])
@jwt_required()
def logout():
    jti = get_jwt()['jti']
    tokenService.addToken(jti)
    return jsonify({"message": "Logged out!"}), 200

@routesBP.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        user = data.get('user')
        email = data.get('email')
        password = data.get('password')
        print(user)
        if user == 'Customer':
            currentUser = customerService.get_by_email(email, password)
        elif user == 'Supplier':
            currentUser = supplierService.get_by_email(email, password)
        else:
            raise NoResultFound
        access_token = create_access_token(identity=currentUser.id, expires_delta=timedelta(minutes=30))
        return jsonify({'name': currentUser.name, 'token': access_token, 'user': user}), 200
    except NoResultFound:
        return jsonify({"message": "Incorrect password or email"}), 404

@routesBP.route('/Signup', methods=['POST'])
def createUser():
    try:
        data = request.json
        name = data.get("name")
        email = data.get("email")
        password = data.get("password")
        user = data.get("user")
        print(user)
        if user == "Customer":
            newUser = customerService.create(name=name, email=email, password=password)
        elif user == "Supplier":
            newUser = supplierService.create(name=name, email=email, password=password)
        else:
            raise NoResultFound
        access_token = create_access_token(identity=newUser["id"], expires_delta=timedelta(minutes=10))
        return jsonify({'name': newUser['name'], 'token': access_token, 'user': user}), 200
    except IntegrityError:
        return jsonify({"message": "User already exists"}), 409

@routesBP.route('/User', methods=['GET'])
@jwt_required()
def getUser():
    try:
        id = get_jwt_identity()
        result = customerService.get_for_user(uuid.UUID(id))
        if result is None:
            result = supplierService.get_for_user(uuid.UUID(id))
        return jsonify(result), 200
    except NoResultFound:
        return jsonify({"message": "User does not exist"}), 404

    