import React from 'react';
import { toast } from 'react-hot-toast';
import { IoCheckmarkCircle, IoAlertCircle, IoInformationCircle, IoClose } from 'react-icons/io5';

// 토스트 유틸리티 함수 (다른 컴포넌트에서 import해서 사용)
export const toastSuccess = (message) => {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? 'animate-enter' : 'animate-leave'
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-gray-100 ring-opacity-5`}
    >
      <div className='flex-1 w-0 p-4'>
        <div className='flex items-start'>
          <div className='flex-shrink-0 pt-0.5'>
            <IoCheckmarkCircle className='h-6 w-6 text-green-500' />
          </div>
          <div className='ml-3 flex-1'>
            <p className='text-sm font-medium text-gray-900'>성공!</p>
            <p className='mt-1 text-sm text-gray-500'>{message}</p>
          </div>
        </div>
      </div>
      <div className='flex border-l border-gray-200'>
        <button
          onClick={() => toast.dismiss(t.id)}
          className='w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-gray-500 focus:outline-none'
        >
          <IoClose className='h-5 w-5' />
        </button>
      </div>
    </div>
  ));
};

export const toastError = (message) => {
  toast.custom((t) => (
    <div
      className={`${
        t.visible ? 'animate-in fade-in' : 'animate-out fade-out'
      } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-red-100 ring-opacity-25`}
    >
      <div className='flex-1 w-0 p-4'>
        <div className='flex items-start'>
          <div className='flex-shrink-0 pt-0.5'>
            <IoAlertCircle className='h-6 w-6 text-red-500' />
          </div>
          <div className='ml-3 flex-1'>
            <p className='text-sm font-medium text-gray-900'>오류 발생</p>
            <p className='mt-1 text-sm text-gray-500'>{message}</p>
          </div>
        </div>
      </div>
      <div className='flex border-l border-gray-200'>
        <button
          onClick={() => toast.dismiss(t.id)}
          className='w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-gray-500 focus:outline-none'
        >
          <IoClose className='h-5 w-5' />
        </button>
      </div>
    </div>
  ));
};

export const toastInfo = (message) => {
  toast.custom((t) => {
    return (
      <div
        className={`${
          t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-blue-400 ring-opacity-20`}
      >
        <div className='flex-1 w-0 p-4'>
          <div className='flex items-start'>
            <div className='flex-shrink-0 pt-0.5'>
              <IoInformationCircle className='h-6 w-6 text-blue-500' />
            </div>
            <div className='ml-3 flex-1'>
              <p className='text-sm font-medium text-gray-900'>알림</p>
              <p className='mt-1 text-sm text-gray-500'>{message}</p>
            </div>
          </div>
        </div>
        <div className='flex border-l border-gray-200'>
          <button
            onClick={() => toast.dismiss(t.id)}
            className='w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-sm font-medium text-gray-400 hover:text-gray-500 focus:outline-none'
          >
            <IoClose className='h-5 w-5' />
          </button>
        </div>
      </div>
    );
  });
};
