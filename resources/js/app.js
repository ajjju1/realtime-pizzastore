import axios from "axios";
import Noty from "noty";
import { initAdmin } from './admin';
import moment from 'moment';

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

const alertMsg = document.querySelector("#success-alert")
if(alertMsg) {
    setTimeout(() =>{
        alertMsg.remove()
    }, 2000);
}


//Change order Status
let statuses = document.querySelectorAll(".status_line")
let hiddenInput = document.querySelector("#hiddenInput")
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order);
let time = document.createElement('small');
// console.log(order);

function updateStatus(order){
    statuses.forEach((status) =>{ //This loop we use because while realtime socket update
        status.classList.remove('step-completed')
        status.classList.remove('current');
    })
    let stepCompleted = true;
    statuses.forEach((status) =>{
      let dataProp = status.dataset.status
      if(stepCompleted){
          status.classList.add('step-completed')
      }  
      if(dataProp === order.status) {
          stepCompleted = false;
          time.innerText = moment(order.updatedAt).format('hh:mm A');
          status.appendChild(time)
          if(status.nextElementSibling){
          status.nextElementSibling.classList.add('current');
          }
      }
    }) 
}

updateStatus(order)

//Socket :-this socket is for client side 
let socket = io();
initAdmin(socket)
//join 
if(order){
    socket.emit('join',` order_${order._id}`);
    //The data seems like :- order_idname
}

let adminAreaPath = window.location.pathname
// console.log(adminAreaPath);
if(adminAreaPath.includes('admin')){
    socket.emit('join', 'adminRoom');
}

socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    console.log(data);
    updateStatus(updatedOrder);
    new Noty({
        type: "success",
        timeout : 1000,
        text: "Order updated",
        progressBar : false
    }).show();
})
  