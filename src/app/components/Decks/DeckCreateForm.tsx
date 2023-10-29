import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { useRequiredField, useAppDispatch } from '../../hooks';
import { createDeck } from '../../slices/decksSlice';

import DynamicForm from '../DynamicForm';

type DeckCreateFormProps = {
  open: boolean,
  handleClose: () => void
}

const DeckCreateForm = ({open, handleClose}: DeckCreateFormProps) => {
  const name = useRequiredField('Name', 'text');
  const dispatch = useAppDispatch();

  const myHandleClose = () => {
    handleClose();
    name.clear();
  };

  const handleSubmit = () => {
    if (name.validate()) {
      handleClose();
      dispatch(createDeck(name.value));
      name.clear();
    }
  };

  return (
    <DynamicForm
      title="Create a deck"
      handleSubmit={handleSubmit}
      handleClose={myHandleClose}
      open={open}
    >
      <Grid container>
        <Grid item xs={12} >
          <TextField
            required
            fullWidth
            label="Name"
            variant="outlined"
            {...name.inputProps}
          />
        </Grid>
      </Grid>
    </DynamicForm>
  );
};

export default DeckCreateForm;
