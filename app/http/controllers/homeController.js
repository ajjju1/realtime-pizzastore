const Menu = require('../../models/menu')
function homeControllers() {
    return {
        async index(req, res) {  //This line same as index : function(req,res)}{}

            const pizzas = await Menu.find()
            // console.log(pizzas)
            return res.render('home', {pizzas : pizzas})
            
            // Menu.find().then(function(pizzas){
            //     console.log(pizzas)
            //     return res.render('home', {pizzas : pizzas})
            // }).catch((err)=>{
            //     console.log(`The Error is :- ${err}`);
            // })
           
        }
    }
}


module.exports = homeControllers;