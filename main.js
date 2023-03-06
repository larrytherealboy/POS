// ======= default data =======
const menu = document.querySelector("#menu");
const cart = document.querySelector("#cart");
const totalAmount = document.querySelector("#total-amount");
const amountNumber = document.querySelector("#amount-number");
const submitButton = document.querySelector(".submit-button");
const close = document.querySelector(".close");

let productData = [];
let cartItems = [];

// 菜單資料：從api端點拿資料
// 非同步請求，跑程式時最後才會跑
axios
  .get("https://ac-w3-dom-pos.firebaseio.com/products.json")
  .then(function (response) {
    // productData.push(...response.data)
    productData = response.data;
    addItem(productData);
  })
  .catch(function (error) {
    console.log(error);
  });

// 函式：新增品項
function addItem(products) {
  let htmlContent = ``;
  products.forEach(
    (product) =>
    (htmlContent += `
    <div class="col-3">
    <div class="card">
  <img src=${product.imgUrl} class="card-img-top" alt="...">
        <div class="card-body">
          <h5 class="card-title">${product.name}</h5>
          <p class="card-text">${product.price}</p>
          <a id=${product.id} href="#" class="item-button btn btn-primary" id="${product.id}">加入購物車</a>
        </div>
      </div>
    </div>`)
  );

  menu.innerHTML = htmlContent;
}

// 函式：加入購物車清單
function addToCart(event) {
  // 找到觸發event的node元素，並找到產品ID
  const id = event.target.id;

  // 在productData裡面找到相同id的資料，並放入新的資料陣列cartItems
  const addProduct = productData.find((product) => product.id === id);

  // 分辨是否已在購物車出現的品項，如果有的話，quantity加一
  const targetItem = cartItems.find((item) => item.id === id);
  if (targetItem) {
    targetItem.quantity += 1;
  } else {
    cartItems.push(addProduct);
    addProduct["quantity"] = 1;
  }
  addProduct["total"] = addProduct.price * addProduct.quantity;

  // 網頁顯示購物車清單
  cart.innerHTML = cartItems
    .map(
      (item) => `
  <li class='list-group-item'>${item.name} X ${item.quantity} 小計：${item.price * item.quantity
        }</li>
  `
    )
    .join("");

  // 總結金額
  let total = 0;
  cartItems.forEach((item) => (total += item.total));
  totalAmount.innerText = total;

  // 顯示總結金額在收據中
  amountNumber.innerHTML = totalAmount.innerHTML;
}

menu.addEventListener("click", addToCart);

// 增設監聽器：送出訂單視窗關閉後，清空購物車
close.addEventListener("click", function () {
  let cartList = cart.children;
  for (let i = cartList.length - 1; i >= 0; i--) {
    cartList[i].remove();
  }
  totalAmount.innerHTML = "--";
});
