import { Dialog, DialogTitle, DialogContent, DialogActions, Typography } from '@mui/material';
import Button from '@mui/material/Button';
// import { Button } from '../controls';

const ConfirmDialog = (props) => {
	const { confirmDialog, setConfirmDialog } = props;

	return (
		<Dialog open={confirmDialog.isOpen}>
			<DialogContent>
				<Typography variant="h6">{confirmDialog.title}</Typography>
				<Typography variant="subtitle2">{confirmDialog.subtitle}</Typography>
			</DialogContent>
			<DialogActions>
				<Button color="error" variant="contained" onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}>
					No
				</Button>
				<Button color="success" variant="contained" onClick={confirmDialog.onConfirm}>
					Yes
				</Button>
			</DialogActions>
		</Dialog>
	);
};
export default ConfirmDialog;
