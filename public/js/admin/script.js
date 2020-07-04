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

const sendAvatarButton = document.querySelector('input + button.button[type=button]')

if(sendAvatarButton)
    sendAvatarButton.addEventListener('click', function() {
        document.querySelector('input[name=avatar_url]').classList.remove('hide')
    })