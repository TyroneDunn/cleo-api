export type PaginatedResponse<T> = {
    items: T[],
    count: number,
    page?: number,
    limit?: number,
};