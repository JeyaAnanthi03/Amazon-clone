import { rendorOrderSummary } from "./checkout/orderSummary.js";
import { renderPaymentSummary } from "./checkout/paymentSummary.js";
import { loadProducts, loadProductsFetch } from "../data/products.js";
import { loadCart } from "../data/cart.js";
//import "../data/cart-class.js";
//import "../data/backend-practice.js";
async function loadPage() {
  try {
    //throw "error1"; Manual Error
    await loadProductsFetch();
    await new Promise((resolve, reject) => {
      //throw 'error1';
      loadCart(() => {
        //reject('error2');
        resolve();
      });
    });
  } catch (error) {
    console.log("Unexpected error,Please try later.");
  }

  rendorOrderSummary();
  renderPaymentSummary();

  return "value2";
}
loadPage();
/*
Promise.all([
  loadProductsFetch(),
  new Promise((resolve) => {
    loadCart(() => {
      resolve();
    });
  }),
]).then(() => {
  rendorOrderSummary();
  renderPaymentSummary();
});
*/
/*
new Promise((resolve) => {
  loadProducts(() => {
    resolve();
  });
})
  .then(() => {
    return new Promise((resolve) => {
      loadCart(() => {
        resolve();
      });
    });
  })
  .then(() => {
    rendorOrderSummary();
    renderPaymentSummary();
  });
*/

/*
loadProducts(() => {
  loadCart(() => {
    rendorOrderSummary();
    renderPaymentSummary();
  });
});
*/

//Multiple Callbacks lead more nested loop. So Promises are used
