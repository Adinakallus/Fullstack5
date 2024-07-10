import React, { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetchHook';

const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [selectedPost, setSelectedPost] = useState(null);
    const [comments, setComments] = useState([]);
    const fetchObj = useFetch();
    console.log("from Post component");

    useEffect(()=>{
    console.log("from Post component");
    
        const fetchPosts=async ()=>{
            let user = JSON.parse(localStorage.getItem("user"));
            console.log('User:', user);

            const userPosts = await fetchObj.fetchData('posts');
            const filteredPosts=userPosts.filter((post)=>post.userId===user.id);

            setPosts(filteredPosts);
            console.log(filteredPosts);
        };
        
        fetchPosts();
   
    },[])
return (
    <div className="posts-container">
        <h2>Posts</h2>
        <ul>
            {posts.map(post => (
                <li key={post.id}>
                    <h3>{post.title}</h3>
                    <p>{post.body}</p>
                </li>
            ))}
        </ul>
    </div>
);
};

export default Posts;