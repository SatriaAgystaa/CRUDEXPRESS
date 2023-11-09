const express = require("express")
const router = express.Router()
const {
    getAuthor,
    getAuthors,
    addAuthor,
    updateAuthor,
    deleteAuthor
} = require('../controller/author-controller')

router.get('/', getAuthors)
router.get('/:id', getAuthor)
router.post('/', addAuthor)
router.put('/:id', updateAuthor)
router.delete('/:id', deleteAuthor)

module.exports = router