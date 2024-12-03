import { Dashboard } from "./components/dashboard.js";
import { FreelancersList } from "./components/freelancers/freelancers-list.js";
import { Login } from "./components/auth/login.js";
import { Logout } from "./components/auth/logout.js";
import { Signup } from "./components/auth/signup.js";
import { FileUtils } from "./utils/file-utils.js";
import { FreelancesView } from "./components/freelancers/freelancers-view.js";
import { FreelancesCreate } from "./components/freelancers/freelancers-create.js";
import { FreelancesEdit } from "./components/freelancers/freelancers-edit.js";
import { FreelancesDelete } from "./components/freelancers/freelancers-delete.js";
import { OrdersList } from "./components/orders/orders-list.js";
import { OrdersView } from "./components/orders/orders-view.js";
import { OrdersCreate } from "./components/orders/orders-create.js";
import { OrdersEdit } from "./components/orders/orders-edit.js";
import { OrdersDelete } from "./components/orders/orders-delete.js";
import { AuthUtils } from "./utils/auth-utils.js";

export class Router {
    constructor() {
        this.initEvents();

        this.userName = null;

        this.titleElement = document.getElementById('page-title');
        this.stylesElement = document.getElementById('style');
        this.contentElement = document.getElementById('content');
        this.adminLteStyleElement = document.getElementById('admin-lte_style');

        this.routes = [
            {
                route: '/',
                title: 'Дашборд',
                template: '/templates/pages/dashboard.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new Dashboard(this.openNewRoute.bind(this));
                },
                styles: [
                    'fullcalendar.css'
                ],
                scripts: [
                    'moment.min.js',
                    'moment-ru-locale.js',
                    'fullcalendar.js',
                    'fullcalendar-locale-ru.js'
                ]
            },
            {
                route: '/404',
                title: 'Страница не найдена',
                template: '/templates/pages/404.html',
                useLayout: false,
                load: () => {

                }
            },
            {
                route: '/login',
                title: 'Авторизация',
                template: '/templates/pages/auth/login.html',
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
                template: '/templates/pages/auth/signup.html',
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
                route: '/freelancers',
                title: 'Фрилансеры',
                template: '/templates/pages/freelancers/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new FreelancersList(this.openNewRoute.bind(this));
                },
                styles: [
                    'dataTables.bootstrap4.min.css',
                    'responsive.bootstrap4.min.css',
                ],
                scripts: [
                    'jquery.dataTables.min.js',
                    'dataTables.bootstrap4.min.js'
                ]
            },
            {
                route: '/freelancers/view',
                title: 'Фрилансер',
                template: '/templates/pages/freelancers/view.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new FreelancesView(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/freelancers/create',
                title: 'Создание фрилансера',
                template: '/templates/pages/freelancers/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new FreelancesCreate(this.openNewRoute.bind(this));
                },
                scripts: [
                    'bs-custom-file-input.min.js'
                ]
            },
            {
                route: '/freelancers/edit',
                title: 'Редактирование фрилансера',
                template: '/templates/pages/freelancers/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new FreelancesEdit(this.openNewRoute.bind(this));
                },
                scripts: [
                    'bs-custom-file-input.min.js'
                ]
            },
            {
                route: '/freelancers/delete',
                load: () => {
                    new FreelancesDelete(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/orders',
                title: 'Заказы',
                template: '/templates/pages/orders/list.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OrdersList(this.openNewRoute.bind(this));
                },
                styles: [
                    'dataTables.bootstrap4.min.css',
                    'responsive.bootstrap4.min.css',
                ],
                scripts: [
                    'jquery.dataTables.min.js',
                    'dataTables.bootstrap4.min.js'
                ]
            },
            {
                route: '/orders/view',
                title: 'Заказ',
                template: '/templates/pages/orders/view.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OrdersView(this.openNewRoute.bind(this));
                }
            },
            {
                route: '/orders/create',
                title: 'Создание заказа',
                template: '/templates/pages/orders/create.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OrdersCreate(this.openNewRoute.bind(this));
                },
                styles: [
                    'tempusdominus-bootstrap-4.min.css',
                    'select2.min.css',
                    'select2-bootstrap4.min.css'
                ],
                scripts: [
                    'moment.min.js',
                    'tempusdominus-bootstrap-4.min.js',
                    'moment-ru-locale.js',
                    'select2.full.min.js'
                ]
            },
            {
                route: '/orders/edit',
                title: 'Редактирование заказа',
                template: '/templates/pages/orders/edit.html',
                useLayout: '/templates/layout.html',
                load: () => {
                    new OrdersEdit(this.openNewRoute.bind(this));
                },
                styles: [
                    'tempusdominus-bootstrap-4.min.css',
                    'select2.min.css',
                    'select2-bootstrap4.min.css'
                ],
                scripts: [
                    'moment.min.js',
                    'tempusdominus-bootstrap-4.min.js',
                    'moment-ru-locale.js',
                    'select2.full.min.js'
                ]
            },
            {
                route: '/orders/delete',
                load: () => {
                    new OrdersDelete(this.openNewRoute.bind(this));
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

            const currentRoute = window.location.pathname;
            const url = element.href.replace(window.location.origin, '');
            if (!url || (currentRoute === url.replace('#', '')) || url.startsWith('javascript:void(0)')) {
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

            if (currentRoute.scripts && currentRoute.scripts.length > 0) {
                currentRoute.scripts.forEach(item => {
                    document.querySelector(`script[src='/js/${item}']`).remove();
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
                FileUtils.loadPageStyle('/css/' + item, this.adminLteStyleElement);
            });
        }

        if (newRoute.scripts && newRoute.scripts.length > 0) {
            for (const script of newRoute.scripts) {
                await FileUtils.loadPageScript('/js/' + script);
            }
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

                this.profileNameElement = document.getElementById('profileName')
                if(!this.userName){
                    let userInfo = AuthUtils.getAuthInfo(AuthUtils.userInfoTokenKey);
                    if(userInfo){
                        userInfo = JSON.parse(userInfo);
                        if(userInfo.name){
                            this.userName = userInfo.name;
                        }
                    }
                }
                this.profileNameElement.innerText = this.userName;
               
                this.activateMenuItem(newRoute);
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

    activateMenuItem(route) {
        document.querySelectorAll('.sidebar .nav-link').forEach(item => {
            const href = item.getAttribute('href');
            if ((route.route.includes(href) && href !== '/') || (route.route === '/' && href === '/')) {
                item.classList.add('active');
            }else{
                item.classList.remove('active');
            }
        });
    }
}