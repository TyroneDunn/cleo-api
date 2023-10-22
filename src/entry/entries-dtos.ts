import {OrderOption} from "../utils/order-option";
import {EntrySortOption} from "./entry";

export type GetEntryDTO = {
    id: string,
};

export type GetEntriesDTO = {
    body?: string,
    bodyRegex?: string,
    journal?: string,
    startDate?: string,
    endDate?: string,
    sort?: EntrySortOption,
    order?: OrderOption,
    page?: number,
    limit?: number,
};

export type CreateEntryDTO = {
    journal: string,
    body: string,
};

export type UpdateEntryDTO = {
    id: string,
    body?: string,
    journal?: string,
};

export type DeleteEntryDTO = {
    id: string,
};
