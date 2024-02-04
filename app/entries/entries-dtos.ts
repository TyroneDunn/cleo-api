import {EntrySortOption} from "./entries.types";
import { OrderOption } from '@hals/common';

export type GetEntryDTO = {id: string};

export type GetEntriesDTO = {
    title?: string,
    titleRegex?: string,
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
    title: string,
    body: string,
};

export type UpdateEntryDTO = {
    id: string,
    title?: string,
    body?: string,
    journal?: string,
};

export type DeleteEntryDTO = {id: string};

export type DeleteEntriesDTO = {
    title?: string,
    titleRegex?: string,
    body?: string,
    bodyRegex?: string,
    journal?: string,
    startDate?: string,
    endDate?: string,
};