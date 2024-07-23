import React, { useState, useEffect } from 'react';
import { Document, Page, pdfjs } from 'react-pdf';
import styled from 'styled-components';
import { Swipeable } from 'react-swipeable';

const ViewerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const NavigationContainer = styled.div`
  margin-top: 16px;
  display: flex;
  justify-content: center;
`;

const DocumentViewer: React.FC<{ answerFile: string }> = ({ answerFile }) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);

  useEffect(() => {
    // Enable pdfjs worker
    pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
  }, []);

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= (numPages || 1)) {
      setPageNumber(newPage);
    }
  };

  const handleSwipe = (direction: string) => {
    if (direction === 'LEFT') {
      handlePageChange(pageNumber + 1);
    } else if (direction === 'RIGHT') {
      handlePageChange(pageNumber - 1);
    }
  };

  if (!answerFile) {
    return <div>Loading...</div>;
  }

  return (
    <ViewerContainer>
      <Swipeable onSwipedLeft={() => handleSwipe('LEFT')} onSwipedRight={() => handleSwipe('RIGHT')}>
        <Document
          file={answerFile}
          onLoadSuccess={onDocumentLoadSuccess}
          loading="Loading document..."
        >
          <Page pageNumber={pageNumber} />
        </Document>
      </Swipeable>
      <NavigationContainer>
        <p>
          Page {pageNumber} of {numPages || 1}
        </p>
      </NavigationContainer>
    </ViewerContainer>
  );
};

export default DocumentViewer;
