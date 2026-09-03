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
  }

  disconnect() {
    if (this.mutationObserver) {
      this.mutationObserver.disconnect()
    }
    if (this.leaveTimeout) {
      clearTimeout(this.leaveTimeout)
    }
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
