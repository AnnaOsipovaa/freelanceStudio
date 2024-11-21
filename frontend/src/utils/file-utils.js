export class FileUtils {
    static loadPageScript(src) {
        return new Promise((res, rej) => {
            const scripts = document.createElement('script');
            scripts.src = src;
            scripts.onload = () => res('Script loaded: ' + src);
            scripts.onerror = () => rej(new Error('Script load error for: ' + src));
            document.body.appendChild(scripts);
        })
    }

    static loadPageStyle(src, insertBeforeElement) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.type = 'text/css';
        link.href = src;
        document.head.insertBefore(link, insertBeforeElement);
    }

    static convertFileToBase64(file) {
        return new Promise((res, rej) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => res(reader.result);
            reader.onerror = (error) => rej('Error: ' + error);
        });
    }
}