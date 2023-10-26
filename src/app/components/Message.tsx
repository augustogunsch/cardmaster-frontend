import { Snackbar, Alert } from '@mui/material';
import { useAppSelector, useAppDispatch } from '../hooks'
import { closeMessage } from '../slices/messageSlice'

const Message = () => {
  const dispatch = useAppDispatch();
  const message = useAppSelector(store => store.message);

  const onClose = () => {
    dispatch(closeMessage());
  };

  return (
    <Snackbar open={message.open} autoHideDuration={message.autoHideDuration} onClose={onClose}>
      <Alert onClose={onClose} severity={message.severity} sx={{ width: '100%' }}>
        {message.content}
      </Alert>
    </Snackbar>
  );
};

export default Message
