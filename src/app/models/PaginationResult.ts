import { User } from './user';

export interface PaginationResult<T> {
    result: T;
    paginationHeader: Pagination;
}

export class UserPaginationResult implements PaginationResult<User[]> {
  result: User[];
   paginationHeader: Pagination;


}

export interface Pagination {
  currentPage: number;
  itemsPerPage: number;
  totalPages: number;
  totalItems: number;
}
