let blogList = []
let blogTableBody = document.getElementById('tableBody')
let blogTableHead = document.getElementById('tableHead')
let blogModal = document.getElementById('modal')
let blogForm = document.getElementById('modalForm')
let blogAddButton = document.getElementById('addButton')
let blogApiButton = document.getElementById('apiButton')
let blogApi = 'https://69d27d515043d95be971eeff.mockapi.io/login/Blog'

document.getElementById('pageTitle').innerHTML = 'Bloq yazıları'
document.getElementById('heroTitle').innerHTML = 'Bloq idarəetməsi'
document.getElementById('heroSubtitle').innerHTML = ''

blogTableHead.innerHTML = `<tr><th>ID</th><th>Başlıq</th><th>Şəkil</th><th>Mətn</th><th>Əməliyyat</th></tr>`

document.getElementById('modalFields').innerHTML = `
    <input type="hidden" id="itemid">
    <div class="field-group"><label>Başlıq</label><input type="text" id="title"></div>
    <div class="field-group full"><label>About</label><textarea id="about"></textarea></div>
    <div class="field-group full"><label>Şəkil URL</label><input type="text" id="imageUrl" placeholder="https://example.com/image.jpg"></div>
    <div class="field-group full"><label>Şəkil file</label><div class="upload-box"><input type="file" id="imageFile" accept="image/*"><p class="upload-note">URL yaz və ya şəkli file olaraq seç.</p><img class="upload-preview hidden" id="imagePreview" alt="preview"></div></div>
`

sekilSec('imageFile', 'imagePreview', 'imageUrl')

function getBlogs() {
    fetch(blogApi)
        .then(res => res.json())
        .then(res => {
            blogList = res
            renderBlogs()
        })
}

function renderBlogs() {
    blogTableBody.innerHTML = ''

    if (blogList.length === 0) {
        blogTableBody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><h3>Məlumat yoxdur</h3><p>Hələ bloq əlavə edilməyib.</p></div></td></tr>`
        return
    }

    blogList.map(item =>
        blogTableBody.innerHTML += `
            <tr>
                <td>${item.id || '-'}</td>
                <td><strong>${item.title || '-'}</strong></td>
                <td class="table-image-cell">${item.image ? `<img src="${item.image}" class="table-image" alt="${item.title || 'blog'}">` : '-'}</td>
                <td><p class="table-text">${qisaYazi(item.about)}</p></td>
                <td><div class="table-actions"><button class="icon-button edit-button" data-id="${item.id}" data-type="edit">&#9998;</button><button class="icon-button" data-id="${item.id}" data-type="delete">&#128465;</button></div></td>
            </tr>
        `
    )

    document.querySelectorAll('[data-type="edit"]').forEach(function (button) {
        button.addEventListener('click', function () {
            editBlog(button.getAttribute('data-id'))
        })
    })

    document.querySelectorAll('[data-type="delete"]').forEach(function (button) {
        button.addEventListener('click', function () {
            deleteBlog(button.getAttribute('data-id'))
        })
    })
}

function openBlogModal() {
    document.getElementById('itemid').value = ''
    document.getElementById('modalTitle').innerHTML = 'Yeni yazı'
    document.getElementById('modalSubtitle').innerHTML = 'Yeni məlumat əlavə et'
    blogForm.reset()
    document.getElementById('imageFile').setAttribute('data-img', '')
    document.getElementById('imageUrl').value = ''
    previewYaz('imagePreview', '')
    blogModal.classList.add('show')
}

function editBlog(id) {
    fetch(`${blogApi}/${id}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('itemid').value = data.id
            document.getElementById('title').value = data.title || ''
            document.getElementById('about').value = data.about || ''
            document.getElementById('imageFile').setAttribute('data-img', data.image || '')
            document.getElementById('imageUrl').value = data.image || ''
            previewYaz('imagePreview', data.image || '')
            document.getElementById('modalTitle').innerHTML = 'Bloqu düzəlt'
            document.getElementById('modalSubtitle').innerHTML = 'Dəyişiklik et və yadda saxla'
            blogModal.classList.add('show')
        })
}

