import { elements } from './base';

export const renderFileLength = (files, zero) => {
    const elem = document.querySelector('.download-info__field');
    zero ? elem.textContent = `0 files selected` : elem.textContent = `${files.length} files selected`;
}