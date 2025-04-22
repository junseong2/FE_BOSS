import { Loader2 } from 'lucide-react'; // lucide-react 스피너 사용
import PropTypes from 'prop-types';

const SuspenseFallback = ({ message = '로딩 중입니다...' }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] text-gray-600 animate-fade-in">
      <Loader2 className="w-8 h-8 animate-spin mb-2 text-primary" />
      <p className="text-sm">{message}</p>
    </div>
  );
};

SuspenseFallback.propTypes = {
  message: PropTypes.string,
};

export default SuspenseFallback;
