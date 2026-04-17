let contactList = []
let contactTableBody = document.getElementById('tableBody')
let contactTableHead = document.getElementById('tableHead')
let contactModal = document.getElementById('modal')
let contactForm = document.getElementById('modalForm')
let contactAddButton = document.getElementById('addButton')
let contactApiButton = document.getElementById('apiButton')
let contactApi = 'https://69b9b40db3dcf7e0b4bb0212.mockapi.io/contack-us'

document.getElementById('pageTitle').innerHTML = 'Əlaqə mesajları'
document.getElementById('heroTitle').innerHTML = 'Əlaqə idarəetməsi'
document.getElementById('heroSubtitle').innerHTML = ''

contactTableHead.innerHTML = `<tr><th>Göndərən</th><th>Mesaj</th><th>Əməliyyat</th></tr>`

document.getElementById('modalFields').innerHTML = `
    <input type="hidden" id="itemid">
    <div class="field-group"><label>Ad</label><input type="text" id="name"></div>
    <div class="field-group"><label>Email</label><input type="email" id="email"></div>
    <div class="field-group full"><label>Mesaj</label><textarea id="message"></textarea></div>
`

function getContacts() {
    fetch(contactApi)
        .then(res => res.json())
        .then(res => {
            contactList = res
            renderContacts()
        })
}

function renderContacts() {
    contactTableBody.innerHTML = ''

    if (contactList.length === 0) {
        contactTableBody.innerHTML = `<tr><td colspan="3"><div class="empty-state"><h3>Məlumat yoxdur</h3><p>Hələ mesaj yoxdur.</p></div></td></tr>`
        return
    }

    contactList.map(item =>
        contactTableBody.innerHTML += `
            <tr>
                <td><strong>${item.name || '-'}</strong><span class="table-subtext">${item.email || '-'}</span></td>
                <td><p class="table-text">${qisaYazi(item.message)}</p></td>
                <td><div class="table-actions"><button class="icon-button edit-button" data-id="${item.id}" data-type="edit">&#9998;</button><button class="icon-button" data-id="${item.id}" data-type="delete">&#128465;</button></div></td>
            </tr>
        `
    )

    document.querySelectorAll('[data-type="edit"]').forEach(function (button) {
        button.addEventListener('click', function () {
            editContact(button.getAttribute('data-id'))
        })
    })

    document.querySelectorAll('[data-type="delete"]').forEach(function (button) {
        button.addEventListener('click', function () {
            deleteContact(button.getAttribute('data-id'))
        })
    })
}

function openContactModal() {
    document.getElementById('itemid').value = ''
    document.getElementById('modalTitle').innerHTML = 'Yeni mesaj'
    document.getElementById('modalSubtitle').innerHTML = 'Yeni məlumat əlavə et'
    contactForm.reset()
    contactModal.classList.add('show')
}

function editContact(id) {
    fetch(`${contactApi}/${id}`)
        .then(res => res.json())
        .then(data => {
            document.getElementById('itemid').value = data.id
            document.getElementById('name').value = data.name || ''
            document.getElementById('email').value = data.email || ''
            document.getElementById('message').value = data.message || ''
            document.getElementById('modalTitle').innerHTML = 'Mesajı düzəlt'
            document.getElementById('modalSubtitle').innerHTML = 'Dəyişiklik et və yadda saxla'
            contactModal.classList.add('show')
        })
}

function createContact() {
    let yeniData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    }

    fetch(contactApi, {
        method: 'POST',
        body: JSON.stringify(yeniData),
        headers: { 'Content-type': 'application/json; charset=UTF-8' }
    })
        .then(res => {
            if (res.ok) {
                toastGoster('Mesaj əlavə edildi')
                contactModal.classList.remove('show')
                getContacts()
            }
        })
}

function updateContact() {
    let id = document.getElementById('itemid').value
    let editData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        message: document.getElementById('message').value
    }

    fetch(`${contactApi}/${id}`, {
        method: 'PUT',
        headers: { 'Content-type': 'application/json' },
        body: JSON.stringify(editData)
    })
        .then(res => {
            if (res.ok) {
                toastGoster('Mesaj yeniləndi')
                contactModal.classList.remove('show')
                getContacts()
            }
        })
}

function deleteContact(id) {
    fetch(`${contactApi}/${id}`, { method: 'DELETE' })
        .then(res => res.json())
        .then(() => {
            getContacts()
        })
}

contactForm.addEventListener('submit', function (event) {
    event.preventDefault()

    if (document.getElementById('itemid').value === '') {
        createContact()
    } else {
        updateContact()
    }
})

contactAddButton.addEventListener('click', openContactModal)
contactApiButton.addEventListener('click', function () {
    apiModalGoster('Əlaqə API', contactApi)
})
document.getElementById('closeModalButton').addEventListener('click', function () { contactModal.classList.remove('show') })
document.getElementById('cancelModalButton').addEventListener('click', function () { contactModal.classList.remove('show') })
contactModal.addEventListener('click', function (event) {
    if (event.target === contactModal) {
        contactModal.classList.remove('show')
    }
})

getContacts()
