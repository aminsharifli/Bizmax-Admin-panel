let servis = document.getElementById('count_services')
let blog = document.getElementById('count_blog')
let slider = document.getElementById('count_slider')
let testimonial = document.getElementById('count_testimonial')
let team = document.getElementById('count_team')
let contact = document.getElementById('count_contact')

function countGetir() {
    fetch('https://69b9b40db3dcf7e0b4bb0212.mockapi.io/service')
        .then(res => res.json())
        .then(res => servis.innerHTML = res.length)

    fetch('https://69d27d515043d95be971eeff.mockapi.io/login/Blog')
        .then(res => res.json())
        .then(res => blog.innerHTML = res.length)

    fetch('https://69d27d515043d95be971eeff.mockapi.io/login/slider')
        .then(res => res.json())
        .then(res => slider.innerHTML = res.length)

    fetch('https://69e0c69c29c070e6597c00f2.mockapi.io/bizmax/Testimonial')
        .then(res => res.json())
        .then(res => testimonial.innerHTML = res.length)

    fetch('https://69e0c69c29c070e6597c00f2.mockapi.io/bizmax/Team')
        .then(res => res.json())
        .then(res => team.innerHTML = res.length)

    fetch('https://69b9b40db3dcf7e0b4bb0212.mockapi.io/contack-us')
        .then(res => res.json())
        .then(res => contact.innerHTML = res.length)
}

countGetir()
