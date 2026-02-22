const { allAsync, runAsync } = require('../models/db');

exports.getAnimals = async (req, res) => {
  const animals = await allAsync('SELECT * FROM animals');
  res.render('index', { animals, title: 'Schronisko dla zwierząt' });
};

exports.addAnimal = async (req, res) => {
  const { name, species, age, description } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  await runAsync(
    'INSERT INTO animals (name, species, age, description, image) VALUES (?, ?, ?, ?, ?)',
    [name, species, age || null, description, image]
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
  const { name, species, age, description } = req.body;
  const image = req.file ? `/uploads/${req.file.filename}` : null;
  
  if (image) {
    await runAsync(
      'UPDATE animals SET name = ?, species = ?, age = ?, description = ?, image = ? WHERE id = ?',
      [name, species, age || null, description, image, id]
    );
  } else {
    await runAsync(
      'UPDATE animals SET name = ?, species = ?, age = ?, description = ? WHERE id = ?',
      [name, species, age || null, description, id]
    );
  }
  res.redirect('/');
};

exports.deleteAnimal = async (req, res) => {
  const { id } = req.params;
  await runAsync('DELETE FROM animals WHERE id = ?', [id]);
  res.redirect('/');
};
