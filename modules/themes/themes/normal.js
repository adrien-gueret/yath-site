import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

const theme = {
    palette: {
        primary: {
            main: '#0d4bb8',
            light: '#5b76eb',
            dark: '#002587',
            contrastText: '#fafafa',
        },
        secondary: {
            main: '#8c6d62',
            light: '#bd9b8f',
            dark: '#5e4238',
            contrastText: '#fafafa',
        },
    },
};

export default responsiveFontSizes(createMuiTheme(theme));
