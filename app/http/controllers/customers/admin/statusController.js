const Order = require("../../../../models/order");

function statusContollers(){
    return{
        update(req, res){
            
        Order.updateOne({_id : req.body.orderId}, {status : req.body.status }, (err, data) =>{
            if(err){
                res.flash("error", `error happen : = ${err}`)
                res.redirect('/admin/orders')
            }
            //Emit Event
            const eventEmitter = req.app.get('eventEmitter'); //here we'r getiing the event from server file 
            eventEmitter.emit('orderUpdated', { id: req.body.orderId, status: req.body.status })
            return res.redirect('/admin/orders')
        })
    }
  }
}

module.exports = statusContollers