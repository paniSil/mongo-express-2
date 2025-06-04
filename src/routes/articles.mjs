import { Router } from 'express'
import {
    getArticlesHandler,
    postArticleHandler,
    getArticleByIdHandler,
    putArticleByIdHandler,
    deleteArticleByIdHandler
} from '../controllers/articles.mjs'

import { validateArticleBody, validateParamsArticleId } from '../validators/articleValidation.mjs'


const articlesRouter = Router()

articlesRouter
    .route('/')
    .get(getArticlesHandler)
    .post(validateArticleBody, postArticleHandler)

articlesRouter
    .route('/:id')
    .get(validateParamsArticleId, getArticleByIdHandler)
    .put(validateParamsArticleId, validateArticleBody, putArticleByIdHandler)
    .delete(validateParamsArticleId, deleteArticleByIdHandler)

export default articlesRouter