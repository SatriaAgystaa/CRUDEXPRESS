const dbConfig = require('../config/db-config')
const mysql = require('mysql2')
const pool =  mysql.createPool(dbConfig)

pool.on('error', (err) => {
    console.error(err)
})

const responseBookNotFound = (err) => res.status(404).json({
    success: false,
    message: 'Book not found'
})

const responseSuccess = (res, result, message) => res.status(200).json({
    success: true,
    message: message,
    data: result
})

const getBooks = (req, res) => {
    const query = 'SELECT * FROM books;'

    pool.getConnection((err, connection) => {
        if (err) throw err

        connection.query(query, (err, results) => {
            if (err) throw err

            responseSuccess(res, results, 'Books successfully fetched')
        })
        connection.release()
    })
}

const addBook = (req, res) => {
    const data = {
        nama: req.body.nama,
        author: req.body.author,
        year: req.body.year,
        page_count: req.body.page_count,
        publisher: req.body.publisher
    }

    const query = 'INSERT INTO books SET ?;'

    pool.getConnection((err, connection) => {
        if (err) throw err

        connection.query(query, [data], (err, results) => {
            if (err) throw err

            responseSuccess(res, results, 'Book successfully added')
        })
        connection.release()
    })
}   

const updateBook = (req, res) => {
    const id = req.params.id;
    const data = {
        nama: req.body.nama,
        author: req.body.author,
        year: req.body.year,
        page_count: req.body.page_count,
        publisher: req.body.publisher
    }
    
    const query = `UPDATE books SET ? WHERE id = ${id};`;
    
    pool.getConnection((err, connection) => {
        if (err) throw err;
    
        connection.query(query, [data], (err, results) => {
            if (err) throw err;
    
            if (results.affectedRows === 0) {
                responseBookNotFound(res)
            } else {
                responseSuccess(res, results, 'Book successfully updated');
            }
        });
    
        connection.release();
    });
}

const deleteBook = (req, res) => {
    const id = req.params.id

    const query = `DELETE FROM books WHERE id = ${id};`

    pool.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(query, (err, results) => {
            if (err) throw err;

            if (results.affectedRows === 0) {
                responseBookNotFound(res);
            } else {
                responseSuccess(res, results, 'Book successfully deleted');
            }

            connection.release();
        })
    })
}

const getBook = (req, res) => {
    const id = req.params.id

    const query = `SELECT * FROM books WHERE id = ${id};`

    pool.getConnection((err, connection) => {
        if (err) throw err

        connection.query(query, (err, results) => {
            if (err) throw err
            
            if (results.affectedRows === 0) {
                responseBookNotFound(res)
                return
            }
            responseSuccess(res, results, 'Book successfully fetched')
        })
        connection.release()
    })
}

module.exports = {
    getBooks, getBook, addBook, updateBook, deleteBook
}