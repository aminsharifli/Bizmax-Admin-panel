function showToast(message) {
  let toast = document.getElementById('toast')

  toast.textContent = message
  toast.classList.add('show')

  setTimeout(function () {
    toast.classList.remove('show')
  }, 2200)
}

if (sessionStorage.getItem('bizmaxAdminAuth') === 'true') {
  location.href = './pages/anasehife.html'
}

document.getElementById('loginForm').addEventListener('submit', function (event) {
  event.preventDefault()

  let username = document.getElementById('username').value.trim()
  let password = document.getElementById('password').value.trim()

  if (username === 'admin' && password === '12345') {
    sessionStorage.setItem('bizmaxAdminAuth', 'true')
    showToast('Giriş uğurludur')

    setTimeout(function () {
      location.href = './pages/anasehife.html'
    }, 500)

    return
  }

  showToast('İstifadəçi adı və ya şifrə yanlışdır')
})
