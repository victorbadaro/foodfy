// const currentPage = window.location.pathname
// const recipes = document.querySelectorAll('.recipes .recipe')

// for (let i = 0; i < recipes.length; i++) {
//     recipes[i].querySelector('a.recipe-link').addEventListener('click', function(event) {
//         event.preventDefault()
//         window.location.href = `/admin/recipes/${i}`
//     })
// }

// const recipeParts = document.querySelectorAll('.recipe-part')

// for (let recipePart of recipeParts) {
//     recipePart.querySelector('.text-title a').addEventListener('click', function() {
//         recipePart.querySelector('.recipe-part-content').classList.toggle('hide')
//         if(this.innerHTML === 'ESCONDER')
//             this.innerHTML = 'MOSTRAR'
//         else
//             this.innerHTML = 'ESCONDER'

//     })
// }

const redirectButton = document.querySelector('.header button.redirect')

if (redirectButton) {
    redirectButton.addEventListener('click', function() {
        window.location.href = `${currentPage}/edit`
    })
}

const addIngredient = document.querySelector('a#add-ingredient')
const addStep = document.querySelector('a#add-step')

if(addIngredient) {
    addIngredient.addEventListener('click', function(event) {
        event.preventDefault()

        const ingredients = document.querySelector('.ingredients')
        const newIngredient = document.createElement('input')
    
        newIngredient.setAttribute('type','text')
        newIngredient.setAttribute('name','ingredients[]')
        newIngredient.required = true
    
        ingredients.appendChild(newIngredient)
    })
}

if(addStep) {
    addStep.addEventListener('click', function(event) {
        event.preventDefault()

        const preparationList = document.querySelector('.preparation')
        const newPreparationStep = document.createElement('input')
    
        newPreparationStep.setAttribute('type','text')
        newPreparationStep.setAttribute('name','preparation[]')
        newPreparationStep.required = true
    
        preparationList.appendChild(newPreparationStep)
    })
}

const deleteButton = document.querySelector('.header button[type=button]')

if(deleteButton) {
    deleteButton.addEventListener('click', function() {
        const formDelete = document.querySelector('form#form-delete')
        formDelete.submit()
    })
}