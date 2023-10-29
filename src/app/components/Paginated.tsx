import { useState, useEffect } from 'react';

import {
  Box,
  CircularProgress,
  Pagination,
  Stack,
  Typography
} from '@mui/material';

import { useField, useAppDispatch } from '../hooks'
import { setGenericError } from '../slices/messageSlice'
import Search from '../components/Search';

interface IElementListProps<T> {
  elementNamePlural: string;
  elements: T[] | null;
  elementMapper: (element: T) => JSX.Element;
  children?: JSX.Element | JSX.Element[] | false;
};

const ElementList = <T extends object>({
  elements,
  elementNamePlural,
  elementMapper,
  children
}: IElementListProps<T>) => {
  if (elements === null) {
    return <Stack alignItems="center"><CircularProgress /></Stack>;
  }

  if (!elements.length && !children) {
    return <Typography>No {elementNamePlural} found.</Typography>;
  }

  return (
    <>
      {children}
      {elements.map(elementMapper)}
    </>
  );
};

type GetElementsCallback<T> =
  (page: number, pageLength: number, filter: string) => Promise<{elements: T[], count: number}>;

export interface IPaginatedProps<T> {
  pageLength: number;
  elementNamePlural?: string;
  getElements: T[] | null | GetElementsCallback<T>;
  elementMapper: (element: T) => JSX.Element;
  filter?: boolean | ((element: T, filter: string) => boolean);
  children?: JSX.Element | JSX.Element[] | false;
};

const Paginated = <T extends object>({
  pageLength,
  elementNamePlural="items",
  getElements,
  elementMapper,
  filter,
  children
}: IPaginatedProps<T>) => {
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [elements, setElements] = useState<T[] | null>(null);
  const searchField = useField('text');
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (typeof getElements === 'function') {
      setElements(null);
      getElements(page, pageLength, searchField.value).then(({elements, count}) => {
        setPageCount(Math.ceil(count / pageLength));
        setElements(elements);
      }).catch(e => {
        setElements([]);
        setPageCount(0);
        dispatch(setGenericError(e))
      });
    } else if (getElements === null) {
      setPageCount(1);
      setElements(null);
    } else {
      const filteredElements = typeof filter === 'function' ? getElements.filter(element =>
        filter(element, searchField.value.toLowerCase())
      ) : getElements;
      setPageCount(Math.max(Math.ceil(filteredElements.length / pageLength), 1));
      const startI = (page - 1) * pageLength;
      const endI = page * pageLength;
      setElements(filteredElements.slice(startI, endI));
    }
  }, [page, getElements, searchField.value]);

  useEffect(() => {
    if(page > pageCount) {
      setPage(pageCount);
    }
  }, [pageCount]);

  const handlePageChange = (_event: unknown, value: number) => {
    setPage(value);
  }

  return (
    <Box>
      {filter && (
        <Search
          searchField={searchField}
          style={{
            marginTop: 15,
            marginBottom: 15
          }}
        />
      )}
      <ElementList
        elementNamePlural={elementNamePlural}
        elements={elements}
        elementMapper={elementMapper}
      >
        {children}
      </ElementList>
      <Pagination
        count={pageCount}
        page={page}
        onChange={handlePageChange}
        sx={{
          marginTop: 2,
          '& .MuiPagination-ul': {
            justifyContent: 'center'
          }
        }}
      />
    </Box>
  );
};

export default Paginated;
