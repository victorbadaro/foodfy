const forms = document.querySelectorAll('form.delete-form')

forms.forEach(form => {
    form.addEventListener('submit', event => {
        const confirmation = confirm('Tem certeza que deseja deletar? Esta ação não poderá ser desfeita.')

        if(!confirmation)
            event.preventDefault()
    })
})