const { allAsync, runAsync } = require('../models/db');

exports.getAnimals = async (req, res) => {
  const { search } = req.query;
  let animals;
  if (search) {
    animals = await allAsync('SELECT * FROM animals WHERE name LIKE ?', [`%${search}%`]);
  } else {
    animals = await allAsync('SELECT * FROM animals');
  }
  res.render('index', { animals, title: 'Schronisko dla zwierząt', search: search || '' });
};

exports.addAnimal = async (req, res) => {
  const { name, species, age, gender, description } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  await runAsync(
    'INSERT INTO animals (name, species, age, gender, description, image) VALUES (?, ?, ?, ?, ?, ?)',
    [name, species, age || null, gender || null, description, image]
  );
  res.redirect('/');
};

exports.getAddForm = (req, res) => {
  res.render('add-animal', { title: 'Dodaj zwierzę' });
};

exports.getEditForm = async (req, res) => {
  const { id } = req.params;
  const animals = await allAsync('SELECT * FROM animals WHERE id = ?', [id]);
  const animal = animals[0];
  if (!animal) return res.status(404).send('Zwierzę nie znalezione');
  res.render('edit-animal', { animal, title: 'Edytuj zwierzę' });
};

exports.editAnimal = async (req, res) => {
  const { id } = req.params;
  const { name, species, age, gender, description } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  
  if (image) {
    await runAsync(
      'UPDATE animals SET name = ?, species = ?, age = ?, gender = ?, description = ?, image = ? WHERE id = ?',
      [name, species, age || null, gender || null, description, image, id]
    );
  } else {
    await runAsync(
      'UPDATE animals SET name = ?, species = ?, age = ?, gender = ?, description = ? WHERE id = ?',
      [name, species, age || null, gender || null, description, id]
    );
  }
  res.redirect('/');
};

exports.deleteAnimal = async (req, res) => {
  const { id } = req.params;
  await runAsync('DELETE FROM animals WHERE id = ?', [id]);
  res.redirect('/');
};
