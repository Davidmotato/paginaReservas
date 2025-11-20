document.addEventListener('DOMContentLoaded', function () {
  const fechaInput = document.getElementById('fecha');
  if (fechaInput) {
    const hoy = new Date();
    hoy.setDate(hoy.getDate() + 0); 
    const yyyy = hoy.getFullYear();
    const mm = String(hoy.getMonth() + 1).padStart(2, '0');
    const dd = String(hoy.getDate()).padStart(2, '0');
    fechaInput.min = `${yyyy}-${mm}-${dd}`;
  }

  // Form validation HTML5 (podrías extender)
  const form = document.getElementById('reservaForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      if (!form.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();
        alert('Completa los campos obligatorios.');
      }
    }, false);
  }
});