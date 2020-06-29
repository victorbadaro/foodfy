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

// PAGINATION
const pagination = document.querySelector('.pagination')

if(pagination)
    createPagination(pagination)

function createPagination(pagination) {
    const selectedPage = +pagination.dataset.page
    const total = +pagination.dataset.total
    const filter = pagination.dataset.filter
    const pages = paginate(selectedPage, total)

    for(let page of pages) {
        if(String(page).includes('...')) {
            const spanElement = document.createElement('span')

            spanElement.innerHTML = page
            pagination.appendChild(spanElement)
        } else {
            const linkElement = document.createElement('a')

            if(filter)
                linkElement.href = `?page=${page}&filter=${filter}`
            else
                linkElement.href = `?page=${page}`

            if(page == selectedPage)
                linkElement.classList.add('selectedPage')

            linkElement.innerHTML = page

            pagination.appendChild(linkElement)
        }
    }
}

function paginate(selectedPage, totalPages) {
    let pages = [],
        oldPage
    
    for(let page = 1; page <= totalPages; page++) {
        const firstOrLastPage = page == 1 || page == totalPages
        const pagesBeforeSelectedPage = page >= selectedPage - 2
        const pagesAfterSelectedPage = page <= selectedPage + 2

        if(firstOrLastPage || pagesBeforeSelectedPage && pagesAfterSelectedPage) {
            if(oldPage && page - oldPage > 2)
                pages.push('...')
            
            if(oldPage && page - oldPage == 2)
                pages.push(oldPage + 1)
            
            pages.push(page)
            oldPage = page
        }
    }

    return pages
}

// IMAGES UPLOAD
const ImagesUpload = {
    input: '',
    uploadLimit: 5,
    imagesContainer: document.querySelector('.images-container'),
    files: [],
    handleFiles(event) {
        const { files } = event.target
        ImagesUpload.input = event.target

        if(ImagesUpload.hasLimit(event))
            return
        
        for(let file of files) {
            const reader = new FileReader()

            ImagesUpload.files.push(file)

            reader.readAsDataURL(file)
            reader.onload = () => {
                const imageContainer = document.createElement('div')
                const imageElement = new Image()
                const iconElement = document.createElement('i')

                imageElement.src = String(reader.result)
                imageElement.alt = file.name

                iconElement.classList.add('material-icons')
                iconElement.innerHTML = 'close'

                imageContainer.classList.add('image')
                imageContainer.addEventListener('click', ImagesUpload.removeFile)
                imageContainer.appendChild(imageElement)
                imageContainer.appendChild(iconElement)

                ImagesUpload.imagesContainer.appendChild(imageContainer)
            }
        }

        ImagesUpload.input.files = ImagesUpload.getAllFiles()
    },
    hasLimit(event) {
        const { input, uploadLimit, imagesContainer } = ImagesUpload
        const { files } = input
        const imagesUploaded = []

        if(files.length > uploadLimit) {
            event.preventDefault()

            alert(`Envie no máximo ${uploadLimit} imagens`)
            ImagesUpload.input.files = ImagesUpload.getAllFiles()
            return true
        }

        imagesContainer.childNodes.forEach(imageContainer => {
            if(imageContainer.classList && imageContainer.classList == 'image')
                imagesUploaded.push(imageContainer)
        })

        if(files.length + imagesUploaded.length > uploadLimit) {
            event.preventDefault()

            alert('Você atingiu o limite máximo de envio')
            ImagesUpload.input.files = ImagesUpload.getAllFiles()
            return true
        }

        return false
    },
    getAllFiles() {
        const dataTransfer = new ClipboardEvent('').clipboardData || new DataTransfer()

        ImagesUpload.files.forEach(file => dataTransfer.items.add(file))
        return dataTransfer.files
    },
    removeFile(event) {
        const imageContainer = event.target.parentNode
        const { imagesContainer } = ImagesUpload
        const imagesContainerArray = []
        
        imagesContainer.childNodes.forEach(imageContainer => {
            if(imageContainer.classList && imageContainer.classList == 'image')
                imagesContainerArray.push(imageContainer)
        })

        ImagesUpload.files.splice(imagesContainerArray.indexOf(imageContainer), 1)
        ImagesUpload.input.files = ImagesUpload.getAllFiles()
        imageContainer.remove()
    }
}

// IMAGES GALLERY
const ImagesGallery = {
    previews: document.querySelectorAll('.gallery .previews img'),
    highlight: document.querySelector('.gallery .highlight'),
    setImage(event) {
        const { target } = event

        ImagesGallery.previews.forEach(preview => preview.classList.remove('active'))
        target.classList.add('active')

        ImagesGallery.highlight.style.backgroundImage = `url('${target.src}')`
    }
}