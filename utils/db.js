const mongoose = require("mongoose");
mongoose.connect("mongodb://127.0.0.1:27017/Tcoding", {
  useNewUrlParser: true,
  useUnfiedTopology: true,
  useCreateIndex: true,
});



// // menambah satu data
// const contact1 = new Contact({
//   nama: "pramesti",
//   nohp: "085750566499",
//   email: "pramestiakbar748@au.id",
// });

// // simpan ke collection
// contact1.save().then((contact) => console.log(contact));
