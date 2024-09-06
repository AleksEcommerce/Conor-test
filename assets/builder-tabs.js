document.addEventListener('DOMContentLoaded', function() {
  const tabNavItems = document.querySelectorAll('.b-tabs-nav-item');
  const tabContentItems = document.querySelectorAll('.b-tabs-content-item');
  const indicator = document.querySelector('.b-tabs-nav-indicator');

  // Инициализация положения индикатора на активном элементе
  function moveIndicator(element) {
    indicator.style.width = `${element.offsetWidth}px`;
    indicator.style.transform = `translateX(${element.offsetLeft}px)`;
  }

  // Устанавливаем индикатор на активном элементе при загрузке
  const activeItem = document.querySelector('.b-tabs-nav-item.m-active');
  if (activeItem) moveIndicator(activeItem);

  // Функция для переключения вкладок
  function switchTab(targetTab) {
    tabNavItems.forEach(item => item.classList.remove('m-active'));
    tabContentItems.forEach(item => item.classList.remove('m-active'));

    const targetNavItem = document.querySelector(`.b-tabs-nav-item[data-tab="${targetTab}"]`);
    const targetContentItem = document.querySelector(`.b-tabs-content-item[data-tab="${targetTab}"]`);

    targetNavItem.classList.add('m-active');
    targetContentItem.classList.add('m-active');

    // Перемещаем индикатор на новый активный элемент
    moveIndicator(targetNavItem);
  }

  // Обработчик кликов для элементов навигации
  tabNavItems.forEach(item => {
    item.addEventListener('click', function() {
      const targetTab = this.getAttribute('data-tab');
      switchTab(targetTab);
    });
  });
});