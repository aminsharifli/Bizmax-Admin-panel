let testimonialList = []
let testimonialTableBody = document.getElementById('tableBody')
let testimonialTableHead = document.getElementById('tableHead')
let testimonialModal = document.getElementById('modal')
let testimonialForm = document.getElementById('modalForm')
let testimonialAddButton = document.getElementById('addButton')
let testimonialApiButton = document.getElementById('apiButton')
let testimonialApi = 'https://69e0c69c29c070e6597c00f2.mockapi.io/bizmax/Testimonial'

document.getElementById('pageTitle').innerHTML = 'Testimonial'
document.getElementById('heroTitle').innerHTML = 'Testimonial idarəetməsi'
document.getElementById('heroSubtitle').innerHTML = ''

testimonialTableHead.innerHTML = `<tr><th>ID</th><th>Ad</th><th>Şəkil</th><th>Rəy</th><th>Əməliyyat</th></tr>`

document.getElementById('modalFields').innerHTML = `
    <input type="hidden" id="itemid">
    <div class="field-group"><label>Ad</label><input type="text" id="name"></div>
    <div class="field-group"><label>Job</label><input type="text" id="job"></div>
    <div class="field-group full"><label>About</label><textarea id="about"></textarea></div>
    <div class="field-group full"><label>Şəkil URL</label><input type="text" id="imageUrl" placeholder="https://example.com/image.jpg"></div>
    <div class="field-group full"><label>Şəkil file</label><div class="upload-box"><input type="file" id="imageFile" accept="image/*"><p class="upload-note">URL yaz və ya şəkli file olaraq seç.</p><img class="upload-preview hidden" id="imagePreview" alt="preview"></div></div>
`

sekilSec('imageFile', 'imagePreview', 'imageUrl')

function getTestimonials() {
    fetch(testimonialApi)
        .then(res => res.json())
        .then(res => {
            testimonialList = res
            renderTestimonials()
        })
}

function renderTestimonials() {
    testimonialTableBody.innerHTML = ''

    if (testimonialList.length === 0) {
        testimonialTableBody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><h3>Məlumat yoxdur</h3><p>Hələ testimonial əlavə edilməyib.</p></div></td></tr>`
        return
    }

    testimonialList.map(item =>
        testimonialTableBody.innerHTML += `
            <tr>
                <td>${item.id || '-'}</td>
                <td><strong>${item.name || '-'}</strong><span class="table-subtext">${item.job || '-'}</span></td>
                <td class="table-image-cell">${item.avatar ? `<img src="${item.avatar}" class="table-image" alt="${item.name || 'testimonial'}">` : '-'}</td>
                <td><p class="table-text">${qisaYazi(item.about)}</p></td>
                <td><div class="table-actions"><button class="icon-button edit-button" data-id="${item.id}" data-type="edit">&#9998;</button><button class="icon-button" data-id="${item.id}" data-type="delete">&#128465;</button></div></td>
            </tr>
        `
    )

    document.querySelectorAll('[data-type="edit"]').forEach(function (button) {
        button.addEventListener('click', function () {
            editTestimonial(button.getAttribute('data-id'))
        })
    })

    document.querySelectorAll('[data-type="delete"]').forEach(function (button) {
        button.addEventListener('click', function () {
            deleteTestimonial(button.getAttribute('data-id'))
        })
    })
}

function openTestimonialModal() {
    document.getElementById('itemid').value = ''
    document.getElementById('modalTitle').innerHTML = 'Yeni testimonial'
    document.getElementById('modalSubtitle').innerHTML = 'Yeni məlumat əlavə et'
    testimonialForm.reset()
    document.getElementById('imageFile').setAttribute('data-img', '')
    document.getElementById('imageUrl').value = ''
    previewYaz('imagePreview', '')
    testimonialModal.classList.add('show')
}

function editTestimonial(id) {
    fetch(`${testimonialApi}/${id}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('itemid').value = data.id
            document.getElementById('name').value = data.name || ''
            document.getElementById('job').value = data.job || ''
            document.getElementById('about').value = data.about || ''
            document.getElementById('imageFile').setAttribute('data-img', data.avatar || '')
            document.getElementById('imageUrl').value = data.avatar || ''
            previewYaz('imagePreview', data.avatar || '')
            document.getElementById('modalTitle').innerHTML = 'Testimonialı düzəlt'
            document.getElementById('modalSubtitle').innerHTML = 'Dəyişiklik et və yadda saxla'
            testimonialModal.classList.add('show')
        })
}

