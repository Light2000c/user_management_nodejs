const mysql = require('mysql');

// Connection Pool
const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});


// create, find, update, delete

//view users
exports.view = (req, res) => {

    // res.render('home');

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as ID ', connection.threadId);

        // use the connection

        connection.query('SELECT * FROM user WHERE status = "active"', (err, result) => {
            // when done with the connection, release it
            connection.release();

            if (!err) {
                let removedUser = req.query.removed;
                res.render('home', { result, removedUser });
            } else {
                console.log(err);
            }

            console.log("data from user table ==> ", result);

        });

    });

};


//find users by search
exports.find = (req, res) => {

    pool.getConnection((err, connection) => {
        if (err) throw err;

        console.log("Connected as ID" + connection.threadId);

        let searchTerm = req.body.search;

        console.log("Search Term ==> ", searchTerm);

        connection.query("SELECT * FROM user WHERE first_name  LIKE ? OR last_name LIKE ?", ['%' + searchTerm + '%', '%' + searchTerm + '%'], (err, result) => {
            connection.release();

            if (!err) {
                res.render('home', { result })

            } else {
                console.log(err);
            }

        });


    });

};



// Add new user
exports.form = (req, res) => {

    res.render('add-user');

};


exports.create = (req, res) => {

    const { first_name, last_name, email, phone, comments } = req.body;
    // res.render('add-user');

    pool.getConnection((err, connection) => {
        if (err) throw err;

        console.log("Connected as ID" + connection.threadId);


        connection.query('INSERT INTO user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ?', [first_name, last_name, email, phone, comments], (err, result) => {
            connection.release();

            if (!err) {
                res.render('add-user', { alert: 'User added successfully.' });

            } else {
                console.log(err);
            }

        });


    });

};



//edit user
exports.edit = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as ID ', connection.threadId);

        let id = req.params.id;

        // use the connection
        connection.query('SELECT * FROM user  WHERE id = ?', [id], (err, result) => {
            // when done with the connection, release it
            connection.release();

            if (!err) {
                res.render('edit-user', { result });
            } else {
                console.log(err);
            }

            console.log("data from user table ==> ", result);

        });

    });
};





// Update User
exports.update = (req, res) => {

    const { first_name, last_name, email, phone, comments } = req.body;

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as ID ', connection.threadId);

        let id = req.params.id;

        // use the connection
        connection.query('UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?', [first_name, last_name, email, phone, comments, id], (err, result) => {
            // when done with the connection, release it
            connection.release();

            if (!err) {

                pool.getConnection((err, connection) => {
                    if (err) throw err;
                    console.log('Connected as ID ', connection.threadId);

                    let id = req.params.id;

                    // use the connection
                    connection.query('SELECT * FROM user  WHERE id = ?', [id], (err, result) => {
                        // when done with the connection, release it
                        connection.release();

                        if (!err) {

                            res.render('edit-user', { result, alert: `${first_name} has been updated` });
                        } else {
                            console.log(err);
                        }

                    });

                });

            } else {
                console.log(err);
            }

            console.log("data from user table ==> ", result);

        });

    });
};



// Delete user
exports.delete = (req, res) => {
    // pool.getConnection((err, connection) => {
    //     if (err) throw err;
    //     console.log('Connected as ID ', connection.threadId);

    //     let id = req.params.id;

    //     // use the connection
    //     connection.query('DELETE   FROM user  WHERE id = ?', [id], (err, result) => {
    //         // when done with the connection, release it
    //         connection.release();

    //         if (!err) {
    //             res.redirect('/');
    //         } else {
    //             console.log(err);
    //         }

    //         console.log("data from user table ==> ", result);

    //     });

    // });

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as ID ', connection.threadId);

        let id = req.params.id;

        connection.query('UPDATE user SET status = ?  WHERE id = ?', ['removed',id], (err, result) => {
            connection.release();

            if (!err) {
                let removedUser = encodeURIComponent('User successfully removed.');
                res.redirect('/?removed='+ removedUser);
            } else {
                console.log(err);
            }

            console.log("data from user table ==> ", result);
        });

    });

};



//view all users
exports.viewall = (req, res) => {

    // res.render('home');

    pool.getConnection((err, connection) => {
        if (err) throw err;
        console.log('Connected as ID ', connection.threadId);

        connection.query('SELECT * FROM user WHERE id = ?',[req.params.id], (err, result) => {

            connection.release();

            if (!err) {
                res.render('view-user', { result });
            } else {
                console.log(err);
            }

            console.log("data from user table ==> ", result);

        });

    });

};