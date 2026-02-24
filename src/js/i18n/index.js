import { translations } from "./translations.js"

export const i18n = {
  currentLang: localStorage.getItem("lang") || "en",

  init() {
    this.currentLang = localStorage.getItem("lang") || "en"
    this.updatePageLanguage()
    this.updateDOM()
    this.updateLanguageButtons()
  },

  setLanguage(lang) {
    const allowed = ["en", "tr", "sa", "ir", "az"]
    if (!allowed.includes(lang)) return

    this.currentLang = lang
    localStorage.setItem("lang", lang)
    this.updatePageLanguage()
    this.updateDOM()
    this.updateLanguageButtons()
  },

  getLanguage() {
    return this.currentLang
  },

  t(key) {
    const keys = key.split(".")
    let value = translations[this.currentLang]

    for (const k of keys) {
      value = value?.[k]
    }

    return value || key
  },

  updatePageLanguage() {
    const htmlElement = document.documentElement
    htmlElement.lang = this.currentLang === "sa" ? "ar" : (this.currentLang === "ir" ? "fa" : this.currentLang)
    htmlElement.dir = this.currentLang === "sa" ? "rtl" : "ltr"
  },

  updateDOM() {
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n")
      const text = this.t(key)
      if (text && typeof text === 'string') el.textContent = text
    })
  },

  updateLanguageButtons() {
    document.querySelectorAll(".lang-switcher__option").forEach(btn => {
      const lang = btn.getAttribute("data-lang")
      if (lang === this.currentLang) {
        btn.classList.add("lang-switcher__option--selected")
      } else {
        btn.classList.remove("lang-switcher__option--selected")
      }
    })
  }
}
