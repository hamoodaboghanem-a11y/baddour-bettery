const productsEl = document.getElementById('products')
const cartBtn = document.getElementById('cart-btn')
const cartPanel = document.getElementById('cart-panel')
const cartItemsEl = document.getElementById('cart-items')
const cartCountEl = document.getElementById('cart-count')
const cartTotalEl = document.getElementById('cart-total')
const closeCart = document.getElementById('close-cart')
const checkoutBtn = document.getElementById('checkout-btn')
const checkoutPanel = document.getElementById('checkout-panel')
const closeCheckout = document.getElementById('close-checkout')
const checkoutForm = document.getElementById('checkout-form')

let products = []
let cart = JSON.parse(localStorage.getItem('shop_cart') || '[]')

function saveCart(){
  localStorage.setItem('shop_cart', JSON.stringify(cart))
  renderCart()
}

function fetchProducts(){
  fetch('products.json').then(r=>r.json()).then(data=>{products=data;renderProducts()})
}

function renderProducts(){
  productsEl.innerHTML = ''
  products.forEach(p=>{
    const card = document.createElement('article')
    card.className = 'card'
    card.innerHTML = `
      <img src="${p.image}" alt="${p.title}">
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="meta">
        <div>$${p.price.toFixed(2)}</div>
        <button data-id="${p.id}">Add</button>
      </div>`
    const btn = card.querySelector('button')
    btn.addEventListener('click', ()=>addToCart(p.id))
    productsEl.appendChild(card)
  })
}

function addToCart(id){
  const item = cart.find(i=>i.id===id)
  if(item) item.qty++
  else cart.push({id,qty:1})
  saveCart()
}

function renderCart(){
  const detailed = cart.map(i=>{
    const p = products.find(x=>x.id===i.id)
    return {...p, qty:i.qty}
  })
  cartItemsEl.innerHTML = ''
  let total = 0
  detailed.forEach(d=>{
    if(!d) return
    total += d.price * d.qty
    const el = document.createElement('div')
    el.className = 'cart-item'
    el.innerHTML = `
      <div>${d.title} <small>x${d.qty}</small></div>
      <div>$${(d.price*d.qty).toFixed(2)} <button class="secondary" data-remove="${d.id}">−</button></div>`
    cartItemsEl.appendChild(el)
  })
  cartTotalEl.textContent = total.toFixed(2)
  cartCountEl.textContent = cart.reduce((s,i)=>s+i.qty,0)
}

cartBtn.addEventListener('click', ()=>{cartPanel.classList.remove('hidden')})
closeCart.addEventListener('click', ()=>{cartPanel.classList.add('hidden')})
checkoutBtn.addEventListener('click', ()=>{checkoutPanel.classList.remove('hidden')})
closeCheckout.addEventListener('click', ()=>{checkoutPanel.classList.add('hidden')})

cartItemsEl.addEventListener('click', e=>{
  const id = e.target.dataset.remove
  if(!id) return
  const idx = cart.findIndex(i=>i.id===id)
  if(idx>-1){
    cart[idx].qty--
    if(cart[idx].qty<=0) cart.splice(idx,1)
    saveCart()
  }
})

checkoutForm.addEventListener('submit', e=>{
  e.preventDefault()
  const form = new FormData(checkoutForm)
  // In a real app you'd send this to a server + payment gateway
  alert('Order placed — thank you, ' + form.get('name'))
  cart = []
  saveCart()
  cartPanel.classList.add('hidden')
  checkoutPanel.classList.add('hidden')
  checkoutForm.reset()
})

// init
fetchProducts()
setTimeout(()=>renderCart(),200)
