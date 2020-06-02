import { Avatar as MuiAvatar } from '@material-ui/core';
import colorhash from 'material-color-hash';

function Avatar({ src, ...otherProps }) {
    const { backgroundColor } = colorhash(src);
    return <MuiAvatar {...otherProps} src={src} style={{ backgroundColor }} />;
}

export default Avatar;