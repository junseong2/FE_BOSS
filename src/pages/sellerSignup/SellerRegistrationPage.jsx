import SellerRegistrationForm from './components/SellerRegistrationForm';

const SellerSignUpPage = ({ onClose }) => {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <SellerRegistrationForm onClose={onClose} /> 
    </div>
  );
};


export default SellerSignUpPage
