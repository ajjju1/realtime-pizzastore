const homeControllers = require("../app/http/controllers/homeController");
const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authContoller");
const cartController = require("../app/http/controllers/customers/cartController");

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
    
    app.get("/login", authController().login);
    
    app.get("/register", authController().register);

    app.post("/update-cart", cartController().update)
}

module.exports = initRoutes;