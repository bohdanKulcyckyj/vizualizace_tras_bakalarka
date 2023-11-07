import { IButton } from "./IButton";

export interface ITableConfig {
    heading: string;
    colgroup: number[];
    newItemRoute?: string;
    newItemRouteLabel?: string;
    thead: string[];
    tbody: string[];
    buttons: IButton[];
};

export interface ITableProps {
    data: any;
    config: ITableConfig;
};