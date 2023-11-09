const dbConfig = require('../config/db-config')
const mysql = require('mysql2')
const pool =  mysql.createPool(dbConfig)

pool.on('error', (err) => {
    console.error(err)
})

const authorNotFound = (res) => res.status(404).json({
    success: false,
    message: 'Author not found'
})

const responseSuccess = (res, result, message) => res.status(200).json({
    success: true,
    message: message,
    data: result
})

const getAuthors = (req, res) => {
    const query = 'SELECT * FROM author;'

    pool.getConnection((err, connection) => {
        if (err) throw err

        connection.query(query, (err, results) => {
            if (err) throw err

            responseSuccess(res, results, 'Authors successfully fetched')
        })
        connection.release()
    })
}

const getAuthor = (req, res) => {
    const id = req.params.id

    const query = `SELECT * FROM author WHERE id = ${id};`

    pool.getConnection((err, connection) => {
        if (err) throw err

        connection.query(query, (err, results) => {
            if (err) throw err
            
            if (results.affectedRows === 0) {
                authorNotFound(res)
            } else {
                responseSuccess(res, results, 'Author successfully fetched')
            }
        })
        connection.release()
    })
}

const addAuthor = (req, res) => {
    const data = {
        nama: req.body.nama,
        email: req.body.email,
        alamat: req.body.alamat,
        umur: req.body.umur,
        media_sosial: req.body.media_sosial
    }

    const query = 'INSERT INTO author SET ?;'

    pool.getConnection((err, connection) => {
        if (err) throw err

        connection.query(query, [data], (err, results) => {
            if (err) throw err

            responseSuccess(res, results, 'Author successfully added')
        })
        connection.release()
    })
}

const updateAuthor = (req, res) => {
    const id = req.params.id;
    const data = {
        nama: req.body.nama,
        email: req.body.email,
        alamat: req.body.alamat,
        umur: req.body.umur,
        media_sosial: req.body.media_sosial
    }
    
    const query = `UPDATE author SET ? WHERE id = ${id};`;
    
    pool.getConnection((err, connection) => {
        if (err) throw err;
    
        connection.query(query, [data], (err, results) => {
            if (err) throw err;
    
            if (results.affectedRows === 0) {
                authorNotFound(res)
            } else {
                responseSuccess(res, results, 'Author successfully updated');
            }
        });
    
        connection.release();
    });
}

const deleteAuthor = (req, res) => {
    const id = req.params.id

    const query = `DELETE FROM author WHERE id = ${id};`

    pool.getConnection((err, connection) => {
        if (err) throw err;

        connection.query(query, (err, results) => {
            if (err) throw err;

            if (results.affectedRows === 0) {
                authorNotFound(res);
            } else {
                responseSuccess(res, results, 'Author successfully deleted');
            }

            connection.release();
        })
    })
}

module.exports = {
    getAuthors,
    getAuthor,
    addAuthor,
    updateAuthor,
    deleteAuthor
}