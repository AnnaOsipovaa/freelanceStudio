const host = 'http://localhost:3000'

const config = {
    host: host,
    api: host + '/api',
    freelancerLevels: {
        junior: 'junior',
        middle: 'middle',
        senior: 'senior',
    },
    ordersLevels: {
        new: 'new',
        confirmed: 'confirmed',
        success: 'success',
        canceled: 'canceled',
    }
}

export default config;