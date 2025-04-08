import React from 'react';
import { Link } from 'react-router-dom';

function Footer() {
  return (

    
    <div className="bg-gray-900 text-white  w-full">
     
      <section className="text-center px-4">
        <p className="text-lg font-semibold">
          사업자등록번호 220-15-1547 통신판매업 신고번호 2006-부산사하-516호<br />
          대표이사 이준성 부산시 사하구 어쩌구 저쩌구<br />
          전화 1588-1588 이메일 TEST1@gmail.com
        </p>
      </section>

      <div className="flex flex-wrap justify-center max-w-5xl mx-auto mt-8">
        <div className="w-full md:w-1/2 lg:w-1/4 px-4 mb-6">
          <h2 className="text-xl font-bold mb-4">About Us</h2>
          <Link to="/sign-up" className="block text-gray-400 hover:text-white">
            회원가입
          </Link>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/4 px-4 mb-6">
          <h2 className="text-xl font-bold mb-4">Contact Us</h2>
          <Link to="/" className="block text-gray-400 hover:text-white">고객센터</Link>
          <Link to="/" className="block text-gray-400 hover:text-white">Support</Link>
          <Link to="/" className="block text-gray-400 hover:text-white">Destinations</Link>
          <Link to="/" className="block text-gray-400 hover:text-white">Sponsorships</Link>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/4 px-4 mb-6">
          <h2 className="text-xl font-bold mb-4">이용 약관</h2>
          <Link to="/" className="block text-gray-400 hover:text-white">SNS 페이 이용 약관</Link>
          <Link to="/" className="block text-gray-400 hover:text-white">전자금융거래 이용약관</Link>
          <Link to="/" className="block text-gray-400 hover:text-white">개인정보처리방침</Link>
          <Link to="/" className="block text-gray-400 hover:text-white">책임의 한계와 법적고지</Link>
        </div>
        <div className="w-full md:w-1/2 lg:w-1/4 px-4 mb-6">
          <h2 className="text-xl font-bold mb-4">Social Media</h2>
          <Link to="/" className="block text-gray-400 hover:text-white">Instagram</Link>
          <Link to="/" className="block text-gray-400 hover:text-white">Facebook</Link>
          <Link to="/" className="block text-gray-400 hover:text-white">Youtube</Link>
          <Link to="/" className="block text-gray-400 hover:text-white">Twitter</Link>
        </div>
      </div>

      <section className="mt-8 text-center">
        <div className="flex flex-col items-center">
          <Link to="/" className="text-2xl font-bold mb-2">
            BOSS <i className="fab fa-typo3"></i>
          </Link>
          <small className="text-gray-400">BOSS © {new Date().getFullYear()}</small>
          <div className="flex gap-4 mt-4">
            <Link to="/" className="text-white text-2xl hover:text-gray-400">
              <i className="fab fa-facebook-f"></i>
            </Link>
            <Link to="/" className="text-white text-2xl hover:text-gray-400">
              <i className="fab fa-instagram"></i>
            </Link>
            <Link to="/" className="text-white text-2xl hover:text-gray-400">
              <i className="fab fa-youtube"></i>
            </Link>
            <Link to="/" className="text-white text-2xl hover:text-gray-400">
              <i className="fab fa-twitter"></i>
            </Link>
            <Link to="/" className="text-white text-2xl hover:text-gray-400">
              <i className="fab fa-linkedin"></i>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;
