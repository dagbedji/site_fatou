import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import multer from "multer";
import path from "path";  // This is necessary to work with file paths in Node.js
import fs from "fs";
import session from 'express-session';

const app = express();
const port = 3000;

// user for authentication
const user = { username: 'admin', password: 'password123' };



const db = new pg.Client({
    user: "postgres",
    host: "localhost",
    database: "asespro",
    password: "Dagbedji@94",
    port: 5432,
});

db.connect();


app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());



// Session middleware
app.use(session({
    secret: 'yourSecretKey', // Your secret key
    resave: false,
    saveUninitialized: false,
    
}));

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },  // File size limit of 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"));
        }
    }
}).single('image')  // The field name is 'image' as in your form



app.use(async (req, res, next) => {
    try {
        const navQuery = await db.query("SELECT * FROM navigation");
        res.locals.navLinks = navQuery.rows; // Pass navigation data to all templates
        next();
    } catch (err) {
        console.error("Database error:", err);
        next(err);
    }
});


// Example route
app.get("/", async(req, res) => {
    const missionResult = await db.query("SELECT * FROM mission ORDER BY id ASC");
    const service = await db.query("SELECT * FROM service_data");
    const principe = await db.query("SELECT principe.id, title, text, image FROM principe JOIN session ON session.id = session_id ORDER BY id ASC");
    const offre = await db.query("SELECT offre.id, offre.title, offre.image FROM offre JOIN moreContent ON offre.id = offre_id");
    //const content = await db.query("SELECT * FROM moreContent");
    console.log("offre:",offre.rows)
    try{
        const services = service.rows[0];
        const missions = missionResult.rows;
        const principes = principe.rows;
        
        res.render("index.ejs", {
            services: services || [],
            missions: missions || [],
            principes: principes || [],
            user: req.session.user || null,  // Pass user to EJS template
            message: req.query.message || null 
        }); // navLinks will already be available
    }catch(err){
        console.log("error", err)
    };
    
});

app.get("/services", (req, res) =>{
    res.render("services.ejs", {
        offres: offre,
    });
});

app.get("/:route?", async (req, res) => {
    const route = req.params.route || "/";
    try {
        const pageQuery = await db.query(
            "SELECT * FROM navigation WHERE route = $1 LIMIT 1",
            [`/${route}`]
        );

        if (pageQuery.rows.length > 0) {
            const page = pageQuery.rows[0];
            res.render(`${page.name.toLowerCase()}.ejs`);
        } else {
            res.status(404).send("Page not found");
        }
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).send("Internal Server Error");
    }
});

// Login route
app.get('/login', (req, res) => {
    if (req.session.user) {
      // If the user is already logged in, redirect to the homepage
      return res.redirect('/');
    }
    res.render('login', { message: req.query.message || null });
  });

// Handle login form submission
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (username === user.username && password === user.password) {
      req.session.user = username;  // Save user to session
      res.redirect('/?message=Welcome%20Back');
    } else {
      res.render('login', { message: 'Invalid username or password' });
    }
  });
// Route for handling the form submission for mission
app.post('/editMission', upload, async (req, res) => {
    const missionForm = req.body;
    const missionFile = req.file;
    const id = missionForm.updatedItemId;
    const title = missionForm.updatedItemTitle;
    const description = missionForm.updatedItemDescription;
    const CurImage = await db.query("SELECT image FROM mission WHERE id = $1",[id]);
    const currentImage = CurImage.rows[0].image;
    const path = missionFile ? `/uploads/${missionFile.filename}` : currentImage;  // Return the relative path
    // Delete a file.
    if ((currentImage !== path)){
        const oldImagePath = `public${currentImage}`;
            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    console.error(`Failed to delete old image: ${err.message}`);
                } else {
                    console.log(`Old image deleted: ${oldImagePath}`);
                }
          });
    };
    try {
       await db.query(
            "UPDATE mission SET title = $1, description = $2, image = $3 WHERE id = $4",
            [title, description, path, id]
        );
        res.redirect("/");
    } catch (err) {
        console.error("Error updating the data:", err.message);
        res.status(500).send("Internal Server Error");
    }
});

//service route
app.post('/editServices', upload, async (req, res) => {
    const serviceForm = req.body;
    const serviceFile = req.file;
    const title = serviceForm.updatedItemTitle;
    const description = serviceForm.updatedItemDescription;
    const CurImage = await db.query("SELECT image FROM service_data");
    const currentImage = CurImage.rows[0].image;
    const path = serviceFile ? `/uploads/${serviceFile.filename}` : currentImage;  // Return the relative path
    // Delete a file.
    if ((currentImage !== path)){
        const oldImagePath = `public${currentImage}`;
            fs.unlink(oldImagePath, (err) => {
                if (err) {
                    console.error(`Failed to delete old image: ${err.message}`);
                } else {
                    console.log(`Old image deleted: ${oldImagePath}`);
                }
          });
    };
    try {
       await db.query(
            "UPDATE service_data SET title = $1, description = $2, image = $3",
            [title, description, path]
        );
        res.redirect("/");
    } catch (err) {
        console.error("Error updating the data:", err.message);
        res.status(500).send("Internal Server Error");
    }

});

app.post('/editPrincipes', upload, async (req, res) => {
    const { titles, texts, changes } = req.body;


    // Loop through changes and handle updates
    for (const index in changes) {
        if (changes[index]) {
            
            
            const id = parseInt(index) + 1;
           
            
            const updatedTitle = titles[index];
            const updatedText = texts[index];
            
            
            // Update database or perform actions here
            try {
                const result = await db.query(
                    "UPDATE principe SET title = $1, text = $2 WHERE id = $3",
                    [updatedTitle,updatedText, id]
                );
                console.log(`Database updated for ID: ${id}`, result);
            } catch (err) {
                console.error("Error updating the data:", err.message);
                return res.status(500).send("Internal Server Error");
            }
        }
    }
    res.redirect("/");
    
});

app.get('/principeEdit', (req, res) => {
    if (!req.user) {
      return res.redirect('/login');  // If the user is not authenticated, redirect to login
    }
    res.render('principeEdit');  // Render the edit page if the user is logged in
  });

// POST route to handle logout
app.post('/logout', (req, res) => {
    console.log("Before logout:", req.session); // Log session before logout
    req.session.destroy((err) => {
        if (err) {
            console.error("Error while logging out:", err);
            return res.status(500).send("Error while logging out.");
        }
        console.log("After logout:", req.session); // Log session after logout
        res.redirect('/'); // Redirect to the homepage after logout
    });
  });
  




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });