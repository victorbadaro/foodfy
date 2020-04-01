const recipes = document.querySelectorAll('.recipes .recipe')
const modal = document.querySelector('.modal')
const closeModalButton = modal.querySelector('.modal-footer a')

for (let recipe of recipes) {
    recipe.querySelector('a').addEventListener('click', function() {
        modal.querySelector('.recipe-img').setAttribute('style',`background-image: url("${recipe.querySelector('.recipe-img').getAttribute('src')}")`)
        modal.querySelector('.recipe-title').innerHTML = recipe.querySelector('.recipe-title').innerHTML
        modal.querySelector('.recipe-author').innerHTML = recipe.querySelector('.recipe-author').innerHTML
        
        modal.classList.toggle('hide')
    })
}

closeModalButton.addEventListener('click', function() {
    modal.classList.toggle('hide')
})