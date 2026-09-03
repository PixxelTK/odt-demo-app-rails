import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["dialog"]
  static values = {
    open: { type: Boolean, default: false },
    preventBackdropClose: { type: Boolean, default: false }
  }

  connect() {
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
  }
}
