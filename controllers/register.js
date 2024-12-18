import knex from "knex";
import bcrypt from "bcrypt";

// Assuming 'db' is passed as an argument from server.js
const handleRegister = (req, res, db, bcrypt) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('incorrect form submission');
    }
    const hash = bcrypt.hashSync(password, 10);

    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*') 
                .insert({
                    email: loginEmail[0].email,
                    name: name,
                    joined: new Date()
                })
                .then(user => {
                    res.json(user[0]);
                });
        })
        .then(() => trx.commit()) // Make sure commit is called here
        .catch(() => trx.rollback());  // Ensure rollback in case of error
    })
    .catch(err => {
        console.error(err);
        res.status(400).json('Unable to register');
    });
};

export { handleRegister };
