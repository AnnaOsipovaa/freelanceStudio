import { Dashboard } from "./components/dashboard.js";
import { Login } from "./components/login.js";
import { Signup } from "./components/signup.js";

export class Router{
    constructor(){
        this.initEvents();

        this.titleElement = document.getElementById('page-title');
        this.stylesElement = document.getElementById('style');
        this.contentElement = document.getElementById('content');

        this.routes = [
            {
                route: '/',
                title: 'Дашборд',
                template: './templates/index.html',
                /*styles: 'css',*/
                load: () => {
                    new Dashboard();
                }
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                template: './templates/404.html',
                /*styles: 'css',*/
                load: () => {

                }
            },
            {
                route: '/login',
                title: 'Авторизация',
                template: './templates/login.html',
                /*styles: 'css',*/
                load: () => {
                    new Login();
                }
            },
            {
                route: '/signup',
                title: 'Регистрация',
                template: './templates/signup.html',
                /*styles: 'css',*/
                load: () => {
                    new Signup();
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

        const newRoute = this.routes.find(item => item.route === url);

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
            this.contentElement.innerHTML = await fetch(newRoute.template).then(responce => responce.text());
        }

        if(newRoute.load && typeof newRoute.load === 'function'){
            newRoute.load();
        }
    }
}