import axios from "axios";
import Noty from "noty";

let addToCart = document.querySelectorAll('.add-to-cart');
let cartCounter = document.querySelector('#cartCounter');

function updateCart(pizza){
    axios.post('/update-cart',pizza).then(res =>{
        console.log(res);
        cartCounter.innerText = res.data.totalQty;
        new Noty({
            type: "success",
            timeout : 1000,
            text: "Item added to cart",
            progressBar : false
        }).show();
    }).catch(err =>{
        new Noty({
            type: "error",
            timeout : 1000,
            text: "Some thing went wrong ",
            progressBar : false
        }).show();
        console.log(`The error is ${err}`);
    }) 
}

addToCart.forEach((btn) =>{
    btn.addEventListener('click', (e) =>{
        let pizza = JSON.parse(btn.dataset.pizza);
        // console.log(JSON.parse(pizza)) This very important here we are
        //   getting the data from html page in using btn.dataset

        updateCart(pizza);
    })
})