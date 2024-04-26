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
    


## /Customer
@routesBP.route('/Customer', methods=['DELETE'])
@jwt_required()
def deleteCustomer():
    try:
        id = get_jwt_identity()
        customerService.delete(uuid.UUID(id))
        return jsonify({"message": "Customer deleted"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 404
    
@routesBP.route('/Customer', methods=['PUT'])
@jwt_required()
def updateCustomer():
    try:
        id = get_jwt_identity()
        data = request.json
        updatedCustomer = customerService.update(uuid.UUID(id), name=data.get("name"))
        return jsonify(updatedCustomer), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 409

@routesBP.route('/Customer/balance', methods=['GET'])
@jwt_required()
def getBalance():
    try:
        id = get_jwt_identity()
        balance = customerService.get_balance(uuid.UUID(id))
        return jsonify(balance), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400
    
@routesBP.route('/Customer', methods=['POST'])
@jwt_required()
def payBalance():
    try:
        id = get_jwt_identity()
        data = request.json
        customer = customerService.pay_balance(uuid.UUID(id), data.get("payment"))
        balance = customerService.get_balance(uuid.UUID(id))
        return jsonify(balance), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 409
    
@routesBP.route('/Customer', methods=["GET"])
@jwt_required()
def getCustomer():
    try:
        id = get_jwt_identity()
        customer = customerService.get_by_id(uuid.UUID(id))
        return jsonify(customer), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400

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
        shoppingCart = shoppingCartService.add_to_cart(uuid.UUID(id), data)
        return jsonify(shoppingCart), 200
    except NoResultFound:
        return jsonify({"message": "Customer not found"}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 409

@routesBP.route('/Customer/ShoppingCart', methods=['PUT'])
@jwt_required()
def updateShoppingCart():
    try:
        id = get_jwt_identity()
        data = request.json
        shoppingCart = shoppingCartService.update_cart(uuid.UUID(id), data)
        return jsonify(shoppingCart), 200
    except NoResultFound:
        return jsonify({"message": "product not found"}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 409
    

@routesBP.route('/Customer/ShoppingCart', methods=['DELETE'])
@jwt_required()
def removeFromShoppingCart():
    try:
        id = get_jwt_identity()
        data = request.json
        shoppingCart = shoppingCartService.remove_from_cart(uuid.UUID(id), data)
        return jsonify(shoppingCart), 200
    except NoResultFound:
        return jsonify({"message": "Product not found"}), 404
    except Exception as e:
        return jsonify({"message": str(e)}), 400


@routesBP.route('/Customer/Transcripts', methods=["POST"])
@jwt_required()
def createTranscript():
    try:
        id = get_jwt_identity()
        products = shoppingCartService.create_order(uuid.UUID(id))
        if len(products) == 0:
            return jsonify({"message": "shopping cart is empty"}), 400
        inventoryService.accept_order(products)
        transcript = transcriptService.create(products, date=datetime.now(), customerId=uuid.UUID(id))
        customerService.update(uuid.UUID(id), balance = transcript["sum"])
        shoppingCartService.confirm_order(uuid.UUID(id))
        return jsonify(transcript), 200
    except ValueError:
        return jsonify({"message": "Quantity exceeds avaiable inventory"}), 404


@routesBP.route('Customer/Transcripts', methods=['GET'])
@jwt_required()
def getTranscripts():
    try:
        id = get_jwt_identity()
        transcripts = transcriptService.get_by_customer(uuid.UUID(id))
        return jsonify(transcripts), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 404


## /Suppliers
@routesBP.route('/Suppliers', methods=['GET'])
def getSuppliers():
    return jsonify(supplierService.get_all()), 200
    


## /Supplier
@routesBP.route('/Supplier', methods=['DELETE'])
@jwt_required()
def deleteSupplier():
    try:
        id = get_jwt_identity()
        supplierService.delete(uuid.UUID(id))
        return jsonify({"message": "Supplier deleted"}), 200
    except ValueError:
        return jsonify({"message": "An error has occured"}), 404
    
@routesBP.route('/Supplier', methods=['PUT'])
@jwt_required()
def updateSupplier():
    try:
        id = get_jwt_identity()
        data = request.json
        updatedSupplier = supplierService.update(uuid.UUID(id), name=data.get("name"))
        return jsonify(updatedSupplier), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 409

@routesBP.route('/Supplier', methods=["GET"])
@jwt_required()
def getSupplier():
    try:
        id = get_jwt_identity()
        supplier = supplierService.get_by_id(uuid.UUID(id))
        return jsonify(supplier), 200
    except Exception as e:
        return jsonify({"message": e}), 400
    

##/Supplier/Products
@routesBP.route('/Supplier/Products', methods=['GET'])
@jwt_required()
def getProductsFromSupplier():
    try:
        id = get_jwt_identity()
        products = productService.get_all_by_supplier(uuid.UUID(id))
        return jsonify(products), 200
    except Exception:
        return jsonify({"message": "An error has occured"}), 404

@routesBP.route('/Supplier/Products', methods=['POST'])
@jwt_required()
def createProduct():
    try:
        id = get_jwt_identity()
        data = request.json
        newProduct = productService.create(name=data.get("name"), quantity=data.get("quantity"), price=data.get("price"), supplierId=uuid.UUID(id))
        return jsonify(newProduct), 200
    except IntegrityError:
        return jsonify({"message": "Product already exists"}), 409
    

##/Supplier/Product   
@routesBP.route('/Supplier/Product', methods=['DELETE'])
@jwt_required()
def deleteProduct():
    try:
        data = request.json
        id = data.get("id")
        productService.delete(uuid.UUID(id))
        return jsonify({"message": "product deleted"}), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 404

@routesBP.route('/Supplier/Product', methods=['PUT'])
@jwt_required()
def updateProduct():
    try:
        id = get_jwt_identity()
        data = request.json
        product = productService.update(uuid.UUID(id), uuid.UUID(data.get("id")), name=data.get("name"), quantity=data.get("quantity"), price=data.get("price"))
        return jsonify(product), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 409



##/Supplier/Shipments
@routesBP.route('/Supplier/Shipments', methods=['GET'])
@jwt_required()
def getshipments():
    try:
        id = get_jwt_identity()
        shipments = shipmentService.get_all_by_supplier(uuid.UUID(id))
        return jsonify(shipments), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 404

@routesBP.route('/Supplier/Shipments', methods=['POST'])
@jwt_required()
def createShipment():
    try:
        id = get_jwt_identity()
        data = request.json
        inventory_products = productService.process_shipment(uuid.UUID(id), data.get("products", []))
        inventoryService.accept_shipment(inventory_products)
        shipment = shipmentService.create(inventory_products, date=datetime.now(), supplierId=uuid.UUID(id))
        return jsonify(shipment), 200
    except ValueError:
        return jsonify({"message": "Quantity exceed available inventory"}), 409
    
@routesBP.route('/Supplier/Shipment', methods=['GET'])
@jwt_required()
def get_shipment():
    try:
        data = request.json
        shipmentId = data.get("shipmentId")
        shipment = shipmentService.get_by_id(uuid.UUID(shipmentId))
        return jsonify(shipment), 200
    except Exception as e:
        return jsonify({"message": str(e)}), 400



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
        if user == "Customer":
            newUser = customerService.create(name=name, email=email, password=password)
        elif user == "Supplier":
            newUser = supplierService.create(name=name, email=email, password=password)
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


def format_error(message):
    invalid_input_messages = ["positive_quantity", "positive_price", "non_empty_name", "non_empty_password", "non_empty_email"]
    if message == "UNIQUE constraint failed":
        return "Product already exists"
    elif message in invalid_input_messages:
        return "Invalid input"
    return "User already exists"