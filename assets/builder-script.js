document.addEventListener('DOMContentLoaded', function() {
  // Main container
  const mainContainer = document.getElementById('builder-container');

  // Steps
  const steps = document.getElementById('builder-steps');
  const stepItems = Array.from(steps.querySelectorAll('.b-steps-item'));
  const totalSteps = stepItems.length;
  const stepNext = document.getElementById('builder-step-next');
  const stepPrev = document.getElementById('builder-step-prev');

  // Builder Cart
  const cartTotal = document.getElementById('builder-cart-total');
  const cartItemsNumber = document.getElementById('builder-cart-total-items');
  const builderCartList = document.getElementById('builder-cart-list');
  
  // Charms and Spacers
  const noticeCharms = document.getElementById('b-notice'); // Notice for maximum number of charms
  const noticeSpacers = document.getElementById('b-notice-1'); // Notice for maximum number of charms
  const charmsList = document.getElementById('charms_presentation'); // Presentation for selected charms
  const spacerList = document.getElementById('spacer_presentation'); // Presentation for selected spacers
  const selectBtn = document.getElementById('b-select_btn'); // Button for selecting charms
  const charmsCheckboxes = Array.from(document.querySelectorAll('.charm-checkbox')); // Checkboxes for charms
  let counterCharms = 0; // Counter for selected charms
  const maxCharms = 4; // Maximum number of charms
  const spacersCheckboxes = Array.from(document.querySelectorAll('.spacer-checkbox')); // Checkboxes for charms
  let counterSpacers = 0; // Counter for selected spacers
  let maxSpacers = 3; // Maximum number of spacers

  charmsCheckboxes.forEach((checkbox, index) => {
    checkbox.addEventListener('click', function() {
      const isDuplicate = checkDublicateProducts(this.getAttribute('data-product-id'));
      if (counterCharms < maxCharms && !isDuplicate) {
        const productData = getProductFromLocalStorage(this.getAttribute('data-product-id'));
        createPresentationItem(productData, charmsList);
        addProductToCartStorage(productData);
        calcCartTotal();
        counterCharms++; 
        maxSpacers = counterCharms - 1;
        updateCharmListClass(charmsList, maxCharms);
        checkStep();
      }
      checkMaxCharms(counterCharms, maxCharms, charmsCheckboxes, noticeCharms); 
    });
  });
  
  spacersCheckboxes.forEach((checkbox, index) => {
    checkbox.addEventListener('click', function() {
      if (counterSpacers + 1 < counterCharms) {
        console.log('counterSpacers', counterSpacers);
        console.log('counterCharms', counterCharms);
        const productData = getProductFromLocalStorage(this.getAttribute('data-product-id'));
        createPresentationItem(productData, spacerList);
        addProductToCartStorage(productData);
        calcCartTotal();
        counterSpacers++;
        maxSpacers = counterCharms - 1;
        updateCharmListClass(spacerList, maxCharms);
        checkStep();
        console.log(counterSpacers);
      } 
      checkMaxCharms(counterSpacers, maxSpacers, spacersCheckboxes, noticeSpacers);
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
  
  function checkMaxCharms(counter, maxItems, checkboxes, notice) {
    if (counter >= maxItems) {
      notice.classList.remove('hidden');
    } else {
      notice.classList.add('hidden');
    }
  }

  selectBtn.addEventListener('click', function() {
    const activeSlide = document.querySelector('#pendant-builder-container .swiper-slide-active');
    const currentProductId = activeSlide.getAttribute('data-product-active-id'); 

    
    const productCurrent = getProductFromLocalStorage(currentProductId);
    addProductToCartStorage(productCurrent);
    calcCartTotal();
    switchStep(2);
    checkStep();
  });

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

  function switchStep(targetStep) {
    const stepIndex = targetStep - 1;

    // Проверка корректности целевого шага
    if (stepIndex < 0 || stepIndex >= totalSteps) {
        console.error('Некорректный шаг:', targetStep);
        return;
    }

    stepItems.forEach((step, index) => {
        step.classList.remove('m-active', 'm-done');
    });

    mainContainer.classList.forEach(className => {
        if (className.startsWith('m-step-')) {
            mainContainer.classList.remove(className);
        }
    });

    stepItems.forEach((step, index) => {
        if (index < stepIndex) {
            step.classList.add('m-done');
        } else if (index === stepIndex) {
            step.classList.add('m-active');
        }
    });

    mainContainer.classList.add(`m-step-${targetStep}`);
    localStorage.setItem('builder.currentStep', targetStep);
  }

  stepNext.addEventListener('click', () => {
    let currentStep = Array.from(stepItems).findIndex(step => step.classList.contains('m-active')) + 1;

    console.log(currentStep);
    if (currentStep < totalSteps) {
        switchStep(currentStep + 1);
    }

    checkStep();
  });

  stepPrev.addEventListener('click', () => {
      let currentStep = Array.from(stepItems).findIndex(step => step.classList.contains('m-active')) + 1;

      console.log(currentStep);
      if (currentStep > 1) {
          switchStep(currentStep - 1);
      }

      checkStep();
  });

  function checkStep() {
    const currentStep = parseInt(localStorage.getItem('builder.currentStep'));
    checkMaxCharms(counterSpacers, maxSpacers, spacersCheckboxes, noticeSpacers);
    console.log(currentStep);
    if (currentStep === 1) {
      stepPrev.classList.add('hidden');
    } else if (currentStep === parseInt(totalSteps)) {
      stepNext.classList.add('hidden');
    } 
    else if (counterCharms < 1) {
      stepNext.classList.add('hidden');
    } else {
      stepPrev.classList.remove('hidden');
      stepNext.classList.remove('hidden');
    }
  };

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
        const isStep1 = localStorage.getItem('builder.currentStep') === '1';
        if (isStep1) {
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
              <span class="b-builder__cart-list_item-title">${product.title}</span>
              <span class="b-builder__cart-list_item-price">${product.price}</span>
              ${qtyText}
              <span class="b-builder__cart-list_item-remove" data-product-id="${product.id}">
                <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12.5 4.547 11.453 3.5 8 6.953 4.547 3.5 3.5 4.547 6.953 8 3.5 11.453 4.547 12.5 8 9.047l3.453 3.453 1.047-1.047L9.047 8 12.5 4.547z" fill="#010101"></path>
                </svg>
              </span>
          `;
      } else {
          listItem.remove();
      }
    }
  }

  function addChildToCartStorage(product, index = 1) {
    const listItem = document.createElement('li');
    listItem.className = 'b-builder__cart-list_item';
    listItem.setAttribute('data-product-id', product.id);
    listItem.setAttribute('data-product-qty', product.qty);
    listItem.innerHTML = `
        <span class="b-builder__cart-list_item-title">${product.title}</span>
        <span class="b-builder__cart-list_item-price">${product.price}</span>
        <span class="b-builder__cart-list_item-remove" data-product-id="${product.id}">
          <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 4.547 11.453 3.5 8 6.953 4.547 3.5 3.5 4.547 6.953 8 3.5 11.453 4.547 12.5 8 9.047l3.453 3.453 1.047-1.047L9.047 8 12.5 4.547z" fill="#010101"></path>
          </svg>
        </span>
    `;
    if (builderCartList.children.length > 0 && index === 0) {
      builderCartList.replaceChild(listItem, builderCartList.children[0]);
    } else {
        builderCartList.appendChild(listItem);
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
        const spacerToRemove = spacerList.querySelector(`[data-product-id="${productId}"]`);
        if (charmToRemove) {
          charmToRemove.classList.remove('m-showed');
          counterCharms--;
          maxSpacers = counterCharms - 1;
          
          setTimeout(() => {
            charmToRemove.remove();
            updateCharmListClass(charmsList, maxCharms);
            checkMaxCharms(counterCharms, maxCharms, charmsCheckboxes, noticeCharms); 
          }, 300);
        } else if (spacerToRemove) {
          spacerToRemove.classList.remove('m-showed');
          counterSpacers--;
          maxSpacers = counterCharms - 1;
          setTimeout(() => {
            spacerToRemove.remove();
            updateCharmListClass(spacerList, maxCharms);
            checkMaxCharms(counterSpacers, maxSpacers, spacersCheckboxes, noticeSpacers); 
          }, 300);
        }

        if (qty > 1) {
          qty -= 1;
          removeProductFromCartStorage(productId);  
          calcCartTotal(); 
        } else {
          removeProductFromCartStorage(productId);
          calcCartTotal(); 
          qtyProductItem.remove();
        }
      }
    }
  });

  // localStorage.clear();
  switchStep(1);
  checkStep(); // Set first step as active
  clearCartStorage();
});
