import {OrderOption} from "../utils/order-option";
import {JournalSortOption} from "./journals.types";

export type GetJournalRequest = {id: string};

export type GetJournalsRequest = {
    name?: string,
    nameRegex?: string,
    author?: string,
    authorRegex?: string,
    startDate?: string,
    endDate?: string,
    sort?: JournalSortOption,
    order?: OrderOption,
    page?: number,
    limit?: number,
};

export type CreateJournalRequest = {
    author: string,
    name: string,
};

export type UpdateJournalRequest = {
    id: string,
    name?: string,
};

export type DeleteJournalRequest = {
    id: string,
};

export type DeleteJournalsRequest = {
    name?: string,
    nameRegex?: string,
    author?: string,
    authorRegex?: string,
    startDate?: string,
    endDate?: string,
};