document.addEventListener('DOMContentLoaded', function() {
  const mainContainer = document.getElementById('builder-container'); // Main container
  // Steps
  const steps = document.getElementById('builder-steps');
  const stepItems = Array.from(steps.querySelectorAll('.b-steps-item'));
  const totalSteps = stepItems.length;

  // Builder Cart
  const cart = document.querySelector('.b-builder__cart');
  const cartSubtitle = document.querySelector('.b-builder__cart-title_subtitle');
  const cartTotal = document.getElementById('builder-cart-total');
  const cartItemsNumber = document.getElementById('builder-cart-total-items');
  const builderCartList = document.getElementById('builder-cart-list');
  
  let btnsRemoveProductCart = document.querySelectorAll('.b-builder__cart-list_item-remove');

  const notice = document.getElementById('b-notice'); // Notice for maximum number of charms
  const pendantContainer = document.getElementById('pendant-builder-container'); // Container for Slider
  const charmsList = document.querySelector('.b-charms_presentation'); // Presentation for selected charms
  const selectBtn = document.getElementById('b-select_btn'); // Button for selecting charms
  
  const checkboxes = Array.from(document.querySelectorAll('.charm-checkbox')); // Checkboxes for charms
  let counter = 0; // Counter for selected charms
  const maxCharms = 4; // Maximum number of charms

  checkboxes.forEach((checkbox, index) => {
    const charmImageSrc = checkbox.getAttribute('data-charm').replace(/['"]+/g, '');
    checkbox.addEventListener('change', function() {
      const productData = getProductFromLocalStorage(this.getAttribute('data-product-id'));
      if (this.checked) {
        if (counter < maxCharms) {
          const newCharmItem = document.createElement('div');
          newCharmItem.classList.add('b-charms_presentation--item', `m-${counter + 1}`);
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
          counter++; 
          updateCharmListClass();
        }
      } else {
        const charmToRemove = charmsList.querySelector(`.b-charms_presentation--item_img[src="${charmImageSrc}"]`);
        if (charmToRemove) {
          const parentItem = charmToRemove.closest('.b-charms_presentation--item');
          parentItem.classList.remove('m-showed');
          counter--;

          removeProductFromCartStorage(productData.id);
          calcCartTotal();
          setTimeout(() => {
            parentItem.remove();
            updateCharmListClass();
            checkMaxCharms(); 
          }, 300);
        }
      }

  
      checkMaxCharms();
    });
  });
  
  function updateCharmListClass() {
    const selectedCharms = checkboxes.filter(checkbox => checkbox.checked).length;
    charmsList.className = 'b-charms_presentation';

    if (selectedCharms > 0 && selectedCharms <= maxCharms) {
      charmsList.classList.add(`m-${selectedCharms}`);
    }
  }
  
  function checkMaxCharms() {
    if (counter >= maxCharms) {
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

  document.getElementById('builder-step-next').addEventListener('click', () => {
    let currentStep = Array.from(stepItems).findIndex(step => step.classList.contains('m-active')) + 1;

    console.log(currentStep);
    if (currentStep < totalSteps) {
        switchStep(currentStep + 1);
    }
  });

  document.getElementById('builder-step-prev').addEventListener('click', () => {
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
                <span class="b-builder__cart-list_item-remove" data-product-id="${product.id}">X</span>
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
    if (event.target.classList.contains('b-builder__cart-list_item-remove')) {
      const productId = event.target.getAttribute('data-product-id');
      console.log(productId);
      removeProductFromCartStorage(productId);
      calcCartTotal();
  
      // Находим связанный чекбокс по data-product-id и снимаем отметку
      const relatedCheckbox = document.querySelector(`.charm-checkbox[data-product-id="${productId}"]`);
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
