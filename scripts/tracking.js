import { getOrder } from "../data/orders.js";
import { getProduct, loadProductsFetch } from "../data/products.js";
import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";
import { calculateCartQuantity } from "../data/cart.js";

function updateCartQuantity() {
  const cartQuantity = calculateCartQuantity();
  document.querySelector(".js-cart-quantity").innerHTML = cartQuantity;
}
updateCartQuantity();
async function loadPage() {
  await loadProductsFetch();

  const url = new URL(window.location.href);
  const orderId = url.searchParams.get("orderId");
  const productId = url.searchParams.get("productId");

  const order = getOrder(orderId);
  const product = getProduct(productId);

  let productDetails;
  order.products.forEach((details) => {
    if (details.productId === product.id) {
      productDetails = details;
    }
  });

  const deliveryDate = dayjs(productDetails.estimatedDeliveryTime);
  const orderDate = dayjs(order.orderTime); // Make sure this exists in your order object
  const now = dayjs();

  const totalDuration = deliveryDate.diff(orderDate, "day");
  const elapsed = now.diff(orderDate, "day");

  let status = "Preparing";
  let progressPercent = 0;

  if (elapsed >= totalDuration) {
    status = "Delivered";
    progressPercent = 100;
  } else if (elapsed >= totalDuration / 2) {
    status = "Shipped";
    progressPercent = 66;
  } else {
    status = "Preparing";
    progressPercent = 33;
  }

  const trackingHTML = `
    <a class="back-to-orders-link link-primary" href="orders.html">
      View all orders
    </a>
    <div class="delivery-date">
      Arriving on ${deliveryDate.format("dddd, MMMM D")}
    </div>
    <div class="product-info">
      ${product.name}
    </div>
    <div class="product-info">
      Quantity: ${productDetails.quantity}
    </div>
    <img class="product-image" src="${product.image}">
    <div class="progress-labels-container">
      <div class="progress-label ${
        status === "Preparing" ? "current-status" : ""
      }">
        Preparing
      </div>
      <div class="progress-label ${
        status === "Shipped" ? "current-status" : ""
      }">
        Shipped
      </div>
      <div class="progress-label ${
        status === "Delivered" ? "current-status" : ""
      }">
        Delivered
      </div>
    </div>
    <div class="progress-bar-container">
      <div class="progress-bar" style="width: ${progressPercent}%;"></div>
    </div>
  `;

  document.querySelector(".js-order-tracking").innerHTML = trackingHTML;
}

loadPage();
