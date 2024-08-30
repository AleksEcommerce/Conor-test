document.addEventListener('DOMContentLoaded', function() {
    const steps = document.querySelectorAll('.step');
    const notice = document.getElementById('b-notice');
    const pendantContainer = document.getElementById('pendant-builder-container');
    const charmsList = document.querySelector('.b-charms_presentation');
    const maxCharms = 4;
    const checkboxes = Array.from(document.querySelectorAll('.charm-checkbox'));
    let counter = 0;

    // steps.forEach((element, index) => {
      
    //   if (!element.classList.contains('active')) {
    //     element.classList.add('done');
    //     element.innerHTML = '<i class="icon-ok"></i>';
    //   } else {
    //     return;
    //   }
    // });


  
    checkboxes.forEach((checkbox, index) => {
      const charmImageSrc = checkbox.getAttribute('data-charm').replace(/['"]+/g, '');
  
      checkbox.addEventListener('change', function() {
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
            counter++; 
            updateCharmListClass();
          }
        } else {
       
          const charmToRemove = charmsList.querySelector(`.b-charms_presentation--item_img[src="${charmImageSrc}"]`);
          if (charmToRemove) {
            const parentItem = charmToRemove.closest('.b-charms_presentation--item');
            parentItem.classList.remove('m-showed');
            counter--;
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
  });