const form = document.querySelector('.signup__form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('Form submitted!');

  const formData = new FormData(form);

  console.log(formData.get('username'));
  console.log(formData.get('email'));
  console.log(formData.get('password'));

  // window.location.href = '../Dashboard/Dashboard.html';
});
