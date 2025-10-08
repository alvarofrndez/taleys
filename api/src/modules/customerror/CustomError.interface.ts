export default interface ICustomError {
    status_code?: number
    message: string
    error_code?: string
    stack?: any
}