import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    duration: { type: Number, default: 4000 }
  }

  connect() {
    this.startTimer()
    this.notifyToaster()
  }

  startTimer() {
    if (this.durationValue > 0) {
      this.timeout = setTimeout(() => this.dismiss(), this.durationValue)
    }
  }

  pauseTimer() {
    if (this.timeout) {
      clearTimeout(this.timeout)
      this.timeout = null
    }
  }

  resumeTimer() {
    this.startTimer()
  }

  notifyToaster() {
    const toaster = this.element.closest("[data-controller~='odt-toaster']")
    if (toaster) {
      const toasterController = this.application.getControllerForElementAndIdentifier(toaster, "odt-toaster")
      toasterController?.updateStack()
    }
  }

  dismiss() {
    this.pauseTimer()
    this.element.classList.add("odt-toast--exiting")
    this.notifyToaster()

    setTimeout(() => {
      this.element.remove()
      this.notifyToaster()
    }, 250)
  }

  disconnect() {
    this.pauseTimer()
  }
}
