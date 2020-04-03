// FOR INDEX AND RECIPES PAGES
const recipes = document.querySelectorAll('.recipes .recipe')

for (let i = 0; i < recipes.length; i++) {
    recipes[i].querySelector('a').addEventListener('click', function(event) {
        event.preventDefault()
        window.location.href = `/recipe/${i}`
    })
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