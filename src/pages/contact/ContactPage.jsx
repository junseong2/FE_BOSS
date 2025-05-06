
import { Routes, Route } from 'react-router-dom';
import PostList from './Components/PostList';
import Post from './Components/Post';
import PostWriting from './Components/PostWriting';
import PostArticle from './Components/PostArticle';

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
