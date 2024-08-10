import React from "react";
import {
  IconArrowLeftfunction,
  IconArrowRight,
  IconChevronLeft,
  IconChevronRight,
} from "../../assets/icons";
import styled,{ThemeProvider} from "styled-components";
import { useSelector } from "react-redux";

const Paginator = ({ currentPage, totalPages, onPageChange }) => {
  const { theme } = useSelector((state: any) => state.theme);
  if (!totalPages) return

  function numberRange(start, end) {
    return new Array(end - start).fill().map((d, i) => i + start);
  }

  let middlePagination;

  if (totalPages <= 5) {
    middlePagination = [...Array(totalPages)].map((__, index) => (
      <button
        key={index + 1}
        onClick={() => onPageChange(index + 1)}
        disabled={currentPage === index + 1}
      >
        {index + 1}
      </button>
    ));
  } else {
    const startValue = Math.floor((currentPage - 1) / 5) * 5;

    middlePagination = (
      <>
        {numberRange(startValue, totalPages).map((__, index) => (
          <button
            key={startValue + index + 1}
            onClick={() => onPageChange(startValue + index + 1)}
            disabled={currentPage === startValue + index + 1}
          >
            {startValue + index + 1}
          </button>
        ))}
        <button>...</button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
        >
          {currentPage}
        </button>
      </>
    );

    if (currentPage > 5) {
      if (totalPages - currentPage >= 5) {
        middlePagination = (
          <>
            <button onClick={() => onPageChange(1)}>1</button>
            <button>...</button>
            <button onClick={() => onPageChange(startValue)}>
              {startValue}
            </button>

            {numberRange(startValue, totalPages).map((__, index) => (
              <button
                key={startValue + index + 1}
                onClick={() => changePage(startValue + index + 1)}
                disabled={currentPage === startValue + index + 1}
              >
                {startValue + index + 1}
              </button>
            ))}
            <button>...</button>
            <button onClick={() => onPageChange(totalPages)}>
              {totalPages}
            </button>
          </>
        );
      } else {
        let amountLeft = totalPages - currentPage + 5;
        middlePagination = (
          <>
            <button onClick={() => onPageChange(1)}>1</button>
            <button>...</button>
            <button onClick={() => onPageChange(startValue)}>
              {startValue}
            </button>
            {numberRange(amountLeft, totalPages).map((__, index) => (
              <button
                key={startValue + index + 1}
                onClick={() => onPageChange(startValue + index + 1)}
                disabled={currentPage === startValue + index + 1}
                style={
                  totalPages < startValue + index + 1
                    ? { display: "none" }
                    : null
                }
              >
                {startValue + index + 1}
              </button>
            ))}
          </>
        );
      }
    }
  }

  return (
    <>
    <ThemeProvider theme={theme}>
      <PaginatorRenderer>
      <button
          className="pagination__prev"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          {currentPage === 1 ? <IconArrowRight/> : <IconChevronLeft />}
        </button>

        {middlePagination}

        <button
          className="pagination__next"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          {currentPage === totalPages ? (
            <IconArrowLeftfunction />
          ) : (
            <IconChevronRight />
          )}
        </button>
      </PaginatorRenderer>
    </ThemeProvider>
    </>
   
     
    )

};

export default Paginator;



const PaginatorRenderer = styled.div`
  padding-left: 1rem;
  display: flex;
  justify-content: center;
  margin: 1.5rem 0 2rem;
  width: 100px;

button {
  margin-right: 0.5rem;
  cursor: pointer;
  padding: 10px 17px;
  border: none;
  border-radius: 6px;
  border: #EDF0F7 solid 1px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(145, 145, 145);
  background-color: #EDF0F7;
}

button svg {
  color: #0063a5;
  font-size: 1.1rem;
}

button:disabled {
  color: #0063a5;
  font-weight: bold;
  text-decoration: underline;
  text-underline-offset: 6px;
}
`