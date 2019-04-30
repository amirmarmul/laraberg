import { elementReadyRAF, elementRendered } from '../lib/element-ready';

export default async function setupLaravelMediable() {
    elementRendered('.editor-media-placeholder', (mediaEditor) => {
        const mediableButton = document.createElement('button')
        mediableButton.innerHTML = 'Media Library'
        mediableButton.classList.add('components-button', 'editor-media-placeholder__button', 'is-button', 'is-default', 'is-large')
        mediableButton.type = 'button'
        mediableButton.addEventListener('click', mediableListener)
        const fileUpload = mediaEditor.querySelector('.components-form-file-upload')
        fileUpload.parentNode.insertBefore(mediableButton, fileUpload.nextSibling)
    })
}

function mediableListener(event) {
    const block = event.target.parentNode.parentNode.parentNode

    openMediable(block);
}

function openMediable(block) {
    let modal = App.loadModal('full', 'none');
    let title = modal.find('.modal-title');
    let body = modal.find('.modal-body');

    title.text('Media Library');

    App.ajax('/manage/media/image-picker', 'GET', 'text/html', null)
        .then(results => {
            body.html(results);
            Media.imagePicker();
        });

    modal.on('click', '.media-choose', function () {
        let element = $(this);
        let url = element.data('url');
        let id = element.data('id');
        
        insertMedia(block, url);
        modal.modal('hide');
    });
}

async function insertMedia(block, url) {
    const urlButton = block.querySelector('.editor-media-placeholder__url-input-container').querySelector('button')
    urlButton.click()
    const formSelector = '.editor-media-placeholder__url-input-form'
    await elementReadyRAF(formSelector)
    const urlForm = document.querySelector(formSelector)
    const urlInput = urlForm.querySelector('input')
    urlInput.value = url
    // For some reason we can not click() the submitButton
    // if we do not add a space and fire the change event on the input
    urlInput.value += ' '
    fireEvent(urlInput, 'change')
    const submitButton = urlForm.querySelector('button')
    submitButton.click()
}

function fireEvent(el, etype) {
    if (el.fireEvent) {
        el.fireEvent('on' + etype)
    } else {
        const evObj = document.createEvent('Events')
        evObj.initEvent(etype, true, false)
        el.dispatchEvent(evObj)
    }
}
