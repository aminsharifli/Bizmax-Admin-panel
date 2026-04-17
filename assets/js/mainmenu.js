let sehife = document.body.getAttribute('data-page')
let toast = document.getElementById('toast')

function menuAktivEt() {
    let linkler = document.querySelectorAll('.nav-link')

    linkler.forEach(function (item) {
        item.classList.remove('active')

        if (item.getAttribute('data-page') === sehife) {
            item.classList.add('active')
        }
    })
}

function cixisEt() {
    let logoutButton = document.getElementById('logoutButton')

    if (!logoutButton) return

    logoutButton.addEventListener('click', function () {
        sessionStorage.removeItem('bizmaxAdminAuth')
        location.href = '../index.htm'
    })
}

function toastGoster(text) {
    if (!toast) return

    toast.textContent = text
    toast.classList.add('show')

    setTimeout(function () {
        toast.classList.remove('show')
    }, 2000)
}

function qisaYazi(text) {
    if (!text) return '-'

    if (text.length > 120) {
        return text.slice(0, 120) + '...'
    }

    return text
}

function sekilSec(inputId, previewId, urlInputId) {
    let input = document.getElementById(inputId)
    let preview = document.getElementById(previewId)
    let urlInput = urlInputId ? document.getElementById(urlInputId) : null

    if (!input || !preview) return

    input.addEventListener('change', function () {
        let file = input.files[0]

        if (!file) {
            if (!urlInput || urlInput.value.trim() === '') {
                input.setAttribute('data-img', '')
                previewYaz(previewId, '')
            }

            return
        }

        if (urlInput) {
            urlInput.value = ''
        }

        let reader = new FileReader()

        reader.onload = function (e) {
            input.setAttribute('data-img', e.target.result)
            preview.src = e.target.result
            preview.classList.remove('hidden')
        }

        reader.readAsDataURL(file)
    })

    if (urlInput) {
        urlInput.addEventListener('input', function () {
            let url = urlInput.value.trim()

            if (url !== '') {
                input.value = ''
                input.setAttribute('data-img', url)
                previewYaz(previewId, url)
            } else if (!sekilFileGetir(inputId)) {
                input.setAttribute('data-img', '')
                previewYaz(previewId, '')
            }
        })
    }
}

function sekilDataGetir(inputId) {
    let input = document.getElementById(inputId)

    if (!input) return ''

    return input.getAttribute('data-img') || ''
}

function sekilFileGetir(inputId) {
    let input = document.getElementById(inputId)

    if (!input || !input.files || !input.files[0]) return null

    return input.files[0]
}

function sekilUrlGetir(inputId) {
    let input = document.getElementById(inputId)

    if (!input) return ''

    return input.value.trim()
}

function previewYaz(previewId, src) {
    let preview = document.getElementById(previewId)

    if (!preview) return

    if (src === '') {
        preview.src = ''
        preview.classList.add('hidden')
    } else {
        preview.src = src
        preview.classList.remove('hidden')
    }
}

function apiModalGoster(title, api) {
    let apiModal = document.getElementById('apiModal')
    let apiModalTitle = document.getElementById('apiModalTitle')
    let apiModalText = document.getElementById('apiModalText')

    if (!apiModal || !apiModalTitle || !apiModalText) return

    apiModalTitle.innerHTML = title
    apiModalText.textContent = api
    apiModal.classList.add('show')
}

function apiModalBagla() {
    let apiModal = document.getElementById('apiModal')
    let closeApiModalButton = document.getElementById('closeApiModalButton')
    let cancelApiModalButton = document.getElementById('cancelApiModalButton')

    if (!apiModal) return

    if (closeApiModalButton) {
        closeApiModalButton.addEventListener('click', function () {
            apiModal.classList.remove('show')
        })
    }

    if (cancelApiModalButton) {
        cancelApiModalButton.addEventListener('click', function () {
            apiModal.classList.remove('show')
        })
    }

    apiModal.addEventListener('click', function (event) {
        if (event.target === apiModal) {
            apiModal.classList.remove('show')
        }
    })
}

menuAktivEt()
cixisEt()
apiModalBagla()
