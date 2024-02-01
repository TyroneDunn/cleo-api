import {OrderOption} from "../utils/order-option";
import {JournalSortOption} from "./journals.types";

export type GetJournalDTO = {id: string};

export type GetJournalsDTO = {
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

export type CreateJournalDTO = {
    author: string,
    name: string,
};

export type UpdateJournalDTO = {
    id: string,
    name?: string,
};

export type DeleteJournalDTO = {
    id: string,
};

export type DeleteJournalsDTO = {
    name?: string,
    nameRegex?: string,
    author?: string,
    authorRegex?: string,
    startDate?: string,
    endDate?: string,
};