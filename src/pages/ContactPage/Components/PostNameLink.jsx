import { useNavigate } from 'react-router-dom';
import styles from '../Styles/PostNameLink.module.css';
import mainurl from './mainurl';
// 게시물 목록에서 개별 게시물을 클릭할 수 있도록 하는 링크 컴포넌트
// - `PostList.jsx`에서 사용됨
// - 클릭 시 `useNavigate`를 통해 `/post/:id`로 이동

function PostNameLink({ post }) {
  const navigate = useNavigate();

  return (
    <div className={styles.postContainer} onClick={() => navigate(`./post/${post.articleId}`)}>
      <span className={styles.postId}>{post.articleId}</span>
      <span className={styles.postTitle}>{post.articleName}</span>
    </div>
  );
}

export default PostNameLink;
