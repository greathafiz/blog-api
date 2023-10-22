import { StatusCodes } from "http-status-codes"
const notFoundMiddleware = (req,res,next) => {
    res.status(StatusCodes.NOT_FOUND).send(`Route doesn't exist`)
}

export default notFoundMiddleware