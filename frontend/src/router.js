import { Dashboard } from "./components/dashboard.js";
import { Login } from "./components/login.js";
import { Signup } from "./components/signup.js";

export class Router {
    constructor() {
        this.initEvents();

        this.titleElement = document.getElementById('page-title');
        this.stylesElement = document.getElementById('style');
        this.contentElement = document.getElementById('content');
        this.adminLteStyleElement = document.getElementById('admin-lte_style');

        this.routes = [
            {
                route: '/',
                title: 'Дашборд',
                template: './templates/index.html',
                useLayout: './templates/layout.html',
                load: () => {
                    new Dashboard();
                }
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                template: './templates/404.html',
                useLayout: false,
                load: () => {

                }
            },
            {
                route: '/login',
                title: 'Авторизация',
                template: './templates/login.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('login-page');
                    document.body.style.height = '100vh';
                    new Login();
                },
                styles: [
                    'icheck-bootstrap.min.css'
                ]
            },
            {
                route: '/signup',
                title: 'Регистрация',
                template: './templates/signup.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('register-page');
                    document.body.style.height = '100vh';
                    
                    new Signup();
                },
                styles: [
                    'icheck-bootstrap.min.css'
                ]
            }
        ]
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.openRoute.bind(this));
        window.addEventListener('popstate', this.openRoute.bind(this));
    }

    async openRoute() {
        const url = window.location.pathname;

        const newRoute = this.routes.find(item => item.route === url);

        if (!newRoute) {
            window.location = '/404';
            return;
        }

        if (newRoute.styles && newRoute.styles.length > 0) {

            newRoute.styles.forEach(item => {
                const link = document.createElement('link');
                link.rel = 'stylesheet';
                link.href = '/css/' + item;
                document.head.insertBefore(link, this.adminLteStyleElement);
            });
        }

        if (newRoute.title) {
            this.titleElement.innerText = newRoute.title;
        }

        if (newRoute.template) {
            document.body.classNmse = '';
            let contentBlock = this.contentElement;

            if (newRoute.useLayout) {
                this.contentElement.innerHTML = await fetch(newRoute.useLayout).then(responce => responce.text());
                contentBlock = document.getElementById('content-layout');
                document.body.classList.add('sidebar-mini');
                document.body.classList.add('sidebar-fixed');
            } else {
                document.body.classList.remove('sidebar-mini');
                document.body.classList.remove('sidebar-fixed');
            }

            contentBlock.innerHTML = await fetch(newRoute.template).then(responce => responce.text());
        }

        if (newRoute.load && typeof newRoute.load === 'function') {
            newRoute.load();
        }
    }
}