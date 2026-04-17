let sliderList = []
let sliderTableBody = document.getElementById('tableBody')
let sliderTableHead = document.getElementById('tableHead')
let sliderModal = document.getElementById('modal')
let sliderForm = document.getElementById('modalForm')
let sliderAddButton = document.getElementById('addButton')
let sliderApiButton = document.getElementById('apiButton')
let sliderApi = 'https://69d27d515043d95be971eeff.mockapi.io/login/slider'

document.getElementById('pageTitle').innerHTML = 'Slider'
document.getElementById('heroTitle').innerHTML = 'Slider idarəetməsi'
document.getElementById('heroSubtitle').innerHTML = ''

sliderTableHead.innerHTML = `<tr><th>ID</th><th>Başlıq</th><th>Şəkil</th><th>Alt mətn</th><th>Əməliyyat</th></tr>`

document.getElementById('modalFields').innerHTML = `
    <input type="hidden" id="itemid">
    <div class="field-group"><label>Başlıq</label><input type="text" id="title"></div>
    <div class="field-group"><label>Top text</label><input type="text" id="toptext"></div>
    <div class="field-group full"><label>Bot text</label><input type="text" id="bottext"></div>
    <div class="field-group full"><label>Şəkil URL</label><input type="text" id="imageUrl" placeholder="https://example.com/image.jpg"></div>
    <div class="field-group full"><label>Şəkil file</label><div class="upload-box"><input type="file" id="imageFile" accept="image/*"><p class="upload-note">URL yaz və ya şəkli file olaraq seç.</p><img class="upload-preview hidden" id="imagePreview" alt="preview"></div></div>
`

sekilSec('imageFile', 'imagePreview', 'imageUrl')

function getSliders() {
    fetch(sliderApi)
        .then(res => res.json())
        .then(res => {
            sliderList = res
            renderSliders()
        })
}

function renderSliders() {
    sliderTableBody.innerHTML = ''

    if (sliderList.length === 0) {
        sliderTableBody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><h3>Məlumat yoxdur</h3><p>Hələ slider əlavə edilməyib.</p></div></td></tr>`
        return
    }

    sliderList.map(item =>
        sliderTableBody.innerHTML += `
            <tr>
                <td>${item.id || '-'}</td>
                <td><strong>${item.tittle || '-'}</strong><span class="table-subtext">${item['top-text'] || '-'}</span></td>
                <td class="table-image-cell">${item.image ? `<img src="${item.image}" class="table-image" alt="${item.tittle || 'slider'}">` : '-'}</td>
                <td><p class="table-text">${qisaYazi(item['bot-text'])}</p></td>
                <td><div class="table-actions"><button class="icon-button edit-button" data-id="${item.id}" data-type="edit">&#9998;</button><button class="icon-button" data-id="${item.id}" data-type="delete">&#128465;</button></div></td>
            </tr>
        `
    )

    document.querySelectorAll('[data-type="edit"]').forEach(function (button) {
        button.addEventListener('click', function () {
            editSlider(button.getAttribute('data-id'))
        })
    })

    document.querySelectorAll('[data-type="delete"]').forEach(function (button) {
        button.addEventListener('click', function () {
            deleteSlider(button.getAttribute('data-id'))
        })
    })
}

function openSliderModal() {
    document.getElementById('itemid').value = ''
    document.getElementById('modalTitle').innerHTML = 'Yeni slider'
    document.getElementById('modalSubtitle').innerHTML = 'Yeni məlumat əlavə et'
    sliderForm.reset()
    document.getElementById('imageFile').setAttribute('data-img', '')
    document.getElementById('imageUrl').value = ''
    previewYaz('imagePreview', '')
    sliderModal.classList.add('show')
}

function editSlider(id) {
    fetch(`${sliderApi}/${id}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('itemid').value = data.id
            document.getElementById('title').value = data.tittle || ''
            document.getElementById('toptext').value = data['top-text'] || ''
            document.getElementById('bottext').value = data['bot-text'] || ''
            document.getElementById('imageFile').setAttribute('data-img', data.image || '')
            document.getElementById('imageUrl').value = data.image || ''
            previewYaz('imagePreview', data.image || '')
            document.getElementById('modalTitle').innerHTML = 'Slideri düzəlt'
            document.getElementById('modalSubtitle').innerHTML = 'Dəyişiklik et və yadda saxla'
            sliderModal.classList.add('show')
        })
}

