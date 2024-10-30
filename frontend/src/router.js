export class Router{
    constructor(){
        this.initEvents();

        this.titleElement = document.getElementById('page-title');
        this.stylesElement = document.getElementById('style');
        this.contentElement = document.getElementById('contant');

        this.routes= [
            {
                route: '/',
                title: 'Дашборд',
                template: 'html',
                styles: 'css',
                load: () => {

                }
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                template: 'html',
                styles: 'css',
                load: () => {

                }
            }
        ]
    }

    initEvents(){
        window.addEventListener('DOMContentLoaded', this.openRoute.bind(this));
        window.addEventListener('popstate', this.openRoute.bind(this));
    }

    async openRoute(){
        const url = window.location.pathname;
        
        const newRoute = find.this.routes(item => item.route === url);

        if(!newRoute){
            window.location = '/404';
            return;
        }

        if(this.titleElement){
            this.titleElement.innerText = newRoute.title;
        }

        if(this.stylesElement){
            this.stylesElement.setAttribute('href', newRoute.styles);
        }

        if(this.contentElement){
            this.contentElement = await fetch(newRoute.template).then(responce => responce.text());
        }

        
       
        
        newRoute.load();
    }
}