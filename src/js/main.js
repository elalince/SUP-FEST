const items = document.querySelectorAll('.main-progress__item');
let current = 0;

function nextStep() {
    if (current < items.length - 1) {
        items[current].classList.remove('main-progress__item--active');
        items[current].classList.add('main-progress__item--done');

        current++;
        items[current].classList.add('main-progress__item--active');
    }
}

function fadeIn(el, display = 'block', ms = 300) {
  if (!el) return;
  // cancel any pending hide handler
  if (el.__fadeOutHandler) {
    el.removeEventListener('transitionend', el.__fadeOutHandler);
    delete el.__fadeOutHandler;
  }
  if (el.__fadeTimeout) {
    clearTimeout(el.__fadeTimeout);
    delete el.__fadeTimeout;
  }

  el.style.display = display;
  el.style.transition = `opacity ${ms}ms ease`;
  // start from 0 then transition to 1
  el.style.opacity = 0;
  // force reflow so transition applies
  void el.offsetWidth;
  requestAnimationFrame(() => {
    el.style.opacity = 1;
  });
}

function fadeOut(el, ms = 300) {
  if (!el) return;
  // cancel any existing hide handler
  if (el.__fadeOutHandler) {
    el.removeEventListener('transitionend', el.__fadeOutHandler);
    delete el.__fadeOutHandler;
  }

  el.style.transition = `opacity ${ms}ms ease`;
  el.style.opacity = 1;

  requestAnimationFrame(() => {
    el.style.opacity = 0;
  });

  const handler = (e) => {
    if (e.propertyName && e.propertyName !== 'opacity') return;
    try { el.style.display = 'none'; } catch (err) {}
    el.removeEventListener('transitionend', handler);
    delete el.__fadeOutHandler;
  };

  el.__fadeOutHandler = handler;
  el.addEventListener('transitionend', handler);

  // Fallback in case transitionend doesn't fire
  el.__fadeTimeout = setTimeout(() => {
    try { el.style.display = 'none'; } catch (err) {}
    if (el.__fadeOutHandler) {
      el.removeEventListener('transitionend', el.__fadeOutHandler);
      delete el.__fadeOutHandler;
    }
    delete el.__fadeTimeout;
  }, ms + 50);
}

document.addEventListener('DOMContentLoaded', () => {

  const birthInput = document.getElementById('birth');

  birthInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '').slice(0, 8);
    
    if (value.length >= 5) {
      value = value.replace(/(\d{2})(\d{2})(\d+)/, '$1.$2.$3');
    } else if (value.length >= 3) {
      value = value.replace(/(\d{2})(\d+)/, '$1.$2');
    }

    e.target.value = value;
  });

  const phoneInput = document.getElementById('phone');

  phoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');

    if (value.startsWith('7')) value = value.slice(1);
    if (value.startsWith('8')) value = value.slice(1);

    value = value.slice(0, 10);

    let formatted = '+7';

    if (value.length > 0) {
      formatted += ' (' + value.substring(0, 3);
    }
    if (value.length >= 4) {
      formatted += ') ' + value.substring(3, 6);
    }
    if (value.length >= 7) {
      formatted += '-' + value.substring(6, 8);
    }
    if (value.length >= 9) {
      formatted += '-' + value.substring(8, 10);
    }

    e.target.value = formatted;
  });

  phoneInput.addEventListener('focus', () => {
    if (!phoneInput.value) {
      phoneInput.value = '+7';
    }
  });

});

