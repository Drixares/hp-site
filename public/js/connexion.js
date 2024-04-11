const formEmail = document.getElementById('formEmail');
const formPassword = document.getElementById('formPassword');
const form = document.querySelector('form');
const error = document.getElementById('formError');


// Fonction qui vérifie l'email avec un regex dédié aux emails
function verifyEmail(input, email) {

  if (!email) {
      input.style.border = 'none';
      return false
  } else {
    const regEx =
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (regEx.test(email)) {
        input.style.border = '2px solid green'
        return true
    } else {
        input.style.border = '2px solid red'
        return false
    }
  }

}

// Même chose que la fonction avec l'email mais avec un regex différent pour le mot de passe.
function verifyPassword(input, password) {
  const regEx = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[#?!@$%^&*-])/;

  if (!password) {
    input.style.border = 'none';
    error.innerHTML = '';
    error.style.display = 'none';
    return false  
  } else {
    if (regEx.test(password)) {
      error.innerHTML = '';
      error.style.display = 'none';
      input.style.border = '2px solid green'
      return true
    } else {
        input.style.border = '2px solid red'
        error.innerHTML = 
            `The password must contain at least one uppercase letter, one lowercase letter, one number and one special character.`
        error.style.display = 'block';
        return false
    }
  }

}

// Evènement d'envoi du formulaire 
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  if (verifyEmail && verifyPassword) {
    try {
      const response = await fetch('/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formEmail.value,
          password: formPassword.value,
        }),
      });

      const data = await response.json();

      if (data.token) {
        localStorage.setItem('token', data.token);
        window.location.href = "/dashboard";
      } else {
        error.style.display = 'block';
        error.innerHTML = data.message;
      }

    } catch (err) {
      console.log(err);
    }
    
  } else {
    error.innerHTML = 'The form is not correctly filled.';
    error.style.display = 'block';
  }
});


formEmail.addEventListener('input', e => {
  localStorage.setItem('email', formEmail.value);
})


if (localStorage.getItem('email')) {
  formEmail.value = localStorage.getItem('email');
} else {
  formEmail.value = '';
}