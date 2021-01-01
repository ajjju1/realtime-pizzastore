const homeControllers = require("../app/http/controllers/homeController");
const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authContoller");
const cartController = require("../app/http/controllers/customers/cartController");
const orderController = require("../app/http/controllers/customers/orderController");
const AdminOrderController = require("../app/http/controllers/customers/admin/orderContoller");
 

// Middlewares 
const guest = require('../app/http/middleware/guest');
const auth = require('../app/http/middleware/auth');
const admin = require('../app/http/middleware/admin');

// const orderControllers = require("../app/http/controllers/customers/orderController");
// console.log(orderController)

function initRoutes(app) {
    homeController().index

//***    NOTE Here  */
// (req,res){
//     res.render("/home")
// }
// The above anonymous is the same a homeContorller().index here
// the req and res(parameter) is passage on to the contoller folder 
    

    app.get("/", homeControllers().index);

    app.get("/cart", cartController().cart);
    
    app.get("/login", guest, authController().login);
    app.post("/login", authController().postLogin);
    
    app.get("/register", guest, authController().register);
    app.post("/register", authController().postRegister);        
    app.post('/logout', authController().logout);

    app.post("/update-cart", cartController().update)


    //Cutomer routes
    app.post("/orders", auth, orderController().store);
    app.get("/customer/orders", auth,  orderController().index);

    //Admin routes
    app.get('/admin/orders', admin, AdminOrderController().index)

}

module.exports = initRoutes;