import { useLayoutEffect, useState, useCallback } from 'react';
import { makeStyles, Dialog, DialogContent, DialogContentText, DialogTitle, DialogActions } from '@material-ui/core';
import debounce from 'debounce';

const useStyles = makeStyles(({ zIndex }) => ({
    root: {
        position: 'absolute',
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
        zIndex: zIndex.modal - 1,
    },
    modalBackdrop: {
        display: 'none',
    },
}), { classNamePrefix: 'Overlay' });

function Overlay({ children, dialogContent, dialogTitle, dialogActions, holes = [] }) {
    const classes = useStyles();
    const [_, forceRefresh] = useState(0);

    const onViewPortChange = useCallback(debounce(() => forceRefresh(prevState => prevState + 1), 200), []);

    useLayoutEffect(() => {
        window.addEventListener('resize', onViewPortChange);
        window.addEventListener('scroll', onViewPortChange);
        onViewPortChange();
        return () => {
            window.removeEventListener('resize', onViewPortChange);
            window.removeEventListener('scroll', onViewPortChange);
        };
    }, [onViewPortChange]);

    const holeRects = holes.map((hole) => {
        if (!hole) { return null; }

        const { top, left, height, width } = hole.getBoundingClientRect();
        const scrollX = ('scrollX' in window ? window.scrollX : window.pageXOffset) || 0;
        const scrollY = ('scrollY' in window ? window.scrollY : window.pageYOffset) || 0;

        return <rect key={`${top}-${left}`} width={width} height={height} x={left + scrollX} y={top + scrollY} fill="#000" />;
    });


    return (
        <div className={classes.root}>
            <svg
                width="100%"
                height="100%"
            >
                <defs>
                    <mask id="overlayHole">
                        <rect width="100%" height="100%" fill="rgba(255,255,255,.7)" />
                        { holeRects }
                    </mask>
                </defs>

                <rect width="100%" height="100%" mask="url(#overlayHole)" />
            </svg>
            { children }
            { dialogContent && (
                <Dialog
                    open
                    disableBackdropClick
                    disableEscapeKeyDown
                    BackdropProps={{ className: classes.modalBackdrop }}
                >
                    { dialogTitle && <DialogTitle id="dialog-title">{ dialogTitle }</DialogTitle> }
                    <DialogContent id="dialog-description">
                        <DialogContentText component="div">
                            { dialogContent }
                        </DialogContentText>
                    </DialogContent>
                    { dialogActions && (
                        <DialogActions>
                            { dialogActions }
                        </DialogActions>
                    )}
                </Dialog>  
            )}
        </div>
    );
}

export default Overlay;
