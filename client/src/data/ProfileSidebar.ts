export const adminSidebarData = (id: string) => ([
  {
    label: 'Users',
    url: '/admin/users',
  },
  {
    label: 'Maps',
    url: '/admin/maps',
  },
  {
    label: 'Profile',
    url: '/admin/profile/' + id,
  },
  {
    label: 'Logout',
    url: '/logout',
  },
])

export const userSidebarData = (id:string) => ([
  {
    label: 'Maps',
    url: '/user/maps',
  },
  {
    label: 'Profile',
    url: '/user/profile/' + id,
  },
  {
    label: 'Logout',
    url: '/logout',
  },
])
