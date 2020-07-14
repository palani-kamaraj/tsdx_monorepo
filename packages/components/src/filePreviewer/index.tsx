import React, { useState } from 'react';
import { Box, makeStyles, Dialog, Theme, CircularProgress } from '@material-ui/core';
import { Document, Page } from 'react-pdf';
//workaround
//Reference : https://stackoverflow.com/questions/55601881/critical-dependency-warning-when-using-react-pdf
// import 'pdfjs-dist/build/pdf.worker.js';

const useStyles = makeStyles((theme: Theme) => ({
  loaderStyle: {
    margin: `${theme.spacing(4)}px`
  },
  headerStyle: {
    boxShadow: 'inset 0px -1px 0px 0px rgb(237, 237, 237)',
    '& .MuiSvgIcon-root': {
      color: 'black !important'
    }
  },
  filePreviewDialogStyle: {
    '& .MuiBackdrop-root': {
      display: 'none',
    },
    '& .MuiDialog-paper': {
      justifyContent: 'center',
    }
  },
  centerAlignStyle: {
    marginTop: `${theme.spacing(14.67)}px`,
    overflow: 'auto',
    display: 'flex',
    justifyContent: 'center',
  }
}));

/**
 * 
 * @typdef {FilePreviewerProps} props 
 * 
 * @customProps
 * @prop {string} fileInBase64 - Base64 encoded file string
 * @prop {boolean} isPreviewOpen - Controls whether the dialog is open/closed
 * @prop {string} errorMessage - Error message for when document fetch runs into an error
 * @prop {string} fileType - One of 'pdf' or 'image'
 * @prop {ReactElement} headerIconComponent - Image/icon for the left part of the header within the preview dialog
 */

export const FilePreviewer = (props: any) => {
  const {
    fileInBase64,
    isPreviewOpen,
    errorMessage,
    fileType,
    // headerIconComponent,
  } = props;

  const {
    loaderStyle,
    // headerStyle,
    filePreviewDialogStyle,
    centerAlignStyle
  } = useStyles(props);

  const [filePages, setFilePages] = useState<Array<any>>([]);

  const onFileLoadSuccess = (document: any) => {
    const { numPages } = document;
    setFilePages(new Array(numPages).fill("0"));
  };

  const loader = <CircularProgress className={loaderStyle} />;

  return (
    <Dialog
      fullScreen
      open={isPreviewOpen}
      id="filePreviewDialog"
      className={filePreviewDialogStyle}
    >
      <Box className={centerAlignStyle}>
        {
          fileType === 'pdf' ? (
            <Document
              file={fileInBase64}
              loading={loader}
              error={errorMessage}
              onLoadSuccess={onFileLoadSuccess}
            >
              {filePages.map((index: number) => {
                return <Page key={index + "page"} pageNumber={index + 1} />;
              })}
            </Document>
          ) :
            <img src={fileInBase64} alt='File Image'/>
        }
      </Box>

    </Dialog>
  );
}

FilePreviewer.defaultProps = {
  errorMessage: "An error has occurred",
  headerIconComponent: null,
  fileInBase64: '',
  isPreviewOpen: false
};