function createSlider() {
    let imageFile = sekilFileGetir('imageFile')
    let imageUrl = sekilUrlGetir('imageUrl')

    if (imageUrl !== '') {
        createSliderWithUrl()
        return
    }

    if (imageFile) {
        createSliderWithFile()
        return
    }

    alert('Şəkil URL yazın və ya file seçin')
}

function createSliderWithUrl() {
    let yeniSlider = {
        tittle: document.getElementById('title').value,
        'top-text': document.getElementById('toptext').value,
        'bot-text': document.getElementById('bottext').value,
        image: document.getElementById('imageUrl').value.trim()
    }

    fetch(sliderApi, {
        method: 'POST',
        body: JSON.stringify(yeniSlider),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
        .then(res => res.json())
        .then(() => {
            toastGoster('Slider əlavə edildi')
            sliderModal.classList.remove('show')
            getSliders()
        })
}

function createSliderWithFile() {
    let imageFile = sekilFileGetir('imageFile')
    let formData = new FormData()

    formData.append('tittle', document.getElementById('title').value)
    formData.append('top-text', document.getElementById('toptext').value)
    formData.append('bot-text', document.getElementById('bottext').value)
    formData.append('image', imageFile)

    fetch(sliderApi, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
    })
        .then(res => res.json())
        .then(() => {
            toastGoster('Slider əlavə edildi')
            sliderModal.classList.remove('show')
            getSliders()
        })
}

function updateSlider() {
    let id = document.getElementById('itemid').value
    let imageFile = sekilFileGetir('imageFile')
    let imageUrl = sekilUrlGetir('imageUrl')
    let currentImage = sekilDataGetir('imageFile')

    if (imageUrl !== '') {
        updateSliderWithUrl(id)
        return
    }

    if (imageFile) {
        updateSliderWithFile(id)
        return
    }

    updateSliderWithCurrentImage(id, currentImage)
}

function updateSliderWithUrl(id) {
    let yenilenmisSlider = {
        tittle: document.getElementById('title').value,
        'top-text': document.getElementById('toptext').value,
        'bot-text': document.getElementById('bottext').value,
        image: document.getElementById('imageUrl').value.trim()
    }

    fetch(`${sliderApi}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(yenilenmisSlider),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
        .then(res => res.json())
        .then(() => {
            toastGoster('Slider yeniləndi')
            sliderModal.classList.remove('show')
            getSliders()
        })
}

function updateSliderWithFile(id) {
    let imageFile = sekilFileGetir('imageFile')
    let formData = new FormData()

    formData.append('tittle', document.getElementById('title').value)
    formData.append('top-text', document.getElementById('toptext').value)
    formData.append('bot-text', document.getElementById('bottext').value)
    formData.append('image', imageFile)

    fetch(`${sliderApi}/${id}`, {
        method: 'PUT',
        headers: { Accept: 'application/json' },
        body: formData
    })
        .then(res => res.json())
        .then(() => {
            toastGoster('Slider yeniləndi')
            sliderModal.classList.remove('show')
            getSliders()
        })
}

function updateSliderWithCurrentImage(id, currentImage) {
    let yenilenmisSlider = {
        tittle: document.getElementById('title').value,
        'top-text': document.getElementById('toptext').value,
        'bot-text': document.getElementById('bottext').value,
        image: currentImage || ''
    }

    fetch(`${sliderApi}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(yenilenmisSlider),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
        .then(res => res.json())
        .then(() => {
            toastGoster('Slider yeniləndi')
            sliderModal.classList.remove('show')
            getSliders()
        })
}

function deleteSlider(id) {
    fetch(`${sliderApi}/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => {
            getSliders()
        })
}

sliderForm.addEventListener('submit', function (event) {
    event.preventDefault()

    if (document.getElementById('itemid').value === '') {
        createSlider()
    } else {
        updateSlider()
    }
})

sliderAddButton.addEventListener('click', openSliderModal)
sliderApiButton.addEventListener('click', function () {
    apiModalGoster('Slider API', sliderApi)
})
document.getElementById('closeModalButton').addEventListener('click', function () { sliderModal.classList.remove('show') })
document.getElementById('cancelModalButton').addEventListener('click', function () { sliderModal.classList.remove('show') })
sliderModal.addEventListener('click', function (event) {
    if (event.target === sliderModal) {
        sliderModal.classList.remove('show')
    }
})

getSliders()
