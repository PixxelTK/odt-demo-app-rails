import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["trigger", "content", "chevron", "hiddenInput", "text"]
  static values = {
    open: { type: Boolean, default: false },
    closeOnClickOutside: { type: Boolean, default: true },
    closeOnSelect: { type: Boolean, default: true }
  }

  connect() {
    this.boundPointerDown = (event) => {
      if (!this.openValue || !this.closeOnClickOutsideValue) return
      if (!this.element.contains(event.target)) {
        this.close()
      }
    }
    document.addEventListener("pointerdown", this.boundPointerDown)

    this.boundKeyDown = (event) => {
      if (!this.openValue) return
      if (event.key === "Escape") {
        event.stopPropagation()
        this.close()
        if (this.hasTriggerTarget) this.triggerTarget.focus()
      }
    }
    window.addEventListener("keydown", this.boundKeyDown)

    if (this.openValue) {
      this.open()
    }
  }

  disconnect() {
    if (this.boundPointerDown) {
      document.removeEventListener("pointerdown", this.boundPointerDown)
    }
    if (this.boundKeyDown) {
      window.removeEventListener("keydown", this.boundKeyDown)
    }
  }

  toggle(event) {
    if (event) event.preventDefault()
    if (this.openValue) {
      this.close()
    } else {
      this.open()
    }
  }

  open(event) {
    if (event) event.preventDefault()
    this.openValue = true

    if (this.hasContentTarget) {
      this.contentTarget.classList.remove("hidden")
      this.contentTarget.classList.remove("odt-dropdown__content--exiting")
    }

    if (this.hasTriggerTarget) {
      this.triggerTarget.classList.add("odt-dropdown__trigger--open")
      this.triggerTarget.setAttribute("aria-expanded", "true")
    }

    if (this.hasChevronTarget) {
      this.chevronTarget.classList.add("odt-dropdown__chevron--open")
    }

    this.element.dispatchEvent(new CustomEvent("odt-dropdown:opened", { bubbles: true }))
  }

  close(event) {
    if (event) event.preventDefault()
    this.openValue = false

    if (this.hasTriggerTarget) {
      this.triggerTarget.classList.remove("odt-dropdown__trigger--open")
      this.triggerTarget.setAttribute("aria-expanded", "false")
    }

    if (this.hasChevronTarget) {
      this.chevronTarget.classList.remove("odt-dropdown__chevron--open")
    }

    if (this.hasContentTarget) {
      this.contentTarget.classList.add("odt-dropdown__content--exiting")
      setTimeout(() => {
        this.contentTarget.classList.add("hidden")
        this.contentTarget.classList.remove("odt-dropdown__content--exiting")
        this.element.dispatchEvent(new CustomEvent("odt-dropdown:closed", { bubbles: true }))
      }, 110)
    }
  }

  select(event) {
    const item = event.currentTarget
    const value = item.dataset.value
    const label = item.dataset.label || item.textContent.trim()

    if (this.hasHiddenInputTarget && value !== undefined) {
      this.hiddenInputTarget.value = value
      this.hiddenInputTarget.dispatchEvent(new Event("change", { bubbles: true }))
    }

    if (this.hasTextTarget && label) {
      this.textTarget.textContent = label
      this.textTarget.classList.remove("odt-dropdown__placeholder")
    }

    if (this.closeOnSelectValue) {
      this.close()
    }
  }

  navigate(event) {
    if (!this.hasContentTarget || !this.openValue) return

    const items = Array.from(
      this.contentTarget.querySelectorAll('[role="menuitem"]:not([disabled]):not(.odt-dropdown__item--disabled)')
    )
    if (!items.length) return

    const activeIndex = items.indexOf(document.activeElement)

    if (event.key === "ArrowDown") {
      event.preventDefault()
      const nextIndex = activeIndex < items.length - 1 ? activeIndex + 1 : 0
      items[nextIndex]?.focus()
    } else if (event.key === "ArrowUp") {
      event.preventDefault()
      const prevIndex = activeIndex > 0 ? activeIndex - 1 : items.length - 1
      items[prevIndex]?.focus()
    }
  }
}
