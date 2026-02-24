(() => {
  // src/js/main.js
  var items = document.querySelectorAll(".main-progress__item");
  document.addEventListener("DOMContentLoaded", () => {
    const birthInput = document.getElementById("birth");
    birthInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "").slice(0, 8);
      if (value.length >= 5) {
        value = value.replace(/(\d{2})(\d{2})(\d+)/, "$1.$2.$3");
      } else if (value.length >= 3) {
        value = value.replace(/(\d{2})(\d+)/, "$1.$2");
      }
      e.target.value = value;
    });
    const phoneInput = document.getElementById("phone");
    phoneInput.addEventListener("input", (e) => {
      let value = e.target.value.replace(/\D/g, "");
      if (value.startsWith("7"))
        value = value.slice(1);
      if (value.startsWith("8"))
        value = value.slice(1);
      value = value.slice(0, 10);
      let formatted = "+7";
      if (value.length > 0) {
        formatted += " (" + value.substring(0, 3);
      }
      if (value.length >= 4) {
        formatted += ") " + value.substring(3, 6);
      }
      if (value.length >= 7) {
        formatted += "-" + value.substring(6, 8);
      }
      if (value.length >= 9) {
        formatted += "-" + value.substring(8, 10);
      }
      e.target.value = formatted;
    });
    phoneInput.addEventListener("focus", () => {
      if (!phoneInput.value) {
        phoneInput.value = "+7";
      }
    });
  });
  document.addEventListener("DOMContentLoaded", () => {
    const birth = document.getElementById("birth");
    const phone = document.getElementById("phone");
    const email = document.getElementById("email");
    const agreeCheckbox = document.getElementById("agree");
    const agreeBlock = document.querySelector(".form-block--agree");
    const submitBtn = document.querySelector(".form-button");
    const errorMessage = document.querySelector(".main-form__error-message");
    submitBtn.disabled = true;
    function showError(input, message) {
      removeError(input);
      input.classList.add("input-error");
      const error = document.createElement("div");
      error.className = "form-error";
      error.textContent = message;
      input.closest(".form-block").appendChild(error);
      errorMessage.classList.remove("hidden");
    }
    function removeError(input) {
      input.classList.remove("input-error");
      const block = input.closest(".form-block");
      const oldError = block.querySelector(".form-error");
      if (oldError)
        oldError.remove();
    }
    function isAdult(dateString) {
      if (!/^\d{2}\.\d{2}\.\d{4}$/.test(dateString))
        return false;
      const [day, month, year] = dateString.split(".");
      const birthDate = new Date(year, month - 1, day);
      const today = /* @__PURE__ */ new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const m = today.getMonth() - birthDate.getMonth();
      if (m < 0 || m === 0 && today.getDate() < birthDate.getDate()) {
        age--;
      }
      return age >= 18;
    }
    function validateBirth() {
      if (!isAdult(birth.value)) {
        showError(
          birth,
          "\u0412\u044B \u043D\u0435 \u043C\u043E\u0436\u0435\u0442\u0435 \u0437\u0430\u0440\u0435\u0433\u0438\u0441\u0442\u0440\u0438\u0440\u043E\u0432\u0430\u0442\u044C\u0441\u044F. \u041A \u0443\u0447\u0430\u0441\u0442\u0438\u044E \u0432 \u043C\u0435\u0440\u043E\u043F\u0440\u0438\u044F\u0442\u0438\u0438 \u0434\u043E\u043F\u0443\u0441\u043A\u0430\u044E\u0442\u0441\u044F \u043B\u0438\u0446\u0430 \u0441\u0442\u0430\u0440\u0448\u0435 18 \u043B\u0435\u0442."
        );
        agreeCheckbox.disabled = true;
        agreeBlock.style.opacity = "0.5";
        return false;
      }
      removeError(birth);
      agreeCheckbox.disabled = false;
      agreeBlock.style.opacity = "1";
      return true;
    }
    function validatePhone() {
      const digits = phone.value.replace(/\D/g, "");
      if (digits.length !== 11) {
        showError(phone, "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 \u043D\u043E\u043C\u0435\u0440 \u0442\u0435\u043B\u0435\u0444\u043E\u043D\u0430");
        return false;
      }
      removeError(phone);
      return true;
    }
    function validateEmail() {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!re.test(email.value)) {
        showError(email, "\u0412\u0432\u0435\u0434\u0438\u0442\u0435 \u043A\u043E\u0440\u0440\u0435\u043A\u0442\u043D\u044B\u0439 email");
        return false;
      }
      removeError(email);
      return true;
    }
    function updateButtonState() {
      const birthValid = validateBirth();
      const phoneValid = validatePhone();
      const emailValid = validateEmail();
      const agreed = agreeCheckbox.checked;
      if (birthValid && phoneValid && emailValid && agreed) {
        submitBtn.disabled = false;
      } else {
        submitBtn.disabled = true;
      }
    }
    birth.addEventListener("input", updateButtonState);
    phone.addEventListener("input", updateButtonState);
    email.addEventListener("input", updateButtonState);
    agreeCheckbox.addEventListener("change", updateButtonState);
  });
  document.querySelectorAll(".dropdown").forEach((dropdown) => {
    const select = dropdown.querySelector("select");
    const selected = dropdown.querySelector(".dropdown__selected");
    const list = dropdown.querySelector(".dropdown__list");
    Array.from(select.options).forEach((option) => {
      if (option.disabled)
        return;
      const item = document.createElement("div");
      item.className = "dropdown__item";
      item.textContent = option.textContent;
      item.dataset.value = option.value;
      item.addEventListener("click", () => {
        select.value = option.value;
        selected.textContent = option.textContent;
        dropdown.classList.remove("dropdown--open");
      });
      list.appendChild(item);
    });
    selected.addEventListener("click", () => {
      dropdown.classList.toggle("dropdown--open");
    });
  });
  document.addEventListener("click", (e) => {
    document.querySelectorAll(".dropdown").forEach((dropdown) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("dropdown--open");
      }
    });
  });
})();
