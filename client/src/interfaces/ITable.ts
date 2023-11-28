import { IButton } from "./IButton";

export interface ITableConfig {
    heading: string;
    colgroup: number[];
    getItemsRoute?: string;
    newItemRoute?: string;
    newItemRouteLabel?: string;
    thead: string[];
    tbody: string[];
    buttons: IButton[];
};

export interface ITableProps {
    config: ITableConfig;
};