import { Search } from 'lucide-react'

function SellerSearch({ placeholder, onSearch }) {
  return (
    <form onSubmit={onSearch} className="w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <Search className="w-4 h-4 text-gray-400" />
        </div>
        <input
          type="search"
          name="search"
          className="block w-full p-3 pl-10 text-sm text-gray-900 border border-gray-200 rounded-lg bg-white focus:ring-2 focus:ring-gray-400 focus:border-gray-400 transition-all"
          placeholder={placeholder}
        />
        <button
          type="submit"
          className="absolute right-2 bottom-2 top-2 px-4 text-sm font-medium text-white bg-gray-600 rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          검색
        </button>
      </div>
    </form>
  )
}

export default SellerSearch

