import { Link } from "react-router-dom"
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter, FaLinkedinIn, FaPhoneAlt, FaEnvelope } from "react-icons/fa"

function Footer() {
  return (
    <footer className="bg-gray-800 text-white pt-12 pb-6 relative">
      {/* Subtle top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gray-700"></div>

      <div className="container mx-auto px-4">
        {/* Business Information */}
        <section className="text-center mb-12 max-w-3xl mx-auto">
          <div className="p-6 bg-gray-750 rounded-lg shadow-sm border border-gray-700">
            <p className="text-lg font-medium text-gray-300 leading-relaxed">
              사업자등록번호 220-15-1547 통신판매업 신고번호 2006-부산사하-516호
              <br />
              대표이사 이준성 부산시 사하구 어쩌구 저쩌구
              <br />
              <span className="flex items-center justify-center gap-2 mt-2">
                <FaPhoneAlt className="text-gray-400" /> 1588-1588
                <span className="mx-2">|</span>
                <FaEnvelope className="text-gray-400" /> TEST1@gmail.com
              </span>
            </p>
          </div>
        </section>

        {/* Links Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto mb-12">
          {/* About Us */}
          <div className="footer-column">
            <h2 className="text-xl font-bold mb-4 text-white relative inline-block">
              About Us
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gray-600"></span>
            </h2>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/sign-up"
                  className="text-gray-400 hover:text-gray-200 transition-colors duration-300 flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                  회원가입
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div className="footer-column">
            <h2 className="text-xl font-bold mb-4 text-white relative inline-block">
              Contact Us
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gray-600"></span>
            </h2>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-gray-200 transition-colors duration-300 flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                  고객센터
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-gray-200 transition-colors duration-300 flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                  Support
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-gray-200 transition-colors duration-300 flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                  Destinations
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-gray-200 transition-colors duration-300 flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                  Sponsorships
                </Link>
              </li>
            </ul>
          </div>

          {/* Terms of Use */}
          <div className="footer-column">
            <h2 className="text-xl font-bold mb-4 text-white relative inline-block">
              이용 약관
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gray-600"></span>
            </h2>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-gray-200 transition-colors duration-300 flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                  SNS 페이 이용 약관
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-gray-200 transition-colors duration-300 flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                  전자금융거래 이용약관
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-gray-200 transition-colors duration-300 flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                  개인정보처리방침
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-gray-200 transition-colors duration-300 flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                  책임의 한계와 법적고지
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div className="footer-column">
            <h2 className="text-xl font-bold mb-4 text-white relative inline-block">
              Social Media
              <span className="absolute -bottom-1 left-0 w-12 h-0.5 bg-gray-600"></span>
            </h2>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-gray-200 transition-colors duration-300 flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                  Instagram
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-gray-200 transition-colors duration-300 flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                  Facebook
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-gray-200 transition-colors duration-300 flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                  Youtube
                </Link>
              </li>
              <li>
                <Link
                  to="/"
                  className="text-gray-400 hover:text-gray-200 transition-colors duration-300 flex items-center"
                >
                  <span className="w-1.5 h-1.5 bg-gray-500 rounded-full mr-2"></span>
                  Twitter
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Section */}
        <section className="pt-8 border-t border-gray-700">
          <div className="flex flex-col items-center">
            <Link to="/" className="text-3xl font-bold mb-4 text-white">
              BOSS
            </Link>

            <div className="flex gap-6 mt-4 mb-6">
              <Link
                to="/"
                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors duration-300 border border-gray-600"
              >
                <FaFacebookF className="text-gray-300" />
              </Link>
              <Link
                to="/"
                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors duration-300 border border-gray-600"
              >
                <FaInstagram className="text-gray-300" />
              </Link>
              <Link
                to="/"
                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors duration-300 border border-gray-600"
              >
                <FaYoutube className="text-gray-300" />
              </Link>
              <Link
                to="/"
                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors duration-300 border border-gray-600"
              >
                <FaTwitter className="text-gray-300" />
              </Link>
              <Link
                to="/"
                className="w-10 h-10 rounded-full bg-gray-700 hover:bg-gray-600 flex items-center justify-center transition-colors duration-300 border border-gray-600"
              >
                <FaLinkedinIn className="text-gray-300" />
              </Link>
            </div>

            <small className="text-gray-500 text-center">
              © {new Date().getFullYear()} BOSS. All rights reserved.
              <br />
              <span className="text-xs">본 사이트는 상업적 목적이 아닌 개인 포트폴리오용으로 제작되었습니다.</span>
            </small>
          </div>
        </section>
      </div>
    </footer>
  )
}

export default Footer
