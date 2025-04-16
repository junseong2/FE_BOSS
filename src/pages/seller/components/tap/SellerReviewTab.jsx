import { CheckCircle, Clock, MessageSquare } from 'lucide-react';

export default function SellerReviewTab({ setActiveTab, activeTab }) {
  return (
    <div className='border-b border-gray-200'>
      <div className='flex'>
        <button
          className={`px-6 py-4 font-medium text-sm flex items-center gap-2 transition-colors ${
            activeTab === null
              ? 'border-b-2 border-gray-600 text-gray-800 bg-gray-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab(null)}
        >
          <MessageSquare className='w-4 h-4' />
          전체 리뷰
        </button>
        <button
          className={`px-6 py-4 font-medium text-sm flex items-center gap-2 transition-colors ${
            activeTab === false
              ? 'border-b-2 border-gray-600 text-gray-800 bg-gray-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab(false)}
        >
          <Clock className='w-4 h-4' />
          미응답 리뷰
        </button>
        <button
          className={`px-6 py-4 font-medium text-sm flex items-center gap-2 transition-colors ${
            activeTab === true
              ? 'border-b-2 border-gray-600 text-gray-800 bg-gray-50'
              : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab(true)}
        >
          <CheckCircle className='w-4 h-4' />
          응답 완료
        </button>
      </div>
    </div>
  );
}
