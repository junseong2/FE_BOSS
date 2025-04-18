import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { formatLocalDate } from '../utils/formatter';

/** 시작일과 종료일을 선택할 수 있는 컴포넌트 */
export default function DateRangePicker({ setDateRange, onClose }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isValid, setIsValid] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  // 시작 날 선택
  const handleStartDateChange = (e) => {
    const newStartDate = e.target.value;
    setStartDate(newStartDate);
    validateDates(newStartDate, endDate);
  };

  // 종료 날 선택
  const handleEndDateChange = (e) => {
    const newEndDate = e.target.value;
    setEndDate(newEndDate);
    validateDates(startDate, newEndDate);
  };

  // 날짜 범위 유효성 검사
  const validateDates = (start, end) => {
    if (start && end) {
      const startTimestamp = new Date(start).getTime();
      const endTimestamp = new Date(end).getTime();

      if (startTimestamp > endTimestamp) {
        setIsValid(false);
        setErrorMessage('종료일은 시작일 이후여야 합니다.');
      } else {
        setIsValid(true);
        setErrorMessage('');
      }
    } else {
      setIsValid(true);
      setErrorMessage('');
    }
  };

  // 설정 초기화
  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setIsValid(true);
    setErrorMessage('');
  };

  // 날짜 범위 설정 실행
  const handleSubmit = () => {
    if (!startDate || !endDate) {
      setIsValid(false);
      setErrorMessage('시작일과 종료일을 모두 선택해주세요.');
      return;
    }

    if (isValid) {
      setDateRange({
        startDate:formatLocalDate(startDate),
        endDate:formatLocalDate(endDate),
      });

      onClose()
    }
  };

  return (
    <div className='fixed left-0 right-0 top-0 bottom-0 flex items-center justify-center'>
      <div className='absolute left-0 right-0 top-0 bottom-0 bg-black opacity-70'></div>
      <div className='max-w-lg w-full h-full max-h-1/2 mx-auto bg-white p-6 rounded-lg shadow-md z-[10000000000000]'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-bold text-gray-800 mb-4'>날짜 범위 선택</h2>
          <IoClose onClick={onClose} className='hover:text-gray-500 cursor-pointer text-xl'/>
        </div>

        <div className='mb-4'>
          <label htmlFor='startDate' className='block text-sm font-medium text-gray-700 mb-1'>
            시작일
          </label>
          <input
            type='date'
            id='startDate'
            value={startDate}
            onChange={handleStartDateChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        <div className='mb-4'>
          <label htmlFor='endDate' className='block text-sm font-medium text-gray-700 mb-1'>
            종료일
          </label>
          <input
            type='date'
            id='endDate'
            value={endDate}
            onChange={handleEndDateChange}
            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          />
        </div>

        {!isValid && (
          <div className='mb-4 p-2 bg-red-50 border border-red-300 text-red-400 rounded-md'>
            {errorMessage}
          </div>
        )}

        <div className='flex space-x-2'>
          <button
            onClick={handleSubmit}
            className='flex-1 bg-[#1A2B3E] hover:bg-[#1a2b3ee7] cursor-pointer text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
          >
            적용
          </button>
          <button
            onClick={handleReset}
            className='flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500'
          >
            초기화
          </button>
        </div>
      </div>
    </div>
  );
}
