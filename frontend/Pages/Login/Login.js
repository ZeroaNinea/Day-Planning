const form = document.querySelector('.login__form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('Form submitted!');

  const formData = new FormData(form);

  // Login into the account.
  fetch('http://localhost:3000/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email: formData.get('email'),
      password: formData.get('password'),
    }),
  })
    .then((res) => {
      if (res.ok) {
        window.location.href = '../Dashboard/Dashboard.html';
      }
    })
    .catch((err) => {
      console.error(err);
    });
});
