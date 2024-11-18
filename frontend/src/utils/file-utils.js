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
}