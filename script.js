// Load menu from menu.json
let menuData = [];

// Helper to append messages to status area
function pushMessage(text, type = 'info'){
	const messages = document.getElementById('messages');
	const el = document.createElement('div');
	el.className = `msg ${type}`;
	el.textContent = text;
	messages.prepend(el);
}

// 1) getMenu(): render the menu on the page
async function getMenu(){
	const container = document.getElementById('menu');
	container.innerHTML = '';
	// Fetch menu.json
	try{
		const resp = await fetch('menu.json');
		if(!resp.ok) throw new Error('Fetch failed');
		const data = await resp.json();
		menuData = data;
		pushMessage('Loaded menu from menu.json', 'info');
	}catch(e){
		console.error('Could not load menu.json', e);
		pushMessage('Error loading menu. Please serve this folder over HTTP.', 'warn');
		return;
	}

	// render
	menuData.forEach(item => {
		const card = document.createElement('div');
		card.className = 'card';
		card.innerHTML = `
			<img src="./images/burger.jpg" alt="${item.name}" />
			<div class="card-content">
				<h4>${item.name}</h4>
				<div class="price">$${Number(item.price).toFixed(2)}</div>
			</div>
			<div class="add-btn"></div>
		`;
		container.appendChild(card);
	})
	return menuData;
}

// 2) TakeOrder(): returns a Promise that resolves after 2500ms
// It randomly chooses three 'burgers' if available, otherwise random items
function TakeOrder(){
	pushMessage('Placing order...', 'info');
	return new Promise((resolve) => {
		setTimeout(() => {
			// try to pick 3 items containing 'burger' (case-insensitive)
			const burgers = menuData.filter(i => /burger/i.test(i.name));
			const chosen = [];
			const source = (burgers.length >= 3) ? burgers : menuData;
			// random pick 3 distinct items
			const copy = [...source];
			for(let i=0;i<3;i++){
				if(copy.length===0) break;
				const idx = Math.floor(Math.random()*copy.length);
				chosen.push(copy.splice(idx,1)[0]);
			}
			const total = chosen.reduce((s,it)=>s+Number(it.price),0);
			const order = { orderId: Date.now(), items: chosen, total: Number(total.toFixed(2)) };
			pushMessage(`Order placed (id: ${order.orderId}). Items: ${order.items.map(it=>it.name).join(', ')}`,'info');
			// show total in the order summary area and show full order object
			const summaryEl = document.getElementById('orderSummary');
			if(summaryEl){
				summaryEl.innerHTML = `<strong>Total:</strong> $${order.total.toFixed(2)} <br/><small>Order id: ${order.orderId}</small>`;
			}
			// also push a compact JSON view into messages
			pushMessage('Order object: ' + JSON.stringify(order), 'info');
			resolve(order);
		}, 2500);
	});
}

// 3) orderPrep(): returns a Promise that resolves in 1500ms reporting order is being prepared
function orderPrep(order){
	pushMessage('Order received by kitchen. Preparing...', 'info');
	return new Promise((resolve) => {
		setTimeout(() => {
			const status = { order_status: true, paid: false };
			pushMessage('Order prepared and ready for payment.', 'info');
			resolve(status);
		}, 1500);
	});
}

// 4) payOrder(): returns a Promise that resolves in 1000ms reporting payment done
function payOrder(orderStatus){
	pushMessage('Processing payment...', 'info');
	return new Promise((resolve) => {
		setTimeout(() => {
			const status = { order_status: true, paid: true };
			pushMessage('Payment successful. Thank you!', 'success');
			resolve(status);
		}, 1000);
	});
}

// 5) thankyouFnc() - show thank you message
function thankyouFnc(){
	pushMessage('Thank you for your order! Enjoy your meal. 🍽️', 'success');
	// small visual confirmation
	const statusArea = document.getElementById('messages');
	const t = document.createElement('div');
	t.className = 'msg success';
	t.textContent = 'Thank you — your order is complete.';
	statusArea.prepend(t);
}

// Wire up UI
document.addEventListener('DOMContentLoaded', () => {
	getMenu();
	
	// Wire up order button in hero banner
	const orderNowBtn = document.querySelector('.order-now-btn');
	if(orderNowBtn){
		orderNowBtn.addEventListener('click', startOrder);
	}
	
	// Also listen for any existing orderBtn if present
	const legacyBtn = document.getElementById('orderBtn');
	if(legacyBtn){
		legacyBtn.addEventListener('click', startOrder);
	}
});

async function startOrder(){
	// Show order status panel
	const panel = document.getElementById('orderStatus');
	if(panel) panel.classList.add('active');
	
	try{
		const order = await TakeOrder();
		const prep = await orderPrep(order);
		const paid = await payOrder(prep);
		if(paid.paid){
			thankyouFnc();
		}
	}catch(err){
		pushMessage('Something went wrong: '+err.message, 'warn');
	}
}

