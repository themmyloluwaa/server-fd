const handleSignin = (req, res, db, bcrypt) => {
  // select the email and pasword
  db.select("email", "hash")
    // from login table contained in the database
    .from("login")
    // and use the email as the id
    .where("email", "=", req.body.email)
    // then use the compare the results returned
    .then(data => {
      const isValid = bcrypt.compareSync(req.body.password, data[0].hash)
        ? true
        : false;

      // if the user password matches the password in the database
      if (isValid) {
        // return that particular user using the mail as the id
        return (
          db
            .select("*")
            .from("users")
            .where("email", "=", req.body.email)
            .then(user => {
              res.json(user[0]);
            })
            // else return an error
            .catch(err => res.status(400).json("user not found"))
        );
      } else {
        // else return an error
        res.status(400).json("wrong credentials");
      }
    })
    // else return an error
    .catch(err => res.status(400).json("wrong credentials"));
};

module.exports = {
  handleSignin: handleSignin
};
