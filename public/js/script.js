const currentPage = window.location.pathname
const menus = document.querySelectorAll('nav.menuBar .menu a')

for (menu of menus) {
    if(currentPage.includes(menu.getAttribute('href')))
        menu.classList.add('active')
}

// FOR RECIPE PAGE
const recipeParts = document.querySelectorAll('.recipe-part')

for (let recipePart of recipeParts) {
    recipePart.querySelector('.text-title a').addEventListener('click', function() {
        recipePart.querySelector('.recipe-part-content').classList.toggle('hide')
        if(this.innerHTML === 'ESCONDER')
            this.innerHTML = 'MOSTRAR'
        else
            this.innerHTML = 'ESCONDER'

    })
}