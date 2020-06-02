import { useContext } from 'react';
import SnackMessageContext from '../contexts/SnackMessage';

export default function useSnackMessage() {
    const { open, close } = useContext(SnackMessageContext);
    return [open, close];
}