import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["dialog"]
  static values = {
    open: { type: Boolean, default: false },
    preventBackdropClose: { type: Boolean, default: false }
  }

  connect() {
    if (this.element.id) {
      this.boundTriggerHandler = (event) => {
        const trigger = event.target.closest(`[data-odt-modal-target-id="${this.element.id}"], [data-modal-target="${this.element.id}"], [href="#${this.element.id}"]`)
        if (trigger) {
          event.preventDefault()
          this.open()
        }
      }
      document.addEventListener("click", this.boundTriggerHandler)
    }

    this.boundTurboSubmitHandler = (event) => {
      if (event.detail?.success && this.element.contains(event.target)) {
        this.close()
      }
    }
    this.element.addEventListener("turbo:submit-end", this.boundTurboSubmitHandler)

    if (this.openValue) {
      this.open()
    }
  }

  open(event) {
    if (event) event.preventDefault()

    this.element.classList.remove("hidden")
    this.element.setAttribute("aria-hidden", "false")
    this.element.classList.remove("odt-modal-overlay--exiting")
    if (this.hasDialogTarget) {
      this.dialogTarget.classList.remove("odt-modal--exiting")
    }

    document.body.style.overflow = "hidden"
    this.element.dispatchEvent(new CustomEvent("odt-modal:opened", { bubbles: true }))
  }

  close(event) {
    if (event) event.preventDefault()

    this.element.classList.add("odt-modal-overlay--exiting")
    if (this.hasDialogTarget) {
      this.dialogTarget.classList.add("odt-modal--exiting")
    }

    document.body.style.overflow = ""

    setTimeout(() => {
      this.element.classList.add("hidden")
      this.element.classList.remove("odt-modal-overlay--exiting")
      if (this.hasDialogTarget) {
        this.dialogTarget.classList.remove("odt-modal--exiting")
      }
      this.element.setAttribute("aria-hidden", "true")
      this.element.dispatchEvent(new CustomEvent("odt-modal:closed", { bubbles: true }))
    }, 200)
  }

  backdropClose(event) {
    if (this.preventBackdropCloseValue) return
    if (event.target === this.element) {
      this.close(event)
    }
  }

  disconnect() {
    document.body.style.overflow = ""
    if (this.boundTriggerHandler) {
      document.removeEventListener("click", this.boundTriggerHandler)
    }
    if (this.boundTurboSubmitHandler) {
      this.element.removeEventListener("turbo:submit-end", this.boundTurboSubmitHandler)
    }
  }
}
