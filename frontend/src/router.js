import { Dashboard } from "./components/dashboard.js";
import { FreelancesList } from "./components/freelances/freelances-list.js";
import { Login } from "./components/auth/login.js";
import { Logout } from "./components/auth/logout.js";
import { Signup } from "./components/auth/signup.js";

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
                template: './templates/pages/dashboard.html',
                useLayout: './templates/layout.html',
                load: () => {
                    new Dashboard();
                }
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                template: './templates/pages/404.html',
                useLayout: false,
                load: () => {

                }
            },
            {
                route: '/login',
                title: 'Авторизация',
                template: './templates/pages/auth/login.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('login-page');
                    document.body.style.height = '100vh';
                    new Login(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('login-page');
                    document.body.style.height = 'auto';
                },
                styles: [
                    'icheck-bootstrap.min.css'
                ]
            },
            {
                route: '/signup',
                title: 'Регистрация',
                template: './templates/pages/auth/signup.html',
                useLayout: false,
                load: () => {
                    document.body.classList.add('register-page');
                    document.body.style.height = '100vh';

                    new Signup(this.openNewRoute.bind(this));
                },
                unload: () => {
                    document.body.classList.remove('register-page');
                    document.body.style.height = 'auto';
                },
                styles: [
                    'icheck-bootstrap.min.css'
                ]
            },
            {
                route: '/logout',
                load: () => {
                    new Logout(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/freelances',
                title: 'Фрилансеры',
                template: './templates/pages/freelances/list.html',
                useLayout: './templates/layout.html',
                load: () => {
                    new FreelancesList(this.openNewRoute.bind(this));
                }
            }
        ]
    }

    initEvents() {
        window.addEventListener('DOMContentLoaded', this.activateRoute.bind(this));
        window.addEventListener('popstate', this.activateRoute.bind(this));
        document.addEventListener('click', this.clickHandler.bind(this));
    }

    async clickHandler(e) {
        let element = null;
        if (e.target.nodeName === 'A') {
            element = e.target;
        } else {
            if (e.target.parentNode.nodeName === 'A') {
                element = e.target.parentNode;
            }
        }

        if (element) {
            e.preventDefault();

            const url = element.href.replace(window.location.origin, '');
            if (!url || url === '/#' || url.startsWith('javascript:void(0)')) {
                return;
            }

            await this.openNewRoute(url);
        }
    }

    async openNewRoute(url) {
        const currentRoute = window.location.pathname;
        history.pushState({}, '', url);
        await this.activateRoute(null, currentRoute);
    }

    async activateRoute(e, oldRoute = null) {
        if (oldRoute) {
            const currentRoute = this.routes.find(item => item.route === oldRoute);

            if (currentRoute.styles && currentRoute.styles.length > 0) {

                currentRoute.styles.forEach(item => {
                    document.querySelector(`link[href='/css/${item}']`).remove();
                });
            }

            if (currentRoute.unload && typeof currentRoute.unload === 'function') {
                currentRoute.unload();
            }
        }

        const url = window.location.pathname;
        const newRoute = this.routes.find(item => item.route === url);

        if (!newRoute) {
            history.pushState({}, '', '/404');
            await this.activateRoute();
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