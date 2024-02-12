import { UserRole } from "../interfaces/User"

const routes = {
    home: '/',
    about: '/about',
    login: '/login',
    register: '/register',
    forgottenPasword: '/forgotten-password',
    restorePassword: '/restore-password',
    notFound: '/404',
    forbidden: '/403',
    mapPreview: (_id: string = '') => `/map-model/${_id}`,
    dashboard: {
        editMapModel: (_role: UserRole, _id: string = '') => `/${_role.toString()}/map-model/${_id}`,
        editMap: (_role: UserRole, _id: string = '') => `/${_role.toString()}/map/${_id}`,
        newMap: (_role: UserRole) => `/${_role.toString()}/map/new`,
        maps: (_role: UserRole) => `/${_role.toString()}/maps`,
        profile: (_role: UserRole) => `/${_role.toString()}/profile`,
    },
    admin: {
        users: '/admin/users',
    }
}

export default routes