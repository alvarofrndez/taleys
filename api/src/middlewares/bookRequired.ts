import { Response, NextFunction } from 'express'
import { env } from '@/config/config_env'
import CustomError from '@/modules/customerror/CustomError'
import { bookService } from '@/modules/books/book.service'

const bookRequired = async (req: any, res: Response, next: NextFunction) => {
    try{
        const { book_id } = req.params
    
        const book = await bookService.getByIdLite(book_id)
        if (!book) throw new CustomError('No se encontró el libro', 404, env.DATA_NOT_FOUND_CODE)

        req.book = book
        next()
    }catch(error){
        next(error)
    }
}

export { bookRequired }