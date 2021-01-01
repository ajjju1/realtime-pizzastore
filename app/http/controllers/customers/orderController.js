const Order = require('../../../models/order')
const moment = require('moment');
function orderControllers () {
    return{
        store(req,res) {
            // console.log(req.body); If the output is empty object( {} ) the we have forget 
            // the name attribute in login form kinldy see it or we have to express.json in 
            // server.js file
            //Vaildate request
            const { phone, address } = req.body
            if(!phone || !address){
                req.flash('error', "All fields are required");
                return res.redirect('/cart');
            }

            const order = new Order({
                customerId : req.user._id,
                items  : req.session.cart.items,
                phone : phone, //you can write this as one phone also bzc of object destructing
                address : address
            })

            order.save().then( result =>{
                req.flash('success', "Order placed successfully");
                delete req.session.cart
                return res.redirect('/customer/orders');
            }).catch(err =>{
                req.flash('error', `Something went wrong ${err}`);
                console.log("something wrong happens "+ err);
                return res.redirect('/cart');
            });
        },
        async index (req,res) {
            const orders = await Order.find({ customerId : req.user._id }, null,
                 { sort:{'createdAt' : -1 } })
            res.header('cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
            res.render("customers/orders", { orders : orders, moment : moment });
            console.log(orders);
        }
    }
}

module.exports = orderControllers
        