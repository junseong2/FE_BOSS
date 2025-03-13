import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import PostNameWrite from './PostNameWrite';
import PostArticleWrite from './PostArticleWrite';
import Buttons from './Buttons';
import styles from '../Styles/PostWriting.module.css'; // ✅ 스타일 분리
import mainurl from './mainurl';

// 게시물 작성 페이지
// - `/write`에서 렌더링됨
// - 제목(`PostNameWrite.jsx`)과 본문(`PostArticleWrite.jsx`)을 입력받음
// - 작성 버튼 클릭 시 API로 게시물 생성 요청 후 `/contact`로 이동

function PostWriting() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  // ✅ 게시글 작성 처리 (API 연동 추가)
  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해주세요.');
      return;
    }

    try {
      const response = await axios.post(mainurl() + '/articles', {
        articleName: title,
        article: content,
        userId: null, // ✅ 임시 사용자 ID (추후 로그인 시스템 연동 필요)
      });

      console.log('게시글이 성공적으로 등록됨:', response.data);
      alert('게시글이 작성되었습니다.');
      navigate('/contact'); // ✅ 성공적으로 작성 후 목록으로 이동
    } catch (error) {
      console.log();
      console.error('게시글 작성 중 오류 발생:', error);
      alert('게시글 작성 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.container}>
      <h2>게시글 작성</h2>
      <PostNameWrite title={title} setTitle={setTitle} />
      <PostArticleWrite content={content} setContent={setContent} />
      <Buttons onSubmit={handleSubmit} />
    </div>
  );
}

export default PostWriting;
