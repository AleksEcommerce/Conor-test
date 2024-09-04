document.addEventListener('DOMContentLoaded', function() {
  const mainContainer = document.getElementById('builder-container'); // Main container
  // Steps
  const steps = document.getElementById('builder-steps');
  const stepItems = Array.from(steps.querySelectorAll('.b-steps-item'));
  const totalSteps = stepItems.length;
  const stepNext = document.getElementById('builder-step-next');
  const stepPrev = document.getElementById('builder-step-prev');

  // Builder Cart
  const cart = document.querySelector('.b-builder__cart');
  const cartSubtitle = document.querySelector('.b-builder__cart-title_subtitle');
  const cartTotal = document.getElementById('builder-cart-total');
  const cartItemsNumber = document.getElementById('builder-cart-total-items');
  const builderCartList = document.getElementById('builder-cart-list');
  

  const notice = document.getElementById('b-notice'); // Notice for maximum number of charms
  const pendantContainer = document.getElementById('pendant-builder-container'); // Container for Slider
  const charmsList = document.getElementById('charms_presentation'); // Presentation for selected charms
  const spacerList = document.getElementById('spacer_presentation'); // Presentation for selected spacers
  const selectBtn = document.getElementById('b-select_btn'); // Button for selecting charms
  
  const charmsCheckboxes = Array.from(document.querySelectorAll('.charm-checkbox')); // Checkboxes for charms
  let counterCharms = 0; // Counter for selected charms
  const maxCharms = 4; // Maximum number of charms

  const spacersCheckboxes = Array.from(document.querySelectorAll('.spacer-checkbox')); // Checkboxes for charms
  let counterSpacers = 0; // Counter for selected spacers
  const maxSpacers = 3; // Maximum number of spacers

  charmsCheckboxes.forEach((checkbox, index) => {
    const charmImageSrc = checkbox.getAttribute('data-charm').replace(/['"]+/g, '');
    checkbox.addEventListener('change', function() {
      const productData = getProductFromLocalStorage(this.getAttribute('data-product-id'));
      if (this.checked) {
        if (counterCharms < maxCharms) {
          const newCharmItem = document.createElement('div');
          newCharmItem.classList.add('b-charms_presentation--item', `m-${counterCharms + 1}`);
          setTimeout(() => {
            newCharmItem.classList.add('m-showed');
          }, 300);
          const newCharmImage = document.createElement('img');
          newCharmImage.setAttribute('src', charmImageSrc);
          newCharmImage.classList.add('b-charms_presentation--item_img');
          newCharmItem.appendChild(newCharmImage);
          charmsList.appendChild(newCharmItem); // Исправлено на charmsList
  
          addProductToCartStorage(productData);
          calcCartTotal();
          counterCharms++; 
          updateCharmListClass(charmsCheckboxes, charmsList, maxCharms); // Передаем правильный контейнер
        }
      } else {
        const charmToRemove = charmsList.querySelector(`.b-charms_presentation--item_img[src="${charmImageSrc}"]`); // Исправлено на charmsList
        if (charmToRemove) {
          const parentItem = charmToRemove.closest('.b-charms_presentation--item');
          parentItem.classList.remove('m-showed');
          counterCharms--;
  
          removeProductFromCartStorage(productData.id);
          calcCartTotal();
          setTimeout(() => {
            parentItem.remove();
            updateCharmListClass(charmsCheckboxes, charmsList, maxCharms); // Передаем правильный контейнер
            checkMaxCharms(counterCharms, maxCharms, charmsCheckboxes, notice); 
          }, 300);
        }
      }
  
      checkMaxCharms(counterCharms, maxCharms, charmsCheckboxes, notice); 
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
            checkMaxCharms(counterSpacers, maxSpacers, spacersCheckboxes, notice); 
          }, 300);
        }
      }
  
      checkMaxCharms(counterSpacers, maxSpacers, spacersCheckboxes, notice);
    });
  });


  
  function updateCharmListClass(checkboxes, presentationDiv, maxItems) {
    const selectedProducts = checkboxes.filter(checkbox => checkbox.checked).length;
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

    clearCartStorage();
    const productCurrent = getProductFromLocalStorage(currentProductId);
    addProductToCartStorage(productCurrent);
    calcCartTotal();
    switchStep(2);
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
  }

  stepNext.addEventListener('click', () => {
    let currentStep = Array.from(stepItems).findIndex(step => step.classList.contains('m-active')) + 1;

    console.log(currentStep);
    if (currentStep < totalSteps) {
        switchStep(currentStep + 1);
    }
  });

  stepPrev.addEventListener('click', () => {
      let currentStep = Array.from(stepItems).findIndex(step => step.classList.contains('m-active')) + 1;

      if (currentStep > 1) {
          switchStep(currentStep - 1);
      }
  });

  // Cart
  function calcCartTotal() {
      // Получаем данные из localStorage по ключу 'builder.builderCart'
      const cartData = JSON.parse(localStorage.getItem('builder.builderCart')) || [];

      // Проверяем, что данные представляют собой массив объектов
      if (!Array.isArray(cartData)) {
          console.error('Данные в builder.builderCart не являются массивом.');
          return 0;
      }

      // Суммируем значения price всех продуктов
      const total = cartData.reduce((sum, item) => {
          // Проверяем, есть ли поле price и является ли оно числом
          if (item.price && typeof item.price === 'number') {
              return sum + item.price;
          } else {
              console.warn('Продукт без корректного поля price:', item);
              return sum;
          }
      }, 0); // Начальное значение суммы равно 0

      let catLengthText = cartData.length > 1 ? ' items' : ' item';
      console.log(total);
      
      cartTotal.textContent = "$" + total;
      cartItemsNumber.textContent = cartData.length + catLengthText;
      return total;
  } 

  function addProductToCartStorage(product) {
    const storageKey = `builder.builderCart`; // Используем единый ключ для корзины
    const existingData = JSON.parse(localStorage.getItem(storageKey)) || []; // Загружаем данные корзины

    // Проверяем, что данные являются массивом
    if (Array.isArray(existingData)) {
        // Проверяем, есть ли продукт с таким id в существующих данных
        const isDuplicate = existingData.some(existingProduct => existingProduct.id === product.id);

        // Если дубликатов нет, добавляем продукт в корзину
        if (!isDuplicate) {
            existingData.push(product);
            // Сохраняем обновленный массив обратно в localStorage
            localStorage.setItem(storageKey, JSON.stringify(existingData));

            // Создаем новый элемент списка и добавляем в DOM
            const listItem = document.createElement('li');
            listItem.className = 'b-builder__cart-list_item';
            listItem.setAttribute('data-product-id', product.id);
            listItem.innerHTML = `
                <span class="b-builder__cart-list_item-title">${product.title}</span>
                <span class="b-builder__cart-list_item-price">${product.price}</span>
                <span class="b-builder__cart-list_item-remove" data-product-id="${product.id}">
                  <svg width="24" height="24" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 4.547 11.453 3.5 8 6.953 4.547 3.5 3.5 4.547 6.953 8 3.5 11.453 4.547 12.5 8 9.047l3.453 3.453 1.047-1.047L9.047 8 12.5 4.547z" fill="#010101"></path>
                  </svg>
                </span>
            `;
            builderCartList.appendChild(listItem);

            // Добавляем обработчик события на кнопку удаления
            listItem.querySelector('.b-builder__cart-list_item-remove').addEventListener('click', function() {
                removeProductFromCartStorage(product.id);
                calcCartTotal();
            });

            console.log(`Продукт добавлен: ${product.title}`);
        } else {
            console.log(`Продукт с id ${product.id} уже есть в корзине.`);
        }
    } else {
        // Если данные не являются массивом, создаем массив с новым продуктом
        localStorage.setItem(storageKey, JSON.stringify([product]));
        console.log(`Корзина была пустой, продукт добавлен: ${product.title}`);
    }
}

  function removeProductFromCartStorage(productId) {
    const storageKey = `builder.builderCart`; // Используем единый ключ для корзины
    const existingData = JSON.parse(localStorage.getItem(storageKey)) || [];

    // Проверяем, что данные являются массивом
    if (Array.isArray(existingData)) {
        // Фильтруем продукты, исключая продукт с указанным id
        const updatedData = existingData.filter(product => product.id !== productId);

        // Сохраняем обновленный массив обратно в localStorage
        localStorage.setItem(storageKey, JSON.stringify(updatedData));
        console.log(`Продукт с id ${productId} удален из корзины.`);

        // Удаляем элемент из DOM, если он существует
        const listItem = document.querySelector(`.b-builder__cart-list_item[data-product-id="${productId}"]`);
        if (listItem) {
            listItem.remove();
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
      console.log(productId);
      removeProductFromCartStorage(productId);
      calcCartTotal(); 
  
      // Находим связанный чекбокс по data-product-id и снимаем отметку
      const relatedCheckbox = document.querySelector(`.additional-charm[data-product-id="${productId}"]`);
      if (relatedCheckbox) {
        relatedCheckbox.checked = false;
  
        // Инициализируем событие 'change' на чекбоксе
        const event = new Event('change');
        relatedCheckbox.dispatchEvent(event);
      }
    }
  });

  switchStep(1); // Set first step as active
});
