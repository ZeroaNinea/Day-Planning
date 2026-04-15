const form = document.querySelector('.signup__form');

form.addEventListener('submit', (e) => {
  e.preventDefault();
  console.log('Form submitted!');

  const formData = new FormData(form);

  // create an account
  fetch('http://localhost:3000/auth/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: formData.get('username'),
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