function createBlog() {
    let imageFile = sekilFileGetir('imageFile')
    let imageUrl = sekilUrlGetir('imageUrl')

    if (imageUrl !== '') {
        createBlogWithUrl()
        return
    }

    if (imageFile) {
        createBlogWithFile()
        return
    }

    alert('Şəkil URL yazın və ya file seçin')
}

function createBlogWithUrl() {
    let yeniBlog = {
        title: document.getElementById('title').value,
        about: document.getElementById('about').value,
        image: document.getElementById('imageUrl').value.trim()
    }

    fetch(blogApi, {
        method: 'POST',
        body: JSON.stringify(yeniBlog),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
        .then(res => res.json())
        .then(() => {
            toastGoster('Bloq əlavə edildi')
            blogModal.classList.remove('show')
            getBlogs()
        })
}

function createBlogWithFile() {
    let imageFile = sekilFileGetir('imageFile')
    let formData = new FormData()

    formData.append('title', document.getElementById('title').value)
    formData.append('about', document.getElementById('about').value)
    formData.append('image', imageFile)

    fetch(blogApi, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
    })
        .then(res => res.json())
        .then(() => {
            toastGoster('Bloq əlavə edildi')
            blogModal.classList.remove('show')
            getBlogs()
        })
}

function updateBlog() {
    let id = document.getElementById('itemid').value
    let imageFile = sekilFileGetir('imageFile')
    let imageUrl = sekilUrlGetir('imageUrl')
    let currentImage = sekilDataGetir('imageFile')

    if (imageUrl !== '') {
        updateBlogWithUrl(id)
        return
    }

    if (imageFile) {
        updateBlogWithFile(id)
        return
    }

    updateBlogWithCurrentImage(id, currentImage)
}

function updateBlogWithUrl(id) {
    let yenilenmisBlog = {
        title: document.getElementById('title').value,
        about: document.getElementById('about').value,
        image: document.getElementById('imageUrl').value.trim()
    }

    fetch(`${blogApi}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(yenilenmisBlog),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
        .then(res => res.json())
        .then(() => {
            toastGoster('Bloq yeniləndi')
            blogModal.classList.remove('show')
            getBlogs()
        })
}

function updateBlogWithFile(id) {
    let imageFile = sekilFileGetir('imageFile')
    let formData = new FormData()

    formData.append('title', document.getElementById('title').value)
    formData.append('about', document.getElementById('about').value)
    formData.append('image', imageFile)

    fetch(`${blogApi}/${id}`, {
        method: 'PUT',
        headers: { Accept: 'application/json' },
        body: formData
    })
        .then(res => res.json())
        .then(() => {
            toastGoster('Bloq yeniləndi')
            blogModal.classList.remove('show')
            getBlogs()
        })
}

function updateBlogWithCurrentImage(id, currentImage) {
    let yenilenmisBlog = {
        title: document.getElementById('title').value,
        about: document.getElementById('about').value,
        image: currentImage || ''
    }

    fetch(`${blogApi}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(yenilenmisBlog),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
        .then(res => res.json())
        .then(() => {
            toastGoster('Bloq yeniləndi')
            blogModal.classList.remove('show')
            getBlogs()
        })
}

function deleteBlog(id) {
    fetch(`${blogApi}/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => {
            getBlogs()
        })
}

blogForm.addEventListener('submit', function (event) {
    event.preventDefault()

    if (document.getElementById('itemid').value === '') {
        createBlog()
    } else {
        updateBlog()
    }
})

blogAddButton.addEventListener('click', openBlogModal)
blogApiButton.addEventListener('click', function () {
    apiModalGoster('Bloq API', blogApi)
})
document.getElementById('closeModalButton').addEventListener('click', function () { blogModal.classList.remove('show') })
document.getElementById('cancelModalButton').addEventListener('click', function () { blogModal.classList.remove('show') })
blogModal.addEventListener('click', function (event) {
    if (event.target === blogModal) {
        blogModal.classList.remove('show')
    }
})

getBlogs()
