import { Routes, Route } from 'react-router-dom';
import PostList from './ContactPage/Components/PostList';
import Post from './ContactPage/Components/Post';
import PostWriting from './ContactPage/Components/PostWriting';
import PostArticle from './ContactPage/Components/PostArticle';

function ContactPage() {
  return (
    <Routes>
      <Route path='/' element={<PostList />} />
      <Route path='/post/:articleId' element={<Post />} />
      <Route path='/write' element={<PostWriting />} /> {/* ✅ 올바른 상대 경로 */}
    </Routes>
  );
}

export default ContactPage;