document.addEventListener('DOMContentLoaded', () => {

  const birth = document.getElementById('birth');
  const phone = document.getElementById('phone');
  const email = document.getElementById('email');
  const agreeCheckbox = document.getElementById('agree');
    const name = document.getElementById('name');
    const surname = document.getElementById('surname');
  const agreeBlock = document.querySelector('.form-block--agree');
  const submitBtn = document.querySelector('.form-button');
  const errorMessage = document.querySelector('.main-form__error-message');

  submitBtn.disabled = true; // по умолчанию выключена

  function showError(input, message) {
    removeError(input);

    input.classList.add('input-error');

    const error = document.createElement('div');
    error.className = 'form-error';
    error.textContent = message;

    input.closest('.form-block').appendChild(error);
    errorMessage.classList.remove('hidden');
  }

  function removeError(input) {
    input.classList.remove('input-error');
    const block = input.closest('.form-block');
    const oldError = block.querySelector('.form-error');
    if (oldError) oldError.remove();
  }

  function isAdult(dateString) {
    if (!/^\d{2}\.\d{2}\.\d{4}$/.test(dateString)) return false;

    const [day, month, year] = dateString.split('.');
    const birthDate = new Date(year, month - 1, day);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age >= 18;
  }

  function validateBirth() {
    if (!isAdult(birth.value)) {
      showError(
        birth,
        'Вы не можете зарегистрироваться. К участию в мероприятии допускаются лица старше 18 лет.'
      );

      agreeCheckbox.disabled = true;
      agreeBlock.style.opacity = '0.5';

      return false;
    }

    removeError(birth);
    agreeCheckbox.disabled = false;
    errorMessage.classList.add('hidden');
    agreeBlock.style.opacity = '1';

    return true;
  }

  function validatePhone() {
    const digits = phone.value.replace(/\D/g, '');
    if (digits.length !== 11) {
      showError(phone, 'Введите корректный номер телефона');
      return false;
    }

    removeError(phone);
    return true;
  }

  function validateEmail() {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(email.value)) {
      showError(email, 'Введите корректный email');
      return false;
    }

    removeError(email);
    return true;
  }

  function validateName() {
    if (!name.value.trim()) {
      showError(name, 'Введите фамилию');
      return false;
    }

    removeError(name);
    return true;
  }

  function validateSurname() {
    if (!surname.value.trim()) {
      showError(surname, 'Введите имя');
      return false;
    }

    removeError(surname);
    return true;
  }

  function updateButtonState() {
    const birthValid = validateBirth();
    const phoneValid = validatePhone();
    const emailValid = validateEmail();
    const agreed = agreeCheckbox.checked;
    const nameValid = validateName();
    const surnameValid = validateSurname();

    if (birthValid && phoneValid && emailValid && agreed && nameValid && surnameValid) {
      submitBtn.disabled = false;
    } else {
      submitBtn.disabled = true;
    }
  }

  birth.addEventListener('input', updateButtonState);
  phone.addEventListener('input', updateButtonState);
  email.addEventListener('input', updateButtonState);
  agreeCheckbox.addEventListener('change', updateButtonState);
  name.addEventListener('input', updateButtonState);
  surname.addEventListener('input', updateButtonState);

  const form = document.querySelector('.main-form form');
  form.addEventListener('submit', (e) => {
    e.preventDefault();


    const mainForm = document.querySelector('.main-form.step-1');
    const mainNote = document.querySelector('.main-note');
    const mainShop = document.querySelector('.main-shop.step-2');
    fadeOut(mainForm);
    fadeOut(mainNote);
    fadeIn(mainShop, 'flex');

    nextStep();
  });

});


