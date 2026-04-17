let teamList = []
let teamTableBody = document.getElementById('tableBody')
let teamTableHead = document.getElementById('tableHead')
let teamModal = document.getElementById('modal')
let teamForm = document.getElementById('modalForm')
let teamAddButton = document.getElementById('addButton')
let teamApiButton = document.getElementById('apiButton')
let teamApi = 'https://69e0c69c29c070e6597c00f2.mockapi.io/bizmax/Team'

document.getElementById('pageTitle').innerHTML = 'Komanda'
document.getElementById('heroTitle').innerHTML = 'Komanda idarəetməsi'
document.getElementById('heroSubtitle').innerHTML = ''

teamTableHead.innerHTML = `<tr><th>ID</th><th>Ad</th><th>Şəkil</th><th>Vəzifə</th><th>Əməliyyat</th></tr>`

document.getElementById('modalFields').innerHTML = `
    <input type="hidden" id="itemid">
    <div class="field-group"><label>Ad</label><input type="text" id="name"></div>
    <div class="field-group"><label>Job</label><input type="text" id="job"></div>
    <div class="field-group full"><label>Şəkil URL</label><input type="text" id="imageUrl" placeholder="https://example.com/image.jpg"></div>
    <div class="field-group full"><label>Şəkil file</label><div class="upload-box"><input type="file" id="imageFile" accept="image/*"><p class="upload-note">URL yaz və ya şəkli file olaraq seç.</p><img class="upload-preview hidden" id="imagePreview" alt="preview"></div></div>
`

sekilSec('imageFile', 'imagePreview', 'imageUrl')

function getTeams() {
    fetch(teamApi)
        .then(res => res.json())
        .then(res => {
            teamList = res
            renderTeams()
        })
}

function renderTeams() {
    teamTableBody.innerHTML = ''

    if (teamList.length === 0) {
        teamTableBody.innerHTML = `<tr><td colspan="5"><div class="empty-state"><h3>Məlumat yoxdur</h3><p>Hələ komanda üzvü əlavə edilməyib.</p></div></td></tr>`
        return
    }

    teamList.map(item =>
        teamTableBody.innerHTML += `
            <tr>
                <td>${item.id || '-'}</td>
                <td><strong>${item.name || '-'}</strong></td>
                <td class="table-image-cell">${item.avatar ? `<img src="${item.avatar}" class="table-image" alt="${item.name || 'team'}">` : '-'}</td>
                <td><span class="table-subtext">${item.job || '-'}</span></td>
                <td><div class="table-actions"><button class="icon-button edit-button" data-id="${item.id}" data-type="edit">&#9998;</button><button class="icon-button" data-id="${item.id}" data-type="delete">&#128465;</button></div></td>
            </tr>
        `
    )

    document.querySelectorAll('[data-type="edit"]').forEach(function (button) {
        button.addEventListener('click', function () {
            editTeam(button.getAttribute('data-id'))
        })
    })

    document.querySelectorAll('[data-type="delete"]').forEach(function (button) {
        button.addEventListener('click', function () {
            deleteTeam(button.getAttribute('data-id'))
        })
    })
}

function openTeamModal() {
    document.getElementById('itemid').value = ''
    document.getElementById('modalTitle').innerHTML = 'Yeni üzv'
    document.getElementById('modalSubtitle').innerHTML = 'Yeni məlumat əlavə et'
    teamForm.reset()
    document.getElementById('imageFile').setAttribute('data-img', '')
    document.getElementById('imageUrl').value = ''
    previewYaz('imagePreview', '')
    teamModal.classList.add('show')
}

