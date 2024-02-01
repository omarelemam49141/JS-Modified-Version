export class CustomerMessages {
    constructor(id, customerName, messageContent, messageSentDate) {
        this.messageId = id;
        this.customerName = customerName;
        this.messageContent = messageContent;
        this.messageSentDate = messageSentDate;   
    }
}

export class Item {
    constructor(_productId, _productName, _image, _option, _quantity, _price, _totalPrice, _seller, _itemStatus) {
        this.productId = _productId;
        this.productName = _productName;
        this.image = _image;
        this.option = _option;
        this.quantity = _quantity;
        this.price = _price;
        this.totalPrice = _totalPrice;
        this.seller = _seller;
        this.itemStatus=_itemStatus;
    }
}

export class Order {
    constructor(_id, _userId, _clientName, _clientAddress, _date, _shipping, _totalPrice, _orderStatus, _items) {
        this.id = _id;
        this.userId = _userId;
        this.clientName = _clientName;
        this.clientAddress = _clientAddress;
        this.date = _date;
        this.shipping = _shipping;
        this.totalPrice = _totalPrice;
        this.orderStatus = _orderStatus;
        this.items = _items;
    }
}

export class Address {
    constructor( _username, _phoneNumber, _additionalNumber, _address, _additionalInformation, _region, _city) {
        this.username = _username;
        this.phoneNumber = _phoneNumber;
        this.additionalNumber = _additionalNumber;
        this.address = _address;
        this.additionalInformation = _additionalInformation;
        this.region = _region;
        this.city = _city;
    }
}



export class Product
{
    constructor(_productId, _productName, _category, _sellerName, _quantity, _quantity_sold, _images, _price, _description, _options)
    {
        this.productId=_productId;
        this.productName = _productName;
        this.category = _category;
        this.sellerName = _sellerName;
        this.quantity = _quantity;
        this.quantity_sold = _quantity_sold;
        this.images = _images;
        this.price = _price;
        this.description = _description;
        this.options = _options;
    }
}

export class users
{
    constructor(userID, userName, userPassword, userEmail, userRole,userGender) {
        this.userID = userID;
        this.userName = userName;
        this.userPassword = userPassword;
        this.userEmail = userEmail;
        this.userRole = userRole;
        this.userGender =userGender;
    }
}

export const StatusEnum = {
    New: 'New',
    InProgress: 'In progress',
    Completed: 'Completed'
};

export let categories = ["All", "Jewellery", "Accessories", "Artwork", "Pet-supplies", "Sweets"];


