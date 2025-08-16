let onCloseCallback = null
let onConfirmCallback = null

export const modalMiddleware = (store) => (next) => (action) => {
  if (action.type === "modal/openModal") {
    onCloseCallback = action.payload.onCloseCallback || null
    onConfirmCallback = action.payload.onConfirmCallback || null
  }

  if (action.type === "modal/closeModal" && onCloseCallback) {
    onCloseCallback()
    onCloseCallback = null
  }

  if (action.type === "modal/confirmModal" && onConfirmCallback) {
    onConfirmCallback()
    onConfirmCallback = null
  }

  return next(action)
}