let serviceList = []
let serviceTableBody = document.getElementById('tableBody')
let serviceTableHead = document.getElementById('tableHead')
let serviceModal = document.getElementById('modal')
let serviceForm = document.getElementById('modalForm')
let serviceAddButton = document.getElementById('addButton')
let serviceApiButton = document.getElementById('apiButton')
let serviceApi = 'https://69b9b40db3dcf7e0b4bb0212.mockapi.io/service'

document.getElementById('pageTitle').innerHTML = 'Servisl\u0259r'
document.getElementById('heroTitle').innerHTML = 'Servis idar\u0259etm\u0259si'
document.getElementById('heroSubtitle').innerHTML = ''

serviceTableHead.innerHTML = `<tr><th>ID</th><th>Ba\u015fl\u0131q</th><th>\u015e\u0259kil</th><th>\u0130kon</th><th>A\u00e7\u0131qlama</th><th>\u018fm\u0259liyyat</th></tr>`

document.getElementById('modalFields').innerHTML = `
    <input type="hidden" id="itemid">
    <div class="field-group"><label>Ba\u015fl\u0131q</label><input type="text" id="title"></div>
    <div class="field-group"><label>\u0130kon</label><input type="text" id="icon"></div>
    <div class="field-group full"><label>Header</label><input type="text" id="header"></div>
    <div class="field-group full"><label>About</label><textarea id="about"></textarea></div>
    <div class="field-group full"><label>\u015e\u0259kil URL</label><input type="text" id="imageUrl" placeholder="https://example.com/image.jpg"></div>
    <div class="field-group full"><label>\u015e\u0259kil file</label><div class="upload-box"><input type="file" id="imageFile" accept="image/*"><p class="upload-note">URL yaz v\u0259 ya \u015f\u0259kli file olaraq se\u00e7.</p><img class="upload-preview hidden" id="imagePreview" alt="preview"></div></div>
`

sekilSec('imageFile', 'imagePreview', 'imageUrl')

function getServices() {
    fetch(serviceApi)
        .then(res => res.json())
        .then(res => {
            serviceList = res
            renderServices()
        })
}

function renderServices() {
    serviceTableBody.innerHTML = ''

    if (serviceList.length === 0) {
        serviceTableBody.innerHTML = `<tr><td colspan="6"><div class="empty-state"><h3>M\u0259lumat yoxdur</h3><p>H\u0259l\u0259 servis \u0259lav\u0259 edilm\u0259yib.</p></div></td></tr>`
        return
    }

    serviceList.map(item =>
        serviceTableBody.innerHTML += `
            <tr>
                <td>${item.id || '-'}</td>
                <td><strong>${item.title || '-'}</strong><span class="table-subtext">${item.header || '-'}</span></td>
                <td class="table-image-cell">${item.image ? `<img src="${item.image}" class="table-image" alt="${item.title || 'service'}">` : '-'}</td>
                <td><span class="table-tag">${item.icon || '-'}</span></td>
                <td><p class="table-text">${qisaYazi(item.about)}</p></td>
                <td><div class="table-actions"><button class="icon-button edit-button" data-id="${item.id}" data-type="edit">&#9998;</button><button class="icon-button" data-id="${item.id}" data-type="delete">&#128465;</button></div></td>
            </tr>
        `
    )

    document.querySelectorAll('[data-type="edit"]').forEach(function (button) {
        button.addEventListener('click', function () {
            editService(button.getAttribute('data-id'))
        })
    })

    document.querySelectorAll('[data-type="delete"]').forEach(function (button) {
        button.addEventListener('click', function () {
            deleteService(button.getAttribute('data-id'))
        })
    })
}

function openServiceModal() {
    document.getElementById('itemid').value = ''
    document.getElementById('modalTitle').innerHTML = 'Yeni servis'
    document.getElementById('modalSubtitle').innerHTML = 'Yeni m\u0259lumat \u0259lav\u0259 et'
    serviceForm.reset()
    document.getElementById('imageFile').setAttribute('data-img', '')
    document.getElementById('imageUrl').value = ''
    previewYaz('imagePreview', '')
    serviceModal.classList.add('show')
}

