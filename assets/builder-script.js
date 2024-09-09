document.addEventListener('DOMContentLoaded', function() {
  // Main container
  const mainContainer = document.getElementById('builder-container');

  // Builder Cart
  const cartTotal = document.getElementById('builder-cart-total');
  const cartItemsNumber = document.getElementById('builder-cart-total-items');
  const builderCartList = document.getElementById('builder-cart-list');
  
  // Charms and Spacers
  const noticeCharms = document.getElementById('b-notice'); // Notice for maximum number of charms
  const charmsList = document.getElementById('charms_presentation'); // Presentation for selected charms
  const tipsForDrugAndDrop = document.getElementById('druganddrop'); // Tips for drug and drop

  const swiperPaginationThumbs = document.querySelectorAll('.swiper-pagination-thumb'); // Button for selecting charms

  const charmsCheckboxes = Array.from(document.querySelectorAll('.charm-checkbox')); // Checkboxes for charms
  const spacersCheckboxes = Array.from(document.querySelectorAll('.spacer-checkbox')); // Checkboxes for charms

  let counterCharms = 0; // Counter for selected charms
  const maxCharms = 8; // Maximum number of charms

  const sortable = new Sortable(charmsList, {
      animation: 250,
      ghostClass: 'sortable-ghost',
      swap: true,
      swapClass: 'sortable-swap-highlight',
      swapThreshold: 0.65,
      onEnd: function () {
          console.log('Position updated');
          updateClasses(charmsList, maxCharms);
      },
  });

  charmsCheckboxes.forEach((checkbox, index) => {
    checkbox.addEventListener('click', function() {
      const isDuplicate = checkDublicateProducts(this.getAttribute('data-product-id'));
      if (counterCharms < maxCharms && !isDuplicate) {
        const productData = getProductFromLocalStorage(this.getAttribute('data-product-id'));
        createPresentationItem(productData, charmsList);
        addProductToCartStorage(productData);
        calcCartTotal();
        counterCharms++; 
        updateClasses(charmsList, maxCharms);
      }
      checkMaxCharms(counterCharms, maxCharms, noticeCharms); 
    });
  });
  
  spacersCheckboxes.forEach((checkbox, index) => {
    checkbox.addEventListener('click', function() {
      if (counterCharms < maxCharms) {
        const productData = getProductFromLocalStorage(this.getAttribute('data-product-id'));
        createPresentationItem(productData, charmsList);
        addProductToCartStorage(productData);
        calcCartTotal();
        counterCharms++; 
        updateClasses(charmsList, maxCharms);
      }
      checkMaxCharms(counterCharms, maxCharms, noticeCharms);
    });
  });

  function createPresentationItem(product, parentDiv) {
    const newPresentItem = document.createElement('div');
    newPresentItem.setAttribute('data-product-id', product.id);
    newPresentItem.classList.add('b-charms_presentation--item', `m-${counterCharms + 1}`);
    setTimeout(() => {
      newPresentItem.classList.add('m-showed');
    }, 300);
    const newCharmImage = document.createElement('img');
    newCharmImage.setAttribute('src', product.image);
    newCharmImage.classList.add('b-charms_presentation--item_img');
    newPresentItem.appendChild(newCharmImage);
    parentDiv.appendChild(newPresentItem);
    return newPresentItem;
  }
  
  function updateCharmListClass(presentationDiv, maxItems) {
    const selectedProducts = presentationDiv.children.length;
    presentationDiv.className = 'b-charms_presentation';

    if (selectedProducts > 0 && selectedProducts <= maxItems) {
        presentationDiv.classList.add(`m-${selectedProducts}`);
    }
  }

  function updateClasses(container, maxItems) {
    let allItems = Array.from(container.children);
    const selectedProducts = container.children.length;
    console.log(allItems);

    allItems.forEach(item => {
        item.classList.remove('m-3-line', 'm-2-line', 'm-1-line', 'm-center', 'm-l-col', 'm-r-col');
    });

    if (allItems.length % 2 !== 0) {
        container.classList.remove('m-even', 'm-single');
        container.classList.add('m-odd');
        if (allItems.length === 7) {
            allItems[0].classList.add('m-3-line', 'm-l-col');
            allItems[6].classList.add('m-3-line', 'm-r-col');

            allItems[1].classList.add('m-2-line', 'm-l-col');
            allItems[5].classList.add('m-2-line', 'm-r-col');

            allItems[2].classList.add('m-1-line', 'm-l-col');
            allItems[4].classList.add('m-1-line', 'm-r-col');

            allItems[3].classList.add('m-center');
        } else if (allItems.length === 5) {
            allItems[0].classList.add('m-2-line', 'm-l-col');
            allItems[4].classList.add('m-2-line', 'm-r-col');

            allItems[1].classList.add('m-1-line', 'm-l-col');
            allItems[3].classList.add('m-1-line', 'm-r-col');

            allItems[2].classList.add('m-center');
        } else if (allItems.length === 3) {
            allItems[0].classList.add('m-1-line', 'm-l-col');
            allItems[2].classList.add('m-1-line', 'm-r-col');

            allItems[1].classList.add('m-center');
        } else if (allItems.length === 1) {
            allItems[0].classList.add('m-center');
        }
    } else {
        container.classList.remove('m-odd', 'm-single');
        container.classList.add('m-even');

        if (allItems.length === 8) {
            allItems[0].classList.add('m-3-line', 'm-l-col');
            allItems[7].classList.add('m-3-line', 'm-r-col');

            allItems[1].classList.add('m-2-line', 'm-l-col');
            allItems[6].classList.add('m-2-line', 'm-r-col');

            allItems[2].classList.add('m-1-line', 'm-l-col');
            allItems[5].classList.add('m-1-line', 'm-r-col');

            allItems[3].classList.add('m-center', 'm-l-col');
            allItems[4].classList.add('m-center', 'm-r-col');
        } else if (allItems.length === 6) {
            allItems[0].classList.add('m-2-line', 'm-l-col');
            allItems[5].classList.add('m-2-line', 'm-r-col');

            allItems[1].classList.add('m-1-line', 'm-l-col');
            allItems[4].classList.add('m-1-line', 'm-r-col');

            allItems[2].classList.add('m-center', 'm-l-col');
            allItems[3].classList.add('m-center', 'm-r-col');
        } else if (allItems.length === 4) {
            allItems[0].classList.add('m-1-line', 'm-l-col');
            allItems[3].classList.add('m-1-line', 'm-r-col');

            allItems[1].classList.add('m-center', 'm-l-col');
            allItems[2].classList.add('m-center', 'm-r-col');
        } else if (allItems.length === 2) {
            allItems[0].classList.add('m-center', 'm-l-col');
            allItems[1].classList.add('m-center', 'm-r-col');
        }
      }
      if (allItems.length === 1) {
        container.classList.add('m-single');
      }
  }

  function checkMaxCharms(counter, maxItems, notice) {
    if (counter >= maxItems) {
      notice.classList.remove('hidden');
    } else {
      notice.classList.add('hidden');
    }

    if (counter >= 2) {
      tipsForDrugAndDrop.classList.add('m-showed');
    } else {
      tipsForDrugAndDrop.classList.remove('m-showed');
    }
  }

  swiperPaginationThumbs.forEach((btn, index) => {
    btn.addEventListener('click', function() {
      const currentProductId = btn.getAttribute('data-product-id'); 
      const productCurrent = getProductFromLocalStorage(currentProductId);
      addProductToCartStorage(productCurrent);
      calcCartTotal();
    });
  });

  function initializeFirstProduct() {
    const initFirstProduct = JSON.parse(localStorage.getItem('builder.activeChain'));
    console.log('initFirstProduct', initFirstProduct);
    addProductToCartStorage(getProductFromLocalStorage(initFirstProduct));
    calcCartTotal();
  }
  
  function getProductFromLocalStorage(productId) {
    const savedProducts = JSON.parse(localStorage.getItem('builder.selectedProducts'));

    if (!savedProducts || !Array.isArray(savedProducts)) {
        console.error('No products in localStorage.');
        return null;
    }
    const product = savedProducts.find(product => parseInt(product.id) === parseInt(productId));
    if (!product) {
        console.error(`Product with ID ${productId} not founded in localStorage.`);
        return null;
    }
    console.log(product);
    return product;
  }

  function checkDublicateProducts(productId) {
    const storageKey = `builder.builderCart`;
    const existingData = JSON.parse(localStorage.getItem(storageKey)) || [];
    console.log('existingData ', existingData);
    if (Array.isArray(existingData)) {
      
      const isDuplicate = existingData.some(existingProduct => parseInt(existingProduct.id) === parseInt(productId));
      return isDuplicate;
    }
  }

  // Cart
  function calcCartTotal() {
    const cartData = JSON.parse(localStorage.getItem('builder.builderCart')) || [];
    if (!Array.isArray(cartData)) {
        console.error('Данные в builder.builderCart не являются массивом.');
        return 0;
    }
    const total = cartData.reduce((sum, item) => {
        if (item.price && typeof item.price === 'number') {
            const qty = item.qty || 1;
            return sum + (item.price * qty);
        } else {
            console.warn('Продукт без корректного поля price:', item);
            return sum;
        }
    }, 0);
    const totalItems = cartData.reduce((sum, item) => sum + (item.qty || 1), 0);

    let catLengthText = totalItems > 1 ? ' items' : ' item';
    console.log(total);
    
    cartTotal.textContent = "$" + total.toFixed(2);
    cartItemsNumber.textContent = totalItems + catLengthText;
    return total;
}

  function addProductToCartStorage(product) {
    const storageKey = `builder.builderCart`;
    const existingData = JSON.parse(localStorage.getItem(storageKey)) || [];
    if (Array.isArray(existingData)) {
        const isActiveChains = JSON.parse(localStorage.getItem('builder.activeTab')) === 'chains';
        if (isActiveChains) {
            console.log('Step 1: Replacing the first element in the cart');
            existingData[0] = product;
            console.log(existingData[0]);
            localStorage.setItem(storageKey, JSON.stringify(existingData));
            addChildToCartStorage(product, 0);
            return;
        }

        if (!checkDublicateProducts(product.id)) {
            product.qty = 1;
            existingData.push(product);
            localStorage.setItem(storageKey, JSON.stringify(existingData));
        
            addChildToCartStorage(product);
            console.log(`Продукт добавлен: ${product.title}`);
        } else {
            console.log(`Продукт с id ${product.id} уже есть в корзине.`);
            existingData.forEach((existingProduct, index) => {
                if (existingProduct.id === product.id) {
                    existingProduct.qty = (existingProduct.qty || 1) + 1;
                    existingData[index] = existingProduct;
                    localStorage.setItem(storageKey, JSON.stringify(existingData));
                    console.log(`Продукт обновлен: ${existingProduct.title} (QTY: ${existingProduct.qty})`);
                    updateCartItemInDOM(existingProduct);
                }
            });
        }
    } else {
        localStorage.setItem(storageKey, JSON.stringify([product]));
        console.log(`Корзина была пустой, продукт добавлен: ${product.title}`);
    }
  }

  function updateCartItemInDOM(product) {
    const listItem = document.querySelector(`.b-builder__cart-list_item[data-product-id="${product.id}"]`);
    if (listItem) {
      if (product.qty > 0) {
          const qtyText = product.qty > 1 ? `<span class="b-builder__cart-list_item-qty">QTY: ${product.qty}</span>` : '';
          listItem.setAttribute('data-product-qty', product.qty);
          listItem.innerHTML = `
              <div class="b-builder__cart-list_item-inner">
                <span class="b-builder__cart-list_item-title">${product.title}</span>
                <span class="b-builder__cart-list_item-price">${product.price}</span>
                ${qtyText}
                <span class="b-builder__cart-list_item-remove" data-product-id="${product.id}">
                  <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 4.547 11.453 3.5 8 6.953 4.547 3.5 3.5 4.547 6.953 8 3.5 11.453 4.547 12.5 8 9.047l3.453 3.453 1.047-1.047L9.047 8 12.5 4.547z" fill="#010101"></path>
                  </svg>
                </span>
              </div>
          `;
          setTimeout(() => {
            listItem.classList.add('m-added');
        }, 400);
      } else {
          listItem.classList.remove('m-added');
          setTimeout(() => {
            listItem.remove();
        }, 400);
      } 
    }
  }

  function addChildToCartStorage(product, index = 1) {
    const listItem = document.createElement('li');
    listItem.className = 'b-builder__cart-list_item';
    listItem.setAttribute('data-product-id', product.id);
    listItem.setAttribute('data-product-qty', product.qty);
    listItem.innerHTML = `
      <div class="b-builder__cart-list_item-inner">
        <span class="b-builder__cart-list_item-title">${product.title}</span>
        <span class="b-builder__cart-list_item-price">${product.price}</span>
        <span class="b-builder__cart-list_item-remove" data-product-id="${product.id}">
          <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 4.547 11.453 3.5 8 6.953 4.547 3.5 3.5 4.547 6.953 8 3.5 11.453 4.547 12.5 8 9.047l3.453 3.453 1.047-1.047L9.047 8 12.5 4.547z" fill="#010101"></path>
          </svg>
        </span>
      </div>
    `;
    if (builderCartList.children.length > 0 && index === 0) {
      builderCartList.replaceChild(listItem, builderCartList.children[0]);
      setTimeout(() => {
        listItem.classList.add('m-added');
      }, 400);
    } else {
        builderCartList.appendChild(listItem);
        setTimeout(() => {
            listItem.classList.add('m-added');
        }, 400);
    }
  }

  function removeProductFromCartStorage(productId) {
    const storageKey = `builder.builderCart`;
    const existingData = JSON.parse(localStorage.getItem(storageKey)) || [];

    if (Array.isArray(existingData)) {
        const productIndex = existingData.findIndex(product => product.id === productId);
        if (productIndex !== -1) {
            const product = existingData[productIndex];
            if (product.qty > 1) {
                product.qty -= 1;
                existingData[productIndex] = product;
                console.log(`Количество продукта ${product.title} уменьшено до ${product.qty}.`);
            } else {
                existingData.splice(productIndex, 1);
                console.log(`Продукт с id ${productId} удален из корзины.`);
            }
            localStorage.setItem(storageKey, JSON.stringify(existingData));
            updateCartItemInDOM(product);
        }
    } else {
        console.log('Корзина пуста или данные повреждены.');
    }
}

  function clearCartStorage() {
      const storageKey = `builder.builderCart`;
      localStorage.setItem(storageKey, JSON.stringify([]));
      console.log(`Корзина с ключом ${storageKey} очищена и установлена как пустой массив.`);
  }

  builderCartList.addEventListener('click', function(event) {
    const removeButton = event.target.closest('.b-builder__cart-list_item-remove');
    if (removeButton) {
      const productId = removeButton.getAttribute('data-product-id');
      const qtyProductItem = removeButton.closest('.b-builder__cart-list_item');
      if (qtyProductItem && qtyProductItem.hasAttribute('data-product-qty')) {
        let qty = parseInt(qtyProductItem.getAttribute('data-product-qty'), 10);
        
        const charmToRemove = charmsList.querySelector(`[data-product-id="${productId}"]`);
        if (charmToRemove) {
          charmToRemove.classList.remove('m-showed');
          counterCharms--;
          maxSpacers = counterCharms - 1;
          
          setTimeout(() => {
            charmToRemove.remove();
            // updateCharmListClass(charmsList, maxCharms);
            updateClasses(charmsList, maxCharms);
            checkMaxCharms(counterCharms, maxCharms, noticeCharms); 
          }, 300);
        }

        if (qty > 1) {
          qty -= 1;
          removeProductFromCartStorage(productId);  
          calcCartTotal(); 
        } else {
          removeProductFromCartStorage(productId);
          calcCartTotal(); 
          qtyProductItem.classList.remove('m-added');
          qtyProductItem.remove();
        }
      }
    }
  });

  // localStorage.clear();
  clearCartStorage();
  initializeFirstProduct();
});
