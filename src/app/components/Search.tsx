import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import InputBase from '@mui/material/InputBase';
import type { UseField } from '../hooks';

const SearchWrapper = styled('div')(() => ({
  position: 'relative',
  width: '100%',
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const ClearIconWrapper = styled(IconButton)(() => ({
  position: 'absolute',
  right: 0
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    paddingRight: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
  },
}));

const Search = ({searchField}: {searchField: UseField}) => {
  const {helperText: _, ...props} = searchField.inputProps;

  return (
    <SearchWrapper>
      <SearchIconWrapper>
        <SearchIcon />
      </SearchIconWrapper>
      <StyledInputBase
        placeholder="Search…"
        {...props}
      />
      {searchField.value && (
        <ClearIconWrapper
          onClick={searchField.clear}
        >
          <ClearIcon />
        </ClearIconWrapper>
      )}
    </SearchWrapper>
  );
};

export default Search;