function editService(id) {
    fetch(`${serviceApi}/${id}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('itemid').value = data.id
            document.getElementById('title').value = data.title || ''
            document.getElementById('icon').value = data.icon || ''
            document.getElementById('header').value = data.header || ''
            document.getElementById('about').value = data.about || ''
            document.getElementById('imageFile').setAttribute('data-img', data.image || '')
            document.getElementById('imageUrl').value = data.image || ''
            previewYaz('imagePreview', data.image || '')
            document.getElementById('modalTitle').innerHTML = 'Servisi d\u00fcz\u0259lt'
            document.getElementById('modalSubtitle').innerHTML = 'D\u0259yi\u015fiklik et v\u0259 yadda saxla'
            serviceModal.classList.add('show')
        })
}

function createService() {
    let imageFile = sekilFileGetir('imageFile')
    let imageUrl = sekilUrlGetir('imageUrl')

    if (imageUrl !== '') {
        createServiceWithUrl()
        return
    }

    if (imageFile) {
        createServiceWithFile()
        return
    }

    alert('\u015e\u0259kil URL yaz\u0131n v\u0259 ya file se\u00e7in')
}

function createServiceWithUrl() {
    let yeniServis = {
        title: document.getElementById('title').value,
        icon: document.getElementById('icon').value,
        header: document.getElementById('header').value,
        about: document.getElementById('about').value,
        image: document.getElementById('imageUrl').value.trim()
    }

    fetch(serviceApi, {
        method: 'POST',
        body: JSON.stringify(yeniServis),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
        .then(res => res.json())
        .then(() => {
            toastGoster('Servis \u0259lav\u0259 edildi')
            serviceModal.classList.remove('show')
            getServices()
        })
}

function createServiceWithFile() {
    let imageFile = sekilFileGetir('imageFile')
    let formData = new FormData()

    formData.append('title', document.getElementById('title').value)
    formData.append('icon', document.getElementById('icon').value)
    formData.append('header', document.getElementById('header').value)
    formData.append('about', document.getElementById('about').value)
    formData.append('image', imageFile)

    fetch(serviceApi, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
    })
        .then(res => res.json())
        .then(() => {
            toastGoster('Servis \u0259lav\u0259 edildi')
            serviceModal.classList.remove('show')
            getServices()
        })
}

function updateService() {
    let id = document.getElementById('itemid').value
    let imageFile = sekilFileGetir('imageFile')
    let imageUrl = sekilUrlGetir('imageUrl')
    let currentImage = sekilDataGetir('imageFile')

    if (imageUrl !== '') {
        updateServiceWithUrl(id)
        return
    }

    if (imageFile) {
        updateServiceWithFile(id)
        return
    }

    updateServiceWithCurrentImage(id, currentImage)
}

function updateServiceWithUrl(id) {
    let yenilenmisServis = {
        title: document.getElementById('title').value,
        icon: document.getElementById('icon').value,
        header: document.getElementById('header').value,
        about: document.getElementById('about').value,
        image: document.getElementById('imageUrl').value.trim()
    }

    fetch(`${serviceApi}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(yenilenmisServis),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
        .then(res => res.json())
        .then(() => {
            toastGoster('Servis yenil\u0259ndi')
            serviceModal.classList.remove('show')
            getServices()
        })
}

function updateServiceWithFile(id) {
    let imageFile = sekilFileGetir('imageFile')
    let formData = new FormData()

    formData.append('title', document.getElementById('title').value)
    formData.append('icon', document.getElementById('icon').value)
    formData.append('header', document.getElementById('header').value)
    formData.append('about', document.getElementById('about').value)
    formData.append('image', imageFile)

    fetch(`${serviceApi}/${id}`, {
        method: 'PUT',
        headers: { Accept: 'application/json' },
        body: formData
    })
        .then(res => res.json())
        .then(() => {
            toastGoster('Servis yenil\u0259ndi')
            serviceModal.classList.remove('show')
            getServices()
        })
}

function updateServiceWithCurrentImage(id, currentImage) {
    let yenilenmisServis = {
        title: document.getElementById('title').value,
        icon: document.getElementById('icon').value,
        header: document.getElementById('header').value,
        about: document.getElementById('about').value,
        image: currentImage || ''
    }

    fetch(`${serviceApi}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(yenilenmisServis),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
        .then(res => res.json())
        .then(() => {
            toastGoster('Servis yenil\u0259ndi')
            serviceModal.classList.remove('show')
            getServices()
        })
}

function deleteService(id) {
    fetch(`${serviceApi}/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => {
            getServices()
        })
}

serviceForm.addEventListener('submit', function (event) {
    event.preventDefault()

    if (document.getElementById('itemid').value === '') {
        createService()
    } else {
        updateService()
    }
})

serviceAddButton.addEventListener('click', openServiceModal)
serviceApiButton.addEventListener('click', function () {
    apiModalGoster('Servisl\u0259r API', serviceApi)
})
document.getElementById('closeModalButton').addEventListener('click', function () { serviceModal.classList.remove('show') })
document.getElementById('cancelModalButton').addEventListener('click', function () { serviceModal.classList.remove('show') })
serviceModal.addEventListener('click', function (event) {
    if (event.target === serviceModal) {
        serviceModal.classList.remove('show')
    }
})

getServices()
