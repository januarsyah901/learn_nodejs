const express = require("express");
const expressLayouts = require("express-ejs-layouts");

const { body, validationResult, check, Result } = require("express-validator");
const methodOverride = require("method-override");

const session = require("express-session");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");

require("./utils/db");
const Contact = require("./model/contact");
const { insertMany, updateOne } = require("./model/contact");

const app = express();
const port = 3000;

// set up methodOverride
app.use(methodOverride("_method"));

// setup ejs
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

// konfigurasi flash
app.use(cookieParser("secret"));
app.use(
  session({
    cookie: { maxAge: 6000 },
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());

// halaman home
app.get("/", (req, res) => {
  const santri = [
    {
      nama: "Januarsyah Akbar",
      email: "januar791@gmail.com",
    },
    {
      nama: "Ghifarin",
      email: "ghifarin56@gmail.com",
    },
    {
      nama: "Nabil Fikry",
      email: "nabil53@gmail.com",
    },
    {
      nama: "Bagus nur",
      email: "bgus567@gmail.com",
    },
  ];
  res.render("index", {
    nama: "Januarsyah Akbar",
    santri,
    title: "Home",
    layout: "layouts/main-layout",
  });
});

// halaman about
app.get("/about", (req, res) => {
  res.render("about", {
    layout: "layouts/main-layout",
    title: "Halaman About",
  });
  3;
});

// halaman contact
app.get("/contact", async (req, res) => {
  // Contact.find().then((contact)=> {
  //     res.send(contact)
  // })
  const contacts = await Contact.find();
  res.render("contact", {
    layout: "layouts/main-layout",
    title: "Halaman Contact",
    msg: req.flash("msg"),
    contacts,
  });
});

// proses tambah data contact
app.post(
  "/contact",
  [
    body("nama").custom(async (value) => {
      const duplikat = await Contact.findOne({ nama: value });
      if (duplikat) {
        throw new Error("Nama contact sudah terdaftar!");
      }
      return true;
    }),
    check("email", "Email tidal valid!").isEmail(),
    check("nohp", "Nomor tidak valid!").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("add-contact", {
        title: "Form Tambah Contact",
        layout: "layouts/main-layout",
        errors: errors.array(),
      });
    } else {
      Contact.insertMany(req.body, (errors, result) => {});
      req.flash("msg", "Contact Berhasil ditambahkan!");
      res.redirect("/contact");
    }
  }
);

// halaman tambah contact
app.get("/contact/add", (req, res) => {
  res.render("add-contact", {
    title: "Form Tambah Contact",
    layout: "layouts/main-layout",
  });
});

// proses delete contact
// app.get("/contact/delete/:nama", async (req, res) => {
//   const contact = await Contact.findOne({ nama: req.params.nama });
//   if (!contact) {
//     res.status(404);
//     res.send("<h2>404: Not Found!</>");
//   } else {
//     Contact.deleteOne({ _id: contact._id }).then((result)=>{
//       req.flash("msg", "Contact Berhasil dihapus!");
//       res.redirect("/contact");
//     });
//   }
// });
app.delete("/contact", (req, res) => {
  Contact.deleteOne({ nama: req.body.nama }).then((result) => {
    req.flash("msg", "Contact Berhasil Dihapus!");
    res.redirect("/contact");
  });
});

// halaman ubah contact
app.get("/contact/edit/:nama", async (req, res) => {
  const contact = await Contact.findOne({ nama: req.params.nama });
  res.render("edit-contact", {
    title: "Form Ubah Data Contact",
    layout: "layouts/main-layout",
    contact,
  });
});

// proses data contact
app.put(
  "/contact",
  [
    body("nama").custom(async (value, { req }) => {
      const duplikat = await Contact.findOne({ nama: value });
      if (value !== req.body.oldNama && duplikat) {
        throw new Error("Nama contact sudah terdaftar!");
      }
      return true;
    }),
    check("email", "Email tidal valid!").isEmail(),
    check("nohp", "Nomor tidak valid!").isMobilePhone("id-ID"),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("edit-contact", {
        title: "Form Ubah data Contact",
        layout: "layouts/main-layout",
        errors: errors.array(),
        contact: req.body,
      });
    } else {
      Contact.updateOne(
        { _id: req.body._id },
        {
          $set: {
            nama: req.body.nama,
            nohp: req.body.nohp,
            email: req.body.email,
          },
        }
      ).then((result) => {
        req.flash("msg", "Contact Berhasil Diubah!");
        res.redirect("/contact");
      });
    }
  }
);

// halaman ditail contact
app.get("/contact/:nama", async (req, res) => {
  const contact = await Contact.findOne({ nama: req.params.nama });
  res.render("detail", {
    layout: "layouts/main-layout",
    title: "Halaman Detail Contact",
    contact,
  });
});

app.listen(port, () => {
  console.log(`Mongo Contact App | listenimg at http://lochalhost: ${port}`);
});
