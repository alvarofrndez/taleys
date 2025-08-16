class CustomError extends Error {
    status_code: number
    error_code: string
  
    constructor(message: string, status_code?: number, error_code?: string) {
      super(message)
      this.status_code = status_code
      this.error_code = error_code
    }
  }
  
export default CustomError