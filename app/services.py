from app.baseService import BaseService
from app.repository import customerRepository, supplierRepository, productRepository, shoppingCartRepository, transcriptRepository, shipmentRepository, inventoryRepository, TokenRepository
import uuid

class CustomerService(BaseService):
    def __init__(self, repository):
        super().__init__(repository)

    def get_by_email(self, email, password):
        customer = self.repository.get_by_email(email, password)
        return customer
    
    def pay_balance(self, customerId, payment):
        customer = self.repository.pay_balance(customerId, payment)
        return self.format_output(customer)

    def format_output(self, customer):
        return {
            "id": customer.id,
            "name": customer.name,
            "email": customer.email,
            "balance": customer.balance,
            "user": "Customer"
        }

class SupplierService(BaseService):
    def __init__(self, repository):
        super().__init__(repository)

    def get_by_email(self, email, password):
        supplier = self.repository.get_by_email(email, password)
        return supplier

    def format_output(self, supplier):
        return {
            "id": supplier.id,
            "name": supplier.name,
            "email": supplier.email,
            "user": "Supplier"
        }

class ProductService(BaseService):
    def __init__(self, repository):
        super().__init__(repository)

    def get_all_by_supplier(self, id):
        queryProducts = self.repository.get_all_by_supplier(id)
        products = []
        for qProduct in queryProducts:
            products.append(self.format_output(qProduct))
        return products
    
    def update(self, supplierId, productId, **kwargs):
        product = self.repository.get_by_id(productId)
        if product.supplierId != supplierId:
            raise PermissionError
        newProduct = self.repository.update(product, **kwargs)
        return self.format_output(newProduct)

    def process_shipment(self, supplierId, inProducts):
        products = []
        for inProduct in inProducts:
            product = self.repository.get_by_id(uuid.UUID(inProduct["productId"]))
            if product.supplierId != supplierId:
                raise PermissionError
            if product.quantity < inProduct["quantity"] :
                raise ValueError
            products.append({"name": product.name, "quantity": inProduct["quantity"], "price": product.price, "supplierId": product.supplierId, "productId": product.id})
        
        for inProduct in inProducts:
            product = self.repository.get_by_id(uuid.UUID(inProduct["productId"]))
            product.quantity = product.quantity - inProduct["quantity"]

        self.repository.save()
        return products
            
    
    def format_output(self, product):
        return {
            "name": product.name,
            "id": product.id,
            "quantity": product.quantity,
            "price": product.price
        }

class ShoppingCartService(BaseService):
    def __init__(self, repository):
        super().__init__(repository)
    
    def get_by_customer(self, customerId):
        shoppingCart = self.repository.get_by_customer(customerId)
        return self.format_output(shoppingCart)
    
    def add_to_cart(self, customerId, products):
        for product in products:
            self.repository.add_to_cart(customerId, product)
        return self.get_by_customer(customerId)
    
    def update_cart(self, customerId, products):
        for product in products:
            self.repository.update_cart(customerId, product)
        return self.get_by_customer(customerId)
    
    def remove_from_cart(self, customerId, productId):
        self.repository.remove_from_cart(customerId, productId)
        return self.get_by_customer(customerId)
    
    def create_order(self, customerId):
        shoppingCart = self.repository.get_by_customer(customerId)
        return shoppingCart.shoppingCartProducts
    
    def confirm_order(self, customerId):
        self.repository.clear_cart(customerId)

    def format_output(self, shoppingCart):
        products = []
        for product in shoppingCart.shoppingCartProducts:
            products.append(self.format_product(product))
        return {
            "id": shoppingCart.id,
            "sum": shoppingCart.totalSum,
            "products": products
        }
    
    def format_product(self, product):
        return {
            "name": product.name,
            "id": product.inventoryId,
            "price": product.price,
            "quantity": product.quantity
        }


class TranscriptService(BaseService):
    def __init__(self, repository):
        super().__init__(repository)
    
    def get_by_customer(self, customerId):
        qTranscripts = self.repository.get_by_customer(customerId)
        transcripts = []
        for qTranscript in qTranscripts:
            transcripts.append(self.format_output(qTranscript))
        return transcripts

    def create(self, products, **kwargs):
        transcript = self.repository.create(**kwargs)
        self.add_to_transcript(transcript, products)
        return self.format_output(transcript)

    def add_to_transcript(self, transcript, products):
        self.repository.add_to_transcript(transcript, products)

    def format_output(self, transcript):
        products = []
        for product in transcript.transcriptProducts:
            products.append(self.format_product(product))
        return {
            "id": transcript.id,
            "sum": transcript.totalSum,
            "products": products
        }
    
    def format_product(self, product):
        return {
            "name": product.name,
            "id": product.inventoryId,
            "price": product.price,
            "quantity": product.quantity
        }

    def calculateSum(self, products):
        sum = 0
        for product in products:
            sum+= (product.price*product.quantity)
        return sum


class ShipmentService(BaseService):
    def __init__(self, repository):
        super().__init__(repository)
    
    def create(self, products, **kwargs):
        shipment = self.repository.create(**kwargs)
        self.add_to_shipment(shipment, products)
        return self.format_output(shipment)
    
    def add_to_shipment(self, shipment, products):
        self.repository.add_to_shipment(shipment, products)

    
    def get_all_by_supplier(self, id):
        queryShipments = self.repository.get_all_by_supplier(id)
        shipments = []
        for qShipment in queryShipments:
            shipments.append(self.format_output(qShipment))
        return shipments
    
    def format_output(self, shipment):
        products = []
        for product in shipment.shipmentProducts:
            products.append(self.format_product(product))
        return {
            "id": shipment.id,
            "date": shipment.date,
            "products": products
        }

    def format_product(self, product):
        return {
            "name": product.name,
            "quantity": product.quantity
        }


class InventoryService(BaseService):
    def __init__(self, repository):
        super().__init__(repository)

    def get_all(self):
        qProducts = self.repository.get_all()
        products = []
        for qProduct in qProducts:
            products.append(self.format_output(qProduct))
        return products

    def accept_shipment(self, products):
        outputProducts = []
        for product in products:
            outputProduct = self.repository.create(name=product["name"], quantity=product["quantity"], price=product["price"], supplierId=product["supplierId"], productId=product["productId"])
            outputProducts.append(self.format_output(outputProduct))
        return outputProducts
    
    def accept_order(self, products):
        for product in products:
            inventoryProduct = self.repository.get_by_id(product.inventoryId)
            if inventoryProduct.quantity < product.quantity:
                raise ValueError
            newQuantity = inventoryProduct.quantity - product.quantity
            self.repository.update(inventoryProduct, quantity=newQuantity)

        
    def format_output(self, product):
        return {
            "name": product.name,
            "id": product.id,
            "quantity": product.quantity,
            "price": product.price
        }
        

class TokenService:
    def __init__(self):
        self.repository = TokenRepository()

    def getToken(self, jti):
        return self.repository.getToken(jti)
    
    def addToken(self, jti):
        self.repository.addToken(jti)

customerService = CustomerService(customerRepository)
supplierService = SupplierService(supplierRepository)
productService = ProductService(productRepository)
shoppingCartService = ShoppingCartService(shoppingCartRepository)
transcriptService = TranscriptService(transcriptRepository)
shipmentService = ShipmentService(shipmentRepository)
inventoryService = InventoryService(inventoryRepository)
tokenService = TokenService()