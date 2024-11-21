export class FreelancesEdit{
    constructor(openNewRoute) {
        this.openNewRoute = openNewRoute;

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (!id) {
            return this.openNewRoute('/');
        }

        //document.getElementById('edit-link').href = '/freelancers/edit?id=' + id;
        //document.getElementById('delete-link').href = '/freelancers/delete?id=' + id;

        //this.getFreelancer(id);
    }
}