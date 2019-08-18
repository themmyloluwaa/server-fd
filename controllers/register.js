const handleRegister = (req, res, db, bcrypt, saltRounds) => {
  // get the name, email and password from the user input
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json("please leave no field empty");
  }
  // encrypt password
  let hash = bcrypt.hashSync(password, saltRounds);
  // create a transaction that connects user and login table
  db.transaction(trx => {
    // insert the data gotten from the body
    trx
      .insert({
        hash: hash,
        email: email
      })
      // into the login table
      .into("login")
      // and return the email
      .returning("email")
      // to store it into the user database
      .then(loginEmail => {
        return (
          trx("users")
            .returning("*")
            .insert({
              email: loginEmail[0],
              name: name,
              joined: new Date()
            })
            // then send the user back to the frontend
            .then(user => res.json(user[0]))
        );
      })
      // then commit those change to the database
      .then(trx.commit)
      // else revert and cause no change
      .catch(trx.rollback);
  }).catch(err => res.status(400).json("unable to register"));
};

module.exports = {
  handleRegister: handleRegister
};
