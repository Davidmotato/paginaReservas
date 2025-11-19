// routes/reservas.js
const express = require('express');
const router = express.Router();
const db = require('../db');

// Landing: formulario de reserva
router.get('/', (req, res) => {
  res.render('index', { error: null, form: {} });
});

// Enviar reserva (desde landing)
router.post('/reservar', async (req, res) => {
  try {
    const { cliente, email, telefono, fecha, hora, personas, notas } = req.body;

    // Validación simple
    if (!cliente || !fecha || !hora || !personas) {
      return res.render('index', { error: 'Completa los campos obligatorios.', form: req.body });
    }

    await db.execute(
      `INSERT INTO reservas (cliente, email, telefono, fecha, hora, personas, notas)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [cliente, email || null, telefono || null, fecha, hora, parseInt(personas, 10), notas || null]
    );

    res.redirect('/success');
  } catch (err) {
    console.error(err);
    res.render('index', { error: 'Ocurrió un error al guardar la reserva.', form: req.body });
  }
});

// Página de éxito
router.get('/success', (req, res) => {
  res.render('success');
});

/* ------------- RUTAS ADMIN (CRUD) ------------- */

// Listar reservas (panel admin simple)
router.get('/admin/reservas', async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM reservas ORDER BY fecha ASC, hora ASC');
    res.render('admin_list', { reservas: rows });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Editar: formulario
router.get('/admin/reservas/edit/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const [rows] = await db.execute('SELECT * FROM reservas WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).send('Reserva no encontrada');
    res.render('admin_edit', { reserva: rows[0], error: null });
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Actualizar reserva
router.post('/admin/reservas/update/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { cliente, email, telefono, fecha, hora, personas, notas } = req.body;

    if (!cliente || !fecha || !hora || !personas) {
      const [rows] = await db.execute('SELECT * FROM reservas WHERE id = ?', [id]);
      return res.render('admin_edit', { reserva: rows[0], error: 'Completa los campos obligatorios.' });
    }

    await db.execute(
      `UPDATE reservas SET cliente=?, email=?, telefono=?, fecha=?, hora=?, personas=?, notas=? WHERE id=?`,
      [cliente, email || null, telefono || null, fecha, hora, parseInt(personas, 10), notas || null, id]
    );

    res.redirect('/admin/reservas');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

// Eliminar reserva
router.post('/admin/reservas/delete/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await db.execute('DELETE FROM reservas WHERE id = ?', [id]);
    res.redirect('/admin/reservas');
  } catch (err) {
    console.error(err);
    res.sendStatus(500);
  }
});

module.exports = router;
