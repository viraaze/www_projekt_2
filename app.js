const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const multer = require('multer');
const { initializeDatabase } = require('./models/db');
const animalController = require('./controllers/animalController');

const app = express();

// Konfiguracja multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/uploads'));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Konfiguracja
app.set('view engine', 'ejs');
app.disable('view cache');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.set('Pragma', 'no-cache');
  res.set('Expires', '0');
  next();
});
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// Inicjalizacja bazy danych
initializeDatabase().catch(err => console.error('DB Error:', err));

// Trasy
app.get('/', animalController.getAnimals);
app.get('/add', animalController.getAddForm);
app.post('/add', upload.single('image'), animalController.addAnimal);
app.get('/edit/:id', animalController.getEditForm);
app.post('/edit/:id', upload.single('image'), animalController.editAnimal);
app.post('/delete/:id', animalController.deleteAnimal);

// Start serwera
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Serwer uruchomiony na http://localhost:${PORT}`);
});
