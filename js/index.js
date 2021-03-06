document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('.search');
    const searchField = searchForm.querySelector('#searchGoods');
    const searchButton = searchForm.querySelector('#search-btn');
    const cartIcon = document.querySelector('#cart');
    const wishlist = document.querySelector('#wishlist');
    const logoHeader = document.querySelector('.logo');
    const goodsWrapper = document.querySelector('.goods-wrapper');
    const cartModal = document.querySelector('.cart');
    const category = document.querySelector('.category');
    const spinner = document.querySelector('#spinner');

    const wishList = [];

    const loading = () => {
        goodsWrapper.innerHTML = `
        <div id="spinner"><div class="spinner-loading">
        <div><div><div></div></div><div><div></div>
        </div><div><div></div></div><div><div></div>
        </div></div></div></div>`;
    };
    
    const createCart = (id, title, price, img) => {
        const cart = document.createElement('div');
        cart.className = 'card-wrapper col-12 col-md-6 col-lg-4 col-xl-3 pb-3';
        cart.innerHTML = `
        <div class="card">
        <div class="card-img-wrapper">
        <img class="card-img-top" src="./${img}" alt="">
                    <button class="card-add-wishlist"
                    data-item-id="${id}"></button>
                </div>
                <div class="card-body justify-content-between">
                <a href="#" class="card-title">${title}</a>
                <div class="card-price">${price}$</div>
                <div>
                        <button class="card-add-cart"
                        data-item-id="${id}">Add to cart</button>
                    </div>
                    </div>
                    </div>`;
                    return cart;
    };
    
    // goodsWrapper.appendChild(createCart(1, 'Darts', 23, 'img/temp/Archer.jpg'));
    // goodsWrapper.appendChild(createCart(2, 'Flamingo', 42, 'img/temp/Flamingo.jpg'));
    // goodsWrapper.appendChild(createCart(3, 'Socks', 5, 'img/temp/Socks.jpg'));
    // goodsWrapper.insertAdjacentElement('afterbegin', createCart(3, 'Socks', 5, 'img/temp/Socks.jpg'));
    
    const closeCart = event => {
        const target = event.target;
        if (target === cartModal ||
            target.className === 'cart-close' ||
            event.code === 'Escape') { 
                // or target.classList.contains('cart-close') or event.keyCode === 27
            cartModal.style.display = 'none';
            document.removeEventListener('keydown', closeCart);
        }
    };
    
    const openCart = event => {
        event.preventDefault();
        cartModal.style.display = 'flex';
        document.addEventListener('keydown', closeCart);
    };
    
    
    const renderCart = items => {
        goodsWrapper.textContent = '';

        if (items.length) {
            items.forEach(({ id, title, price, imgMin }) => { 
                // we could make destructuring while passing arguments to the function!!!
                // const { id, title, price, imgMin } = item; - was before passing destr arguments 
                goodsWrapper.appendChild(createCart(id, title, price, imgMin));
            });
            } else {
            goodsWrapper.textContent = '🔍 once more. No matches found!🦧';
        }
    };
    
    const randomSort = (items) => 
    items.sort( () => 0.5 - Math.random());
    
    const getGoods = (handler, filter) => { 
        loading();
        //handler is an universal name of parameter and its name could be anyth - like "abc"
        fetch('db/db.json')
        .then(response => response.json())
        .then(filter) // in fetch if we dont pass second function here we got "undefined and it will be skipped"
        .then(handler)
        .catch(error =>  {
            console.error(error.message);
        });
    };
    
    const chooseCategory = event => {
        event.preventDefault();
        const target = event.target;
        
        if (target.classList.contains('category-item')) {
            const categoryName = target.dataset.category;
            getGoods(renderCart, 
                items => items.filter(item => 
                    item.category.includes(categoryName)) 
                    // as category is an array we use Array.includes() method!
            );
        }
    };

    const searchGoods = event => {
        event.preventDefault();
        const input = event.target.elements.searchGoods;
        const inputValue = input.value.trim();
        if (inputValue !== '') {
            const searchString = new RegExp(inputValue, 'i');
            getGoods(renderCart, 
                items => items.filter(item => searchString.test(item.title)));
            // or:  items => items.filter(item => item.title.toLowerCase()
            //         .includes(inputValue.toLowerCase())));
        } else {
            searchForm.classList.add('error');
            setTimeout( () => {
                searchForm.classList.remove('error');
            }, 2000);
        }
        input.value = '';
    };

    const toggleWishList = (id, elem) => {
        if (wishList.indexOf(id) + 1) {
            wishList.splice(wishList.indexOf(id), 1);
            elem.classList.remove('active');
        } else {
            wishList.push(id); 
            elem.classList.add('active');
        }
        console.log(wishList);
    }; 

    const handleWishGoods = event => {
        const target = event.target;
        if (target.classList.contains('card-add-wishlist')) {
            toggleWishList(target.dataset.itemId, target);
            
        }
    };
            
            cartIcon.addEventListener('click', openCart);
            cartModal.addEventListener('click', closeCart);
            category.addEventListener('click', chooseCategory);
            searchForm.addEventListener('submit', searchGoods);
            goodsWrapper.addEventListener('click', handleWishGoods);

    getGoods(renderCart, randomSort); // we`ve put function as the argument
   
});

// free test API on https://jsonplaceholder.typicode.com/

    // fetch('https://jsonplaceholder.typicode.com/photos/1'). 
    //     then(response => response.json()).
    //     then(response => console.log(response));