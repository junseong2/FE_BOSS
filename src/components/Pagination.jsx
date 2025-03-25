import ReactPaginate from 'react-paginate';

export default function Pagination({ totalPageCount, handlePageClick }) {
  return (
    <div className='w-full px-2 py-6'>
      <ReactPaginate
        previousLabel={'←'}
        nextLabel={'→'}
        breakLabel={'...'}
        pageCount={totalPageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName='flex justify-center gap-2 mt-4'
        activeClassName='text-white bg-[#1a2b3e] px-3 py-1 rounded'
        pageClassName='px-3 py-1 rounded cursor-pointer'
        previousClassName='px-3 py-1 rounded cursor-pointer'
        nextClassName='px-3 py-1 rounded cursor-pointer'
        disabledClassName='opacity-50 cursor-not-allowed'
      ></ReactPaginate>
    </div>
  );
}
