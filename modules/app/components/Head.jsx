import NextHead from 'next/head';
import { useTheme } from '@material-ui/core';

export default function Head({ title = 'yath', description}) {
    const theme = useTheme();
    
    return (  
        <NextHead>
            <meta charSet="UTF-8" />
            <title>{ title }</title>
            <meta property="og:title" content={ title } />
            <meta property="og:type" content="website" />
            { description && (
                <>
                    <meta name="description" content={description} />
                    <meta property="og:description" content={description} />
                </>
            )}
            <link rel="icon" href="/favicon.ico" />
            <meta name="theme-color" content={theme.palette.primary.main} />
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        </NextHead>
    );
}