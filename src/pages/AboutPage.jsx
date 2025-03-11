import '../App.css'; // 스타일 파일 임포트
import './styles/aboutpage.css';
function AboutPage() {
  return (
    <div>
      {/* 첫 번째 about-page */}
      <div className='about-page'>
        <img src='/happyfamily.jpg' alt='Happy Family' className='about-image' />
        <div className='about-text'>
          <h2>This is a false page!</h2>
          <p>I write down the bad idea that it will look plausible if I write a rough sentence</p>
        </div>
      </div>
      <div className='button-container'>
        <button className='start-button'>START</button>
      </div>
      {/* 두 번째 about-page */}
      <div className='about-page'>
        <img src='happyfamily2.jpg' alt='Happy Family' className='about-image' />
        <div className='about-text'>
          <h2>This is a false page!</h2>
          <p>I write down the bad idea that it will look plausible if I write a rough sentence</p>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