function editTeam(id) {
    fetch(`${teamApi}/${id}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('itemid').value = data.id
            document.getElementById('name').value = data.name || ''
            document.getElementById('job').value = data.job || ''
            document.getElementById('imageFile').setAttribute('data-img', data.avatar || '')
            document.getElementById('imageUrl').value = data.avatar || ''
            previewYaz('imagePreview', data.avatar || '')
            document.getElementById('modalTitle').innerHTML = 'Üzvü düzəlt'
            document.getElementById('modalSubtitle').innerHTML = 'Dəyişiklik et və yadda saxla'
            teamModal.classList.add('show')
        })
}

function createTeam() {
    let imageFile = sekilFileGetir('imageFile')
    let imageUrl = sekilUrlGetir('imageUrl')

    if (imageUrl !== '') {
        createTeamWithUrl()
        return
    }

    if (imageFile) {
        createTeamWithFile()
        return
    }

    alert('Şəkil URL yazın və ya file seçin')
}

function createTeamWithUrl() {
    let yeniUzv = {
        name: document.getElementById('name').value,
        job: document.getElementById('job').value,
        avatar: document.getElementById('imageUrl').value.trim()
    }

    fetch(teamApi, {
        method: 'POST',
        body: JSON.stringify(yeniUzv),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
        .then(res => res.json())
        .then(() => {
            toastGoster('Üzv əlavə edildi')
            teamModal.classList.remove('show')
            getTeams()
        })
}

function createTeamWithFile() {
    let imageFile = sekilFileGetir('imageFile')
    let formData = new FormData()

    formData.append('name', document.getElementById('name').value)
    formData.append('job', document.getElementById('job').value)
    formData.append('avatar', imageFile)

    fetch(teamApi, {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' }
    })
        .then(res => res.json())
        .then(() => {
            toastGoster('Üzv əlavə edildi')
            teamModal.classList.remove('show')
            getTeams()
        })
}

function updateTeam() {
    let id = document.getElementById('itemid').value
    let imageFile = sekilFileGetir('imageFile')
    let imageUrl = sekilUrlGetir('imageUrl')
    let currentImage = sekilDataGetir('imageFile')

    if (imageUrl !== '') {
        updateTeamWithUrl(id)
        return
    }

    if (imageFile) {
        updateTeamWithFile(id)
        return
    }

    updateTeamWithCurrentImage(id, currentImage)
}

function updateTeamWithUrl(id) {
    let yenilenmisUzv = {
        name: document.getElementById('name').value,
        job: document.getElementById('job').value,
        avatar: document.getElementById('imageUrl').value.trim()
    }

    fetch(`${teamApi}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(yenilenmisUzv),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
        .then(res => res.json())
        .then(() => {
            toastGoster('Üzv yeniləndi')
            teamModal.classList.remove('show')
            getTeams()
        })
}

function updateTeamWithFile(id) {
    let imageFile = sekilFileGetir('imageFile')
    let formData = new FormData()

    formData.append('name', document.getElementById('name').value)
    formData.append('job', document.getElementById('job').value)
    formData.append('avatar', imageFile)

    fetch(`${teamApi}/${id}`, {
        method: 'PUT',
        headers: { Accept: 'application/json' },
        body: formData
    })
        .then(res => res.json())
        .then(() => {
            toastGoster('Üzv yeniləndi')
            teamModal.classList.remove('show')
            getTeams()
        })
}

function updateTeamWithCurrentImage(id, currentImage) {
    let yenilenmisUzv = {
        name: document.getElementById('name').value,
        job: document.getElementById('job').value,
        avatar: currentImage || ''
    }

    fetch(`${teamApi}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(yenilenmisUzv),
        headers: {
            'Content-type': 'application/json; charset=UTF-8'
        }
    })
        .then(res => res.json())
        .then(() => {
            toastGoster('Üzv yeniləndi')
            teamModal.classList.remove('show')
            getTeams()
        })
}

function deleteTeam(id) {
    fetch(`${teamApi}/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => {
            getTeams()
        })
}

teamForm.addEventListener('submit', function (event) {
    event.preventDefault()

    if (document.getElementById('itemid').value === '') {
        createTeam()
    } else {
        updateTeam()
    }
})

teamAddButton.addEventListener('click', openTeamModal)
teamApiButton.addEventListener('click', function () {
    apiModalGoster('Komanda API', teamApi)
})
document.getElementById('closeModalButton').addEventListener('click', function () { teamModal.classList.remove('show') })
document.getElementById('cancelModalButton').addEventListener('click', function () { teamModal.classList.remove('show') })
teamModal.addEventListener('click', function (event) {
    if (event.target === teamModal) {
        teamModal.classList.remove('show')
    }
})

getTeams()
