export interface ISidebarLink {
    url: string;
    label: string;
}

export interface ISidebar {
    role: string;
    data?: ISidebarLink[];
}