document.addEventListener('DOMContentLoaded', function() {
  
  function hasSelectedItems() {
    return document.querySelectorAll('.shop-item--selected').length > 0;
  }

  function updateMainAddButtonState() {
    const mainAddButton = document.querySelector('.main-shop__add');
    if (!mainAddButton) return;
    
    if (hasSelectedItems()) {
      mainAddButton.disabled = false;
      mainAddButton.classList.remove('main-shop__add--disabled');
    } else {
      mainAddButton.disabled = true;
      mainAddButton.classList.add('main-shop__add--disabled');
    }
  }

  function updatePriceBlockVisibility() {
    const priceBlock = document.querySelector('.main-shop__price');
    if (!priceBlock) return;
    
    if (hasSelectedItems()) {
      priceBlock.classList.remove('main-shop__price--hidden');
      priceBlock.style.opacity = '0';
      priceBlock.style.display = 'flex';
      
      setTimeout(() => {
        priceBlock.style.opacity = '1';
      }, 10);
    } else {
      priceBlock.style.opacity = '0';
      setTimeout(() => {
        if (!hasSelectedItems()) {
          priceBlock.classList.add('main-shop__price--hidden');
          priceBlock.style.display = 'none';
        }
      }, 300);
    }
  }

  function getItemPrice(shopItem) {
    const priceElement = shopItem.querySelector('.shop-item__price');
    if (priceElement) {
      const priceText = priceElement.textContent.replace(/[^\d]/g, '');
      return parseInt(priceText) || 0;
    }
    return 0;
  }

  function getItemQuantity(shopItem) {
    const quantitySelect = shopItem.querySelector('select[name="quantity"]');
    if (quantitySelect) {
      return parseInt(quantitySelect.value) || 1;
    }
    return 1;
  }

  function updateTotalPrice() {
    const totalPriceElement = document.querySelector('.main-shop__price-value');
    if (!totalPriceElement) return;
    
    const selectedItems = document.querySelectorAll('.shop-item--selected');
    
    let total = 0;
    selectedItems.forEach(item => {
      const price = getItemPrice(item);
      const quantity = getItemQuantity(item);
      total += price * quantity;
    });
    
    totalPriceElement.textContent = total.toLocaleString() + ' ₽';
    
    updatePriceBlockVisibility();
    updateMainAddButtonState();
  }

  function generateUniqueId(prefix) {
    return prefix + '-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  }

  function updateNestedIds(element, baseId) {
    const checkbox = element.querySelector('.shop-item__choice');
    if (checkbox) {
      const newCheckboxId = generateUniqueId('item');
      checkbox.id = newCheckboxId;
      checkbox.name = newCheckboxId;
    }

    const selects = element.querySelectorAll('select[id]');
    selects.forEach((select, index) => {
      const oldId = select.id;
      const newId = generateUniqueId(select.name || 'select');
      select.id = newId;
      
      const label = element.querySelector(`label[for="${oldId}"]`);
      if (label) {
        label.setAttribute('for', newId);
      }
    });

    const dropdowns = element.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
      const nativeSelect = dropdown.querySelector('select');
      if (nativeSelect) {
        dropdown.dataset.forSelect = nativeSelect.id;
      }
    });
  }

  function cloneShopItem(originalItem) {
    const clone = originalItem.cloneNode(true);
    
    const cloneCheckbox = clone.querySelector('.shop-item__choice');
    if (cloneCheckbox) {
      cloneCheckbox.checked = true;
    }
    
    clone.classList.add('shop-item--selected');
    
    const cloneId = generateUniqueId('clone');
    clone.dataset.cloneId = cloneId;
    
    updateNestedIds(clone, cloneId);
    initDropdowns(clone);
    
    return clone;
  }

  function initDropdowns(container) {
    container.querySelectorAll('.dropdown').forEach(dropdown => {
      const select = dropdown.querySelector('select');
      const selected = dropdown.querySelector('.dropdown__selected');
      const list = dropdown.querySelector('.dropdown__list');
      
      if (!select || !selected || !list) return;
      
      list.innerHTML = '';
      
      Array.from(select.options).forEach(option => {
        if (option.disabled) return;
        
        const item = document.createElement('div');
        item.className = 'dropdown__item';
        item.textContent = option.textContent;
        item.dataset.value = option.value;
        
        item.addEventListener('click', () => {
          select.value = option.value;
          selected.textContent = option.textContent;
          dropdown.classList.remove('dropdown--open');
          
          updateSelectedItem(select.value, list);
          
          if (select.name === 'quantity') {
            const shopItem = dropdown.closest('.shop-item');
            if (shopItem && shopItem.classList.contains('shop-item--selected')) {
              updateTotalPrice();
            }
          }
        });
        
        list.appendChild(item);
      });
      
      if (select.value) {
        selected.textContent = select.options[select.selectedIndex].textContent;
        updateSelectedItem(select.value, list);
      }
      
      function updateSelectedItem(value, list) {
        list.querySelectorAll('.dropdown__item').forEach(item => {
          item.classList.remove('selected');
        });
        
        const activeItem = Array.from(list.children).find(
          item => item.dataset.value === value
        );
        if (activeItem) {
          activeItem.classList.add('selected');
        }
      }
      
      selected.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('dropdown--open');
      });
      
      document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target)) {
          dropdown.classList.remove('dropdown--open');
        }
      });
    });
  }

  initDropdowns(document);

  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('shop-item__add')) {
      e.preventDefault();
      
      const currentShopItem = e.target.closest('.shop-item');
      if (!currentShopItem) return;
      
      const checkbox = currentShopItem.querySelector('.shop-item__choice');
      if (!checkbox || !checkbox.checked) {
        alert('Сначала выберите товар с помощью чекбокса');
        return;
      }
      
      const clone = cloneShopItem(currentShopItem);
      currentShopItem.insertAdjacentElement('afterend', clone);
      
      updateTotalPrice();
      
      clone.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });

  function saveAndShowSummary() {
    try {
      const selectedItems = document.querySelectorAll('.shop-item--selected');
      const selectedData = [];

      selectedItems.forEach((item) => {
        const title = item.querySelector('.shop-item__title')?.textContent || '';
        const price = getItemPrice(item);
        const quantity = getItemQuantity(item);
        const size = item.querySelector('select[name="size"]')?.value;
        const color = item.querySelector('select[name="color"]')?.value;
        const imageUrl = item.querySelector('img')?.src || '';

        selectedData.push({ title, price, quantity, size, color, imageUrl });
      });


      sessionStorage.setItem('selectedItems', JSON.stringify(selectedData));

      const shopSummaryList = document.querySelector('.shop-summary__list');
      if (shopSummaryList) shopSummaryList.innerHTML = '';

      let totalPrice = 0;

      selectedData.forEach((item) => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;

        const itemElement = document.createElement('div');
        itemElement.className = 'shop-summary__item';

        let features = '';
        if (item.size) {
          features += `Размер: ${item.size}`;
        }
        if (item.color) {
          if (features) features += ', ';
          features += `Цвет: ${item.color}`;
        }
        if (item.quantity) {
          if (features) features += ', ';
          features += `Количество: ${item.quantity}`;
        }

        itemElement.innerHTML = `
          <div class="shop-summary__item-image">
            <img src="${item.imageUrl}" alt="${item.title}">
          </div>
          <div class="shop-summary__item-info">
            <div class="shop-summary__item-title">${item.title}</div>
            <div class="shop-summary__item-features">${features}</div>
          </div>
          <div class="shop-summary__item-price">${itemTotal.toLocaleString()} ₽</div>
        `;

        if (shopSummaryList) shopSummaryList.appendChild(itemElement);
      });


      const totalValue = document.querySelector('.shop-summary__total-value');
      if (totalValue) totalValue.textContent = totalPrice.toLocaleString() + ' ₽';
    } catch (err) {
      console.error('saveAndShowSummary error:', err);
    } finally {
      goToStep(3);
    }
  }

  function goToStep(stepNumber) {
    fadeOut(document.querySelector('.main-form.step-1'));
    fadeOut(document.querySelector('.main-shop.step-2'));
    fadeOut(document.querySelector('.main-summary.step-3'));

    if (stepNumber === 1) {
      fadeIn(document.querySelector('.main-form.step-1'), 'flex');
      fadeIn(document.querySelector('.main-note'), 'block');
      items[0]?.classList.add('main-progress__item--active');
    } else if (stepNumber === 2) {
      fadeIn(document.querySelector('.main-shop.step-2'), 'flex');
    } else if (stepNumber === 3) {
      fadeIn(document.querySelector('.main-summary.step-3'), 'flex');

      const name = document.getElementById('name')?.value || '';
      const surname = document.getElementById('surname')?.value || '';
      const patronymic = document.getElementById('patronymic')?.value || '';
      const birth = document.getElementById('birth')?.value || '';
      const phone = document.getElementById('phone')?.value || '';
      const email = document.getElementById('email')?.value || '';

      let fullName = surname + ' ' + name;
      if (patronymic) {
        fullName += ' ' + patronymic;
      }


      document.querySelector('[data-field="name"] .form-summary__item-value').textContent = fullName.trim();
      document.querySelector('[data-field="birthdate"] .form-summary__item-value').textContent = birth;
      document.querySelector('[data-field="phone"] .form-summary__item-value').textContent = phone;
      document.querySelector('[data-field="email"] .form-summary__item-value').textContent = email;


      const selectedItems = sessionStorage.getItem('selectedItems');
      const shopSummary = document.querySelector('.main-summary__content.shop-summary');

      if (selectedItems && selectedItems !== '[]') {
        fadeIn(shopSummary, 'flex');
      } else {
        fadeOut(shopSummary);
      }
    }

    while (current < stepNumber - 1) {
      items[current].classList.remove('main-progress__item--active');
      items[current].classList.add('main-progress__item--done');
      current++;
      items[current].classList.add('main-progress__item--active');
    }
  }


  document.addEventListener('click', function(e) {
    const btn = e.target.closest('.main-shop__add');
    if (btn && !btn.disabled) {
      e.preventDefault();
      saveAndShowSummary();
    }
  });

 
  document.querySelectorAll('.main-shop__add').forEach(button => {
    button.addEventListener('click', (e) => {
      if (button.disabled) return;
      e.preventDefault();
      saveAndShowSummary();
    });
  });


  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('main-shop__next')) {
      e.preventDefault();
   
      sessionStorage.removeItem('selectedItems');
      
      const shopSummaryList = document.querySelector('.shop-summary__list');
      shopSummaryList.innerHTML = '';
      
      const totalValue = document.querySelector('.shop-summary__total-value');
      totalValue.textContent = '0 ₽';

      goToStep(3);
    }
  });


  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('main-shop__prev')) {
      e.preventDefault();
      // Возвращаемся на step-1
      fadeIn(document.querySelector('.main-form.step-1'), 'flex');
      fadeIn(document.querySelector('.main-note'), 'block');
      fadeOut(document.querySelector('.main-shop.step-2'));
      

      while (current > 0) {
        items[current].classList.remove('main-progress__item--active');
        current--;
        items[current].classList.remove('main-progress__item--done');
        items[current].classList.add('main-progress__item--active');
      }
    }
  });

  document.addEventListener('change', function(e) {
    if (e.target.classList.contains('shop-item__choice')) {
      const shopItem = e.target.closest('.shop-item');
      
      if (e.target.checked) {
        shopItem.classList.add('shop-item--selected');
      } else {
        shopItem.classList.remove('shop-item--selected');
        
        if (shopItem.dataset.cloneId) {
          shopItem.style.transition = 'opacity 0.3s ease';
          shopItem.style.opacity = '0';
          
          setTimeout(() => {
            if (shopItem.parentNode) {
              shopItem.remove();
              updateTotalPrice();
            }
          }, 300);
          return;
        }
      }
      
      updateTotalPrice();
    }
  });

  document.addEventListener('change', function(e) {
    if (e.target.matches('select[name="quantity"]')) {
      const shopItem = e.target.closest('.shop-item');
      if (shopItem && shopItem.classList.contains('shop-item--selected')) {
        updateTotalPrice();
      }
    }
  });

  document.addEventListener('click', function(e) {
    if (e.target.closest('.main-summary__back')) {
      e.preventDefault();

      fadeOut(document.querySelector('.main-form.step-1'));
      fadeOut(document.querySelector('.main-note'));
      fadeIn(document.querySelector('.main-shop.step-2'), 'flex');
      fadeOut(document.querySelector('.main-summary.step-3'));
      

      if (current > 1) {
        items[current].classList.remove('main-progress__item--active');
        current--;
        items[current].classList.remove('main-progress__item--done');
        items[current].classList.add('main-progress__item--active');
      }
    }
  });


  document.addEventListener('click', function(e) {
    if (e.target.closest('.main-summary__submit')) {
      e.preventDefault();

      fadeOut(document.querySelector('.main-form.step-1'));
      fadeOut(document.querySelector('.main-note'));
      fadeOut(document.querySelector('.main-shop.step-2'));
      fadeOut(document.querySelector('.main-summary.step-3'));
      fadeIn(document.querySelector('.main-success.step-4'), 'flex');
      
   
      if (items[current]) {
        items[current].classList.remove('main-progress__item--active');
        items[current].classList.add('main-progress__item--done');
      }
    
      try {
        const successEmail = document.querySelector('.main-success__email');
        const emailValue = document.getElementById('email')?.value || '';
        if (successEmail) successEmail.textContent = emailValue;
      } catch (err) {
        // ignore
      }

      try {
        const shopText = document.querySelector('.main-success__shop-text');
        const selectedItems = sessionStorage.getItem('selectedItems');
        const hasItems = selectedItems && selectedItems !== '[]';
        if (shopText) {
          shopText.style.display = hasItems ? 'block' : 'none';
        }
      } catch (err) {
        // ignore
      }
    }
  });

  updatePriceBlockVisibility();
  updateMainAddButtonState();
  updateTotalPrice();

});