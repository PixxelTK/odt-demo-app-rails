import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static values = {
    position: { type: String, default: "top-right" },
    expand: { type: Boolean, default: true }
  }

  connect() {
    this.isHovered = false
    this.leaveTimeout = null
    this.mutationObserver = new MutationObserver(() => this.handleMutations())
    this.mutationObserver.observe(this.element, { childList: true })
    this.handleMutations()

    this.boundTriggerHandler = (event) => {
      const trigger = event.target.closest("[data-odt-toast-message], [data-odt-toast-title]")
      if (trigger) {
        event.preventDefault()
        this.show({
          title: trigger.dataset.odtToastTitle,
          message: trigger.dataset.odtToastMessage,
          type: trigger.dataset.odtToastType || "default",
          variant: trigger.dataset.odtToastVariant || "elevated",
          duration: Number(trigger.dataset.odtToastDuration) || 4000
        })
      }
    }
    document.addEventListener("click", this.boundTriggerHandler)

    window.odtToast = {
      show: (options) => this.show(options),
      success: (title, message) => this.show({ title, message, type: "success" }),
      error: (title, message) => this.show({ title, message, type: "danger" }),
      warning: (title, message) => this.show({ title, message, type: "warning" }),
      info: (title, message) => this.show({ title, message, type: "info" })
    }
  }

  disconnect() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect()
    }
    if (this.leaveTimeout) {
      clearTimeout(this.leaveTimeout)
    }
    if (this.boundTriggerHandler) {
      document.removeEventListener("click", this.boundTriggerHandler)
    }
    if (window.odtToast) {
      delete window.odtToast
    }
  }

  show(eventOrOptions = {}) {
    const options = eventOrOptions?.params || eventOrOptions || {}
    const title = options.title || ""
    const message = options.message || ""
    const type = options.type || "default"
    const variant = options.variant || "elevated"
    const duration = options.duration !== undefined ? Number(options.duration) : 4000

    const toast = document.createElement("div")
    toast.className = `odt-toast odt-toast--variant-${variant}`
    toast.setAttribute("role", "status")
    toast.setAttribute("data-controller", "odt-toast")
    toast.setAttribute("data-odt-toast-duration-value", duration.toString())

    const parts = []

    const icons = {
      success: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>',
      info: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
      warning: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
      danger: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      error: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
      loading: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>'
    }

    if (icons[type]) {
      parts.push(`<span class="odt-toast__icon odt-toast__icon--${type}">${icons[type]}</span>`)
    }

    let bodyHtml = '<div class="odt-toast__body">'
    if (title) {
      bodyHtml += `<div class="odt-toast__title">${title}</div>`
    }
    if (message) {
      bodyHtml += `<div class="odt-toast__description">${message}</div>`
    }
    bodyHtml += '</div>'
    parts.push(bodyHtml)

    parts.push(`
      <button type="button" class="odt-toast__close" aria-label="Close" data-action="click->odt-toast#dismiss">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    `)

    toast.innerHTML = parts.join("")
    this.element.appendChild(toast)
  }

  handleMutations() {
    const unmountedToasts = this.element.querySelectorAll(":scope > .odt-toast:not([data-toast-mounted]):not(.odt-toast--exiting)")
    const isTop = this.positionValue.startsWith("top")

    unmountedToasts.forEach((toast) => {
      toast.style.transform = `translate3d(0, ${isTop ? -24 : 24}px, 0) scale(0.92)`
      toast.style.opacity = "0"
      toast.style.pointerEvents = "none"
      toast.dataset.toastMounted = "pending"
    })

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        unmountedToasts.forEach((toast) => {
          toast.dataset.toastMounted = "true"
        })
        this.updateStack()
      })
    })
  }

  hover() {
    if (!this.expandValue) return
    if (this.leaveTimeout) {
      clearTimeout(this.leaveTimeout)
      this.leaveTimeout = null
    }
    if (!this.isHovered) {
      this.isHovered = true
      this.element.style.pointerEvents = "auto"
      this.updateStack()
    }
  }

  leave() {
    if (!this.expandValue) return
    if (this.leaveTimeout) {
      clearTimeout(this.leaveTimeout)
    }
    this.leaveTimeout = setTimeout(() => {
      this.isHovered = false
      this.element.style.pointerEvents = "none"
      this.updateStack()
    }, 180)
  }

  get toasts() {
    return Array.from(this.element.querySelectorAll(":scope > .odt-toast:not(.odt-toast--exiting)"))
  }

  updateStack() {
    const toasts = this.toasts.reverse()
    const isTop = this.positionValue.startsWith("top")
    const GAP = 12

    let accumulatedOffset = 0

    toasts.forEach((toast, index) => {
      if (toast.dataset.toastMounted === "pending") return

      const isVisible = index < 3 || this.isHovered
      const zIndex = 50 - index
      const stackedBaseY = isTop ? index * 14 : -(index * 14)
      const stackedBaseScale = Math.max(0.84, 1 - index * 0.06)

      let targetY = 0
      let targetScale = 1
      let targetOpacity = 1

      if (this.isHovered) {
        targetY = isTop ? accumulatedOffset : -accumulatedOffset
        targetScale = 1
        targetOpacity = isVisible ? 1 : 0
      } else {
        targetY = stackedBaseY
        targetScale = stackedBaseScale
        targetOpacity = index === 0 ? 1 : index === 1 ? 0.92 : index === 2 ? 0.75 : 0
      }

      toast.style.transform = `translate3d(0, ${targetY}px, 0) scale(${targetScale})`
      toast.style.opacity = targetOpacity
      toast.style.zIndex = zIndex
      toast.style.pointerEvents = isVisible ? "auto" : "none"

      const height = toast.offsetHeight || 64
      accumulatedOffset += height + GAP
    })
  }
}
