import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';

type ConfirmDialogProps = {
  open: boolean,
  handleClose: () => void,
  handleConfirm: () => void,
  title: string,
  deleteButton?: boolean,
  children: JSX.Element | JSX.Element[]
}

const ConfirmDialog = ({title, open, handleConfirm, handleClose, deleteButton=false, children} : ConfirmDialogProps) => {
  return (
    <Dialog
      open={open}
      onClose={handleClose}
    >
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        {children}
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={handleClose}>
          Cancel
        </Button>
        {!deleteButton && (
          <Button onClick={handleConfirm}>Ok</Button>
        )}
        {deleteButton && (
          <Button
            variant="contained"
            color="error"
            onClick={handleConfirm}
          >
            Delete
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmDialog;