function createTestimonial() {
    let imageFile = sekilFileGetir('imageFile')
    let imageUrl = sekilUrlGetir('imageUrl')

    if (imageUrl !== '') {
        createTestimonialWithUrl()
        return
    }

    if (imageFile) {
        createTestimonialWithFile()
        return
    }

    alert('Şəkil URL yazın və ya file seçin')
}

function createTestimonialWithUrl() {
    let yeniTestimonial = {
        name: document.getElementById('name').value,
        about: document.getElementById('about').value,
        job: document.getElementById('job').value,
        avatar: document.getElementById('imageUrl').value.trim()
    }

    fetch(testimonialApi, {
        method: 'POST',
        body: JSON.stringify(yeniTestimonial),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
        .then(res => res.json())
        .then(() => {
            toastGoster('Testimonial əlavə edildi')
            testimonialModal.classList.remove('show')
            getTestimonials()
        })
}

function createTestimonialWithFile() {
    let imageFile = sekilFileGetir('imageFile')
    let formData = new FormData()

    formData.append('name', document.getElementById('name').value)
    formData.append('about', document.getElementById('about').value)
    formData.append('job', document.getElementById('job').value)
    formData.append('avatar', imageFile)

    fetch(testimonialApi, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
    })
        .then(res => res.json())
        .then(() => {
            toastGoster('Testimonial əlavə edildi')
            testimonialModal.classList.remove('show')
            getTestimonials()
        })
}

function updateTestimonial() {
    let id = document.getElementById('itemid').value
    let imageFile = sekilFileGetir('imageFile')
    let imageUrl = sekilUrlGetir('imageUrl')
    let currentImage = sekilDataGetir('imageFile')

    if (imageUrl !== '') {
        updateTestimonialWithUrl(id)
        return
    }

    if (imageFile) {
        updateTestimonialWithFile(id)
        return
    }

    updateTestimonialWithCurrentImage(id, currentImage)
}

function updateTestimonialWithUrl(id) {
    let yenilenmisTestimonial = {
        name: document.getElementById('name').value,
        about: document.getElementById('about').value,
        job: document.getElementById('job').value,
        avatar: document.getElementById('imageUrl').value.trim()
    }

    fetch(`${testimonialApi}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(yenilenmisTestimonial),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
        .then(res => res.json())
        .then(() => {
            toastGoster('Testimonial yeniləndi')
            testimonialModal.classList.remove('show')
            getTestimonials()
        })
}

function updateTestimonialWithFile(id) {
    let imageFile = sekilFileGetir('imageFile')
    let formData = new FormData()

    formData.append('name', document.getElementById('name').value)
    formData.append('about', document.getElementById('about').value)
    formData.append('job', document.getElementById('job').value)
    formData.append('avatar', imageFile)

    fetch(`${testimonialApi}/${id}`, {
        method: 'PUT',
        headers: { Accept: 'application/json' },
        body: formData
    })
        .then(res => res.json())
        .then(() => {
            toastGoster('Testimonial yeniləndi')
            testimonialModal.classList.remove('show')
            getTestimonials()
        })
}

function updateTestimonialWithCurrentImage(id, currentImage) {
    let yenilenmisTestimonial = {
        name: document.getElementById('name').value,
        about: document.getElementById('about').value,
        job: document.getElementById('job').value,
        avatar: currentImage || ''
    }

    fetch(`${testimonialApi}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(yenilenmisTestimonial),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
        .then(res => res.json())
        .then(() => {
            toastGoster('Testimonial yeniləndi')
            testimonialModal.classList.remove('show')
            getTestimonials()
        })
}

function deleteTestimonial(id) {
    fetch(`${testimonialApi}/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => {
            getTestimonials()
        })
}

testimonialForm.addEventListener('submit', function (event) {
    event.preventDefault()

    if (document.getElementById('itemid').value === '') {
        createTestimonial()
    } else {
        updateTestimonial()
    }
})

testimonialAddButton.addEventListener('click', openTestimonialModal)
testimonialApiButton.addEventListener('click', function () {
    apiModalGoster('Testimonial API', testimonialApi)
})
document.getElementById('closeModalButton').addEventListener('click', function () { testimonialModal.classList.remove('show') })
document.getElementById('cancelModalButton').addEventListener('click', function () { testimonialModal.classList.remove('show') })
testimonialModal.addEventListener('click', function (event) {
    if (event.target === testimonialModal) {
        testimonialModal.classList.remove('show')
    }
})

getTestimonials()
