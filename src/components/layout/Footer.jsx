import React from 'react';
import { Link } from 'react-router-dom';
import './footer.css';

function Footer() {
  return (
    <div className='footer-container'>
      <section className='footer-subscription'>
        <p className='footer-subscription-heading'>
          사업자등록번호 220-15-1547 통신판매업 신고번호 2006-부산사하-516호<br></br>
          대표이사 이준성 부산시 사하구 어쩌구 저쩌구<br></br>
          전화 1588-1588 이메일 TEST1@gmail.com
        </p>
        <p className='footer-subscription-text'></p>
      </section>

      <div className='footer-links'>
        <div className='footer-link-wrapper'>
          <div className='footer-link-items'>
            <h2>About Us</h2>
            <Link to='/sign-up'>회원가입</Link>
          </div>
          <div className='footer-link-items'>
            <h2>Contact Us</h2>
            <Link to='/'>고객센터</Link>
            <Link to='/'>Support</Link>
            <Link to='/'>Destinations</Link>
            <Link to='/'>Sponsorships</Link>
          </div>
        </div>
        <div className='footer-link-wrapper'>
          <div className='footer-link-items'>
            <h2>이용 약관</h2>
            <Link to='/'>SNS 페이 이용 약관</Link>
            <Link to='/'>전자금융거래 이용약관</Link>
            <Link to='/'>개인정보처리방침</Link>
            <Link to='/'>책임의 한계와 법적고지</Link>
          </div>
          <div className='footer-link-items'>
            <h2>Social Media</h2>
            <Link to='/'>Instagram</Link>
            <Link to='/'>Facebook</Link>
            <Link to='/'>Youtube</Link>
            <Link to='/'>Twitter</Link>
          </div>
        </div>
      </div>

      <section className='social-media'>
        <div className='social-media-wrap'>
          <div className='footer-logo'>
            <Link to='/' className='social-logo'>
              BOSS <i className='fab fa-typo3'></i>
            </Link>
          </div>
          <small className='website-rights'>BOSS © {new Date().getFullYear()}</small>
          <div className='social-icons'>
            <Link
              className='social-icon-link facebook'
              to='/'
              target='_blank'
              aria-label='Facebook'
            >
              <i className='fab fa-facebook-f'></i>
            </Link>
            <Link
              className='social-icon-link instagram'
              to='/'
              target='_blank'
              aria-label='Instagram'
            >
              <i className='fab fa-instagram'></i>
            </Link>
            <Link className='social-icon-link youtube' to='/' target='_blank' aria-label='Youtube'>
              <i className='fab fa-youtube'></i>
            </Link>
            <Link className='social-icon-link twitter' to='/' target='_blank' aria-label='Twitter'>
              <i className='fab fa-twitter'></i>
            </Link>
            <Link
              className='social-icon-link linkedin'
              to='/'
              target='_blank'
              aria-label='LinkedIn'
            >
              <i className='fab fa-linkedin'></i>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Footer;
