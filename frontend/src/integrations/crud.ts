/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Api from './api';

export default class CRUD<T = any, C = any, U = any> extends Api {
  public getAll = <A = T[]>(filter = '') => this.get<A>(
    `/${filter !== '' ? '?' : ''}${filter || ''}`,
  );

  public getOne = <A = T>(id: string) => this.get<A>(`/${id}`);

  public createOne = (data: C) => this.post<T, C>('/create', data);

  public updateOne = (id: string, data: U) => this.patch<T, U>(
    `/${id}/update`, data,
  );
}
