import {TypeaheadFetchResult} from "./typeahead-fetch-result"

export type TypeaheadFetchCallback<T> = (equery: string, page: number, pageSize: number) => Promise<TypeaheadFetchResult<T>>