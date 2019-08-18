const Clarifai = require("Clarifai");

const app = new Clarifai.App({ apiKey: "c36ed3caa8284a98861b45d79dccf183" });
const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => res.json(data))
    .catch(err => res.status(400).json("wrong api call"));
};

const putImage = (req, res, db) => {
  const { id } = req.body;
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => res.json(entries[0]))
    .catch(err => res.status(400).json("unable to load count"));
};

module.exports = {
  putImage,
  handleApiCall
};
