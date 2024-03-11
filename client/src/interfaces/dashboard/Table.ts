import { IButton } from "./Button";
import { IMapDTO } from "./MapModel";

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
    data: IMapDTO[]
    getData: () => void
};