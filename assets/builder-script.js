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
    const charmImageSrc = checkbox.getAttribute('data-charm').replace(/['"]+/g, '');

    checkbox.addEventListener('click', function() {
      const getSecondProducts = JSON.parse(localStorage.getItem('builder.secondStepProducts'));
      // if (this.checked) {
        if (getSecondProducts.length < maxCharms) {
          const productData = getProductFromLocalStorage(this.getAttribute('data-product-id'));
          productData.secondProduct = counterCharms + 1;
          getSecondProducts.push(productData);
          localStorage.setItem('builder.secondStepProducts', JSON.stringify(getSecondProducts));

          const newCharmItem = document.createElement('div');
          newCharmItem.setAttribute('data-product-id', productData.id);
          newCharmItem.classList.add('b-charms_presentation--item', `m-${counterCharms + 1}`);
          setTimeout(() => {
            newCharmItem.classList.add('m-showed');
          }, 300);
          const newCharmImage = document.createElement('img');
          newCharmImage.setAttribute('src', charmImageSrc);
          newCharmImage.classList.add('b-charms_presentation--item_img');
          newCharmItem.appendChild(newCharmImage);
          charmsList.appendChild(newCharmItem);

          addProductToCartStorage(productData);

          calcCartTotal();
          counterCharms++; 
          maxSpacers = counterCharms - 1;
          updateCharmListClass(getSecondProducts, charmsList, maxCharms); // Передаем правильный контейнер
          checkStep();
        }
  
      checkMaxCharms(counterCharms, maxCharms, charmsCheckboxes, noticeCharms); 
    });
  });
  
  spacersCheckboxes.forEach((checkbox, index) => {
    const spacerImageSrc = checkbox.getAttribute('data-charm').replace(/['"]+/g, '');
    checkbox.addEventListener('change', function() {
      const productData = getProductFromLocalStorage(this.getAttribute('data-product-id'));
      if (this.checked) {
        if (counterSpacers < maxSpacers) {
          const newSpacerItem = document.createElement('div');
          newSpacerItem.classList.add('b-charms_presentation--item', `m-${counterSpacers + 1}`);
          setTimeout(() => {
            newSpacerItem.classList.add('m-showed');
          }, 300);
          const newSpacerImage = document.createElement('img');
          newSpacerImage.setAttribute('src', spacerImageSrc);
          newSpacerImage.classList.add('b-charms_presentation--item_img');
          newSpacerItem.appendChild(newSpacerImage);
          spacerList.appendChild(newSpacerItem); // Исправлено на spacerList
  
          addProductToCartStorage(productData);
          calcCartTotal();
          counterSpacers++; 
          updateCharmListClass(spacersCheckboxes, spacerList, maxSpacers); // Передаем правильный контейнер
        }
      } else {
        const spacerToRemove = spacerList.querySelector(`.b-charms_presentation--item_img[src="${spacerImageSrc}"]`); // Исправлено на spacerList
        if (spacerToRemove) {
          const parentItem = spacerToRemove.closest('.b-charms_presentation--item');
          parentItem.classList.remove('m-showed');
          counterSpacers--;
  
          removeProductFromCartStorage(productData.id);
          calcCartTotal();
          setTimeout(() => {
            parentItem.remove();
            updateCharmListClass(spacersCheckboxes, spacerList, maxSpacers); // Передаем правильный контейнер
            checkMaxCharms(counterSpacers, maxSpacers, spacersCheckboxes, noticeSpacers); 
          }, 300);
        }
      }
  
      checkMaxCharms(counterSpacers, maxSpacers, spacersCheckboxes, noticeSpacers);
    });
  });


  
  function updateCharmListClass(checkboxes, presentationDiv, maxItems) {
    const selectedProducts = checkboxes.length;
    presentationDiv.className = 'b-charms_presentation';

    if (selectedProducts > 0 && selectedProducts <= maxItems) {
      presentationDiv.classList.add(`m-${selectedProducts}`);
    }
  }
  
  function checkMaxCharms(counter, maxItems, checkboxes, notice) {
    if (counter >= maxItems) {
      checkboxes.forEach(checkbox => {
        if (!checkbox.checked) {
          checkbox.disabled = true;
        }
        notice.classList.remove('hidden');
      });
    } else {
      checkboxes.forEach(checkbox => checkbox.disabled = false);
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
    const stepIndex = targetStep - 1; // Приведение к индексу массива (начинается с 0)

    // Проверка корректности целевого шага
    if (stepIndex < 0 || stepIndex >= totalSteps) {
        console.error('Некорректный шаг:', targetStep);
        return;
    }

    // Убираем классы 'm-active' и 'm-done' с шагов
    stepItems.forEach((step, index) => {
        step.classList.remove('m-active', 'm-done');
    });

    // Удаляем все классы, соответствующие 'm-step-*' из mainContainer
    mainContainer.classList.forEach(className => {
        if (className.startsWith('m-step-')) {
            mainContainer.classList.remove(className);
        }
    });

    // Добавляем нужные классы для шагов
    stepItems.forEach((step, index) => {
        if (index < stepIndex) {
            step.classList.add('m-done');
        } else if (index === stepIndex) {
            step.classList.add('m-active');
        }
    });

    // Добавляем класс текущего шага к mainContainer
    mainContainer.classList.add(`m-step-${targetStep}`); // Прямое соответствие шагу
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

  // Cart
  function calcCartTotal() {
    // Получаем данные из localStorage по ключу 'builder.builderCart'
    const cartData = JSON.parse(localStorage.getItem('builder.builderCart')) || [];

    // Проверяем, что данные представляют собой массив объектов
    if (!Array.isArray(cartData)) {
        console.error('Данные в builder.builderCart не являются массивом.');
        return 0;
    }

    // Суммируем значения price всех продуктов с учетом количества (qty)
    const total = cartData.reduce((sum, item) => {
        // Проверяем, есть ли поле price и является ли оно числом
        if (item.price && typeof item.price === 'number') {
            // Учитываем количество (qty) каждого товара
            const qty = item.qty || 1; // Если qty не указано, считаем его равным 1
            return sum + (item.price * qty);
        } else {
            console.warn('Продукт без корректного поля price:', item);
            return sum;
        }
    }, 0); // Начальное значение суммы равно 0

    // Подсчитываем общее количество всех товаров в корзине
    const totalItems = cartData.reduce((sum, item) => sum + (item.qty || 1), 0);

    let catLengthText = totalItems > 1 ? ' items' : ' item';
    console.log(total);
    
    cartTotal.textContent = "$" + total.toFixed(2); // Форматируем сумму до двух знаков после запятой
    cartItemsNumber.textContent = totalItems + catLengthText;
    return total;
}

  function addProductToCartStorage(product) {
    const storageKey = `builder.builderCart`; // Используем единый ключ для корзины
    const existingData = JSON.parse(localStorage.getItem(storageKey)) || []; // Загружаем данные корзины

    // Проверяем, что данные являются массивом
    if (Array.isArray(existingData)) {
        const isStep1 = localStorage.getItem('builder.currentStep') === '1';
        
        // Если находимся на шаге 1, заменяем первый элемент без проверки на дубликаты
        if (isStep1) {
            console.log('Step 1: Replacing the first element in the cart');
            existingData[0] = product; // Заменяем первый элемент массива на новый продукт
            console.log(existingData[0]);
            localStorage.setItem(storageKey, JSON.stringify(existingData)); // Сохраняем обновленный массив обратно в localStorage
            addChildToCartStorage(product, 0); // Добавляем элемент в DOM
            return;
        }

        // Если не на первом шаге, продолжаем с проверкой на дубликаты
        const isDuplicate = existingData.some(existingProduct => existingProduct.id === product.id);
        if (!isDuplicate) {
            // Инициализируем количество продукта, если его еще нет
            product.qty = 1;
            existingData.push(product);
            localStorage.setItem(storageKey, JSON.stringify(existingData)); // Сохраняем обновленный массив обратно в localStorage
        
            // Создаем новый элемент списка и добавляем в DOM
            addChildToCartStorage(product);
            console.log(`Продукт добавлен: ${product.title}`);
        } else {
            console.log(`Продукт с id ${product.id} уже есть в корзине.`);
            existingData.forEach((existingProduct, index) => {
                if (existingProduct.id === product.id) {
                    // Увеличиваем количество, если продукт уже существует
                    existingProduct.qty = (existingProduct.qty || 1) + 1; // Инкремент количества
        
                    // Обновляем продукт в корзине
                    existingData[index] = existingProduct;
                    localStorage.setItem(storageKey, JSON.stringify(existingData)); // Сохраняем обновленный массив обратно в localStorage
                    console.log(`Продукт обновлен: ${existingProduct.title} (QTY: ${existingProduct.qty})`);
        
                    // Обновляем DOM элемент с учетом нового количества
                    updateCartItemInDOM(existingProduct);
                }
            });
        }
    } else {
        // Если данные не являются массивом, создаем массив с новым продуктом
        localStorage.setItem(storageKey, JSON.stringify([product]));
        console.log(`Корзина была пустой, продукт добавлен: ${product.title}`);
    }
  }

  function updateCartItemInDOM(product) {
    // Находим существующий элемент в DOM
    const listItem = document.querySelector(`.b-builder__cart-list_item[data-product-id="${product.id}"]`);
    if (listItem) {
        if (product.qty > 0) {
            // Обновляем текст количества (QTY) и другой информации
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
            // Удаляем элемент из DOM, если количество стало 0
            listItem.remove();
        }
    }
}

  function addChildToCartStorage(product, index = 1) {
    const listItem = document.createElement('li');
    listItem.className = 'b-builder__cart-list_item';
    listItem.setAttribute('data-product-id', product.id);
    listItem.setAttribute('data-product-qty', product.qty || 1);
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
      // Заменяем первый элемент в списке на новый элемент
      builderCartList.replaceChild(listItem, builderCartList.children[0]);
    } else {
        // Если список пустой, просто добавляем элемент
        builderCartList.appendChild(listItem);
    }
    // Добавляем обработчик события на кнопку удаления
    // listItem.querySelector('.b-builder__cart-list_item-remove').addEventListener('click', function() {
    //   removeProductFromCartStorage(product.id);
    //   calcCartTotal();
    // });
  }

  function removeProductFromCartStorage(productId) {
    const storageKey = `builder.builderCart`; // Используем единый ключ для корзины
    const existingData = JSON.parse(localStorage.getItem(storageKey)) || [];

    // Проверяем, что данные являются массивом
    if (Array.isArray(existingData)) {
        // Найдем продукт в корзине по ID
        const productIndex = existingData.findIndex(product => product.id === productId);

        if (productIndex !== -1) {
            const product = existingData[productIndex];

            // Уменьшаем количество или удаляем продукт, если qty равен 1
            if (product.qty > 1) {
                product.qty -= 1; // Уменьшаем количество на 1
                existingData[productIndex] = product; // Обновляем продукт в корзине
                console.log(`Количество продукта ${product.title} уменьшено до ${product.qty}.`);
            } else {
                // Если количество равно 1, удаляем продукт из корзины
                existingData.splice(productIndex, 1); // Удаляем продукт
                console.log(`Продукт с id ${productId} удален из корзины.`);
            }

            // Сохраняем обновленный массив обратно в localStorage
            localStorage.setItem(storageKey, JSON.stringify(existingData));

            // Обновляем или удаляем элемент из DOM
            updateCartItemInDOM(product);
        }
    } else {
        console.log('Корзина пуста или данные повреждены.');
    }
}



  function clearCartStorage() {
      const storageKey = `builder.builderCart`;
      // Удаляем данные из localStorage по ключу
      localStorage.setItem(storageKey, JSON.stringify([]));
      console.log(`Корзина с ключом ${storageKey} очищена и установлена как пустой массив.`);
  }

  // Remove product from cart
  builderCartList.addEventListener('click', function(event) {
    // Проверяем, что клик был на кнопке удаления
    const removeButton = event.target.closest('.b-builder__cart-list_item-remove');

    if (removeButton) {
      const productId = removeButton.getAttribute('data-product-id');
      const qtyProductItem = removeButton.closest('.b-builder__cart-list_item');
      if (qtyProductItem && qtyProductItem.hasAttribute('data-product-qty')) {
        let qty = parseInt(qtyProductItem.getAttribute('data-product-qty'), 10);

        
        const getSecondProducts = JSON.parse(localStorage.getItem('builder.secondStepProducts')) || [];
        const productIndex = getSecondProducts.findIndex(product => product.id === productId);
        if (productIndex !== -1) {
          getSecondProducts.splice(productIndex, 1); // Удаляем только первый найденный элемент
        }
        localStorage.setItem('builder.secondStepProducts', JSON.stringify(getSecondProducts));
        const charmToRemove = charmsList.querySelector(`[data-product-id="${productId}"]`);
        charmToRemove.classList.remove('m-showed');
        counterCharms--;
        maxSpacers = counterCharms - 1;
        
        setTimeout(() => {
          charmToRemove.remove();
          updateCharmListClass(getSecondProducts, charmsList, maxCharms); // Передаем правильный контейнер
          checkMaxCharms(counterCharms, maxCharms, charmsCheckboxes, noticeCharms); 
        }, 300);

        if (qty > 1) {
          // Уменьшаем количество на 1 и обновляем атрибут в DOM
          qty -= 1;
          // qtyProductItem.setAttribute('data-product-id', qty);
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
