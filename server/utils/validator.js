var mongoose = require('mongoose');
var User = mongoose.model('User');
var Order = mongoose.model('Order');

exports.validate = function(model, item, next, callback) {
    switch(model) {
        case(Order):
            return validateOrder(item);
        default:
            return true;
    }
};

//var validateOrder = function(item) {
//
//}