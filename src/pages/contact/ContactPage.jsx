
import { Routes, Route } from 'react-router-dom';
import PostList from './components/PostList';
import Post from './components/Post';
import PostWriting from './components/PostWriting';

function ContactPage() {
  return (
    <Routes>
      <Route path='/' element={<PostList />} />
      <Route path='/post/:articleId' element={<Post />} />
      <Route path='/write' element={<PostWriting />} /> 
    </Routes>
  );

}

export default ContactPage;
