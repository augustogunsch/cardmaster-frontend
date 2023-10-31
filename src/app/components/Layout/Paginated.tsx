import React, { useState, useEffect } from 'react';

import {
  Box,
  CircularProgress,
  Pagination,
  Stack,
  Typography
} from '@mui/material';

import { useField, useAppDispatch } from '../../hooks';
import { setGenericError } from '../../slices/messageSlice';
import Search from '../../components/Search';

interface IElementListProps<T> {
  elementNamePlural: string
  elements: T[] | null | undefined
  elementMapper: (element: T) => JSX.Element
  children?: JSX.Element | JSX.Element[] | boolean
};

const ElementList = <T extends object>({
  elements,
  elementNamePlural,
  elementMapper,
  children
}: IElementListProps<T>): React.JSX.Element => {
  if (elements === undefined) {
    return <Stack alignItems="center"><CircularProgress /></Stack>;
  }

  if ((elements === null || (elements.length === 0)) &&
      (children === undefined || children === false)) {
    return <Typography>No {elementNamePlural} found.</Typography>;
  }

  return (
    <>
      {children}
      {elements?.map(elementMapper)}
    </>
  );
};

type GetElementsCallback<T> =
  (page: number, pageLength: number, filter: string) => Promise<{ elements: T[], count: number }>;

export interface IPaginatedProps<T> {
  pageLength: number
  elementNamePlural?: string
  getElements: T[] | null | undefined | GetElementsCallback<T>
  elementMapper: (element: T) => JSX.Element
  filter?: boolean | ((element: T, filter: string) => boolean)
  children?: JSX.Element | JSX.Element[] | boolean
};

const Paginated = <T extends object>({
  pageLength,
  elementNamePlural = 'items',
  getElements,
  elementMapper,
  filter,
  children
}: IPaginatedProps<T>): React.JSX.Element => {
  const [page, setPage] = useState(1);
  const [pageCount, setPageCount] = useState(1);
  const [elements, setElements] = useState<T[] | null | undefined>(undefined);
  const searchField = useField('text');
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (typeof getElements === 'function') {
      setElements(undefined);
      getElements(page, pageLength, searchField.value).then(({ elements, count }) => {
        setPageCount(Math.ceil(count / pageLength));
        setElements(elements);
      }).catch(e => {
        setElements([]);
        setPageCount(0);
        void dispatch(setGenericError(e));
      });
    } else if (getElements === null || getElements === undefined) {
      setPageCount(1);
      setElements(getElements);
    } else {
      const filteredElements = typeof filter === 'function'
        ? getElements.filter(element =>
          filter(element, searchField.value.toLowerCase())
        )
        : getElements;
      setPageCount(Math.max(Math.ceil(filteredElements.length / pageLength), 1));
      const startI = (page - 1) * pageLength;
      const endI = page * pageLength;
      setElements(filteredElements.slice(startI, endI));
    }
  }, [page, getElements, searchField.value]);

  useEffect(() => {
    if (page > pageCount) {
      setPage(pageCount);
    }
  }, [pageCount]);

  const handlePageChange = (_event: unknown, value: number): void => {
    setPage(value);
  };

  return (
    <Box>
      {filter !== undefined && filter !== false && (
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
