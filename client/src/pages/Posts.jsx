import React, { useEffect, useState, useRef } from 'react';
import useFetch from '../hooks/useFetchHook';
import '../css/Posts.css'; // Import the CSS file

    const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [filterTerm, setFilterTerm] = useState('');
    const [filterType, setFilterType] = useState('id'); // 'id' or 'title'
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [editingPostId, setEditingPostId] = useState(null);
    const [comments, setComments] = useState([]);
    const [newPost, setNewPost] = useState({ title: '', body: '' });
    const [newComment, setNewComment]=useState({name:'', email:'', body:''});
    const [commentsVisibility, setCommentsVisibility] = useState({});
    const [showAddPost, setShowAddPost] = useState(false);
    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentBody, setEditingCommentBody] = useState('');
    
    const hasRunRef = useRef(false);
    const fetchObj = useFetch();
    const user = JSON.parse(localStorage.getItem("user"));
    useEffect(() => {
        const fetchPosts = async () => {
            // let user = JSON.parse(localStorage.getItem("user"));
            const userIdNumber = Number(user.id);
            let userPosts = await fetchObj.fetchData('posts');
            let filteredPosts = userPosts.filter(post => post.userId === userIdNumber);

            setPosts(filteredPosts);
        };

        if (!hasRunRef.current) {
            fetchPosts();
        }
    }, []);

    const handleFetchComments = async (postId) => {
        const postIDNumber = Number(postId);
        
        // Toggle comments visibility
        setCommentsVisibility(prevVisibility => ({
            ...prevVisibility,
            [postId]: !prevVisibility[postId]
        }));
        
        if (commentsVisibility[postId]) {
            setComments([]);
            return;
        }
    
        let postComments = await fetchObj.fetchData('comments');
        let filteredComments = postComments.filter(comment => comment.postId === postIDNumber);
    
        setComments(filteredComments);
    };
    
    const handleFilterChange = (e) => {
        setFilterTerm(e.target.value);
    };

    const handleFilterTypeChange = (e) => {
        setFilterType(e.target.value);
    };

    const getFilteredPosts = () => {
        if (!filterTerm) {
            return posts;
        }
        return posts.filter(post => {
            if (filterType === 'id') {
                return post.id.toString() === filterTerm;
            }
            if (filterType === 'title') {
                return post.title.toLowerCase().includes(filterTerm.toLowerCase());
            }
            return false;
        });
    };

    const handleAddPost = async () => {
        // let user = JSON.parse(localStorage.getItem("user"));
        const userIdNumber = Number(user.id);
        const newPostData = { ...newPost, userId: userIdNumber };
        const response = await fetchObj.fetchData('posts', 'POST', newPostData);
        if (response) {
            setPosts([...posts, response]);
            setNewPost({ title: '', body: '' });
            setShowAddPost(false);
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            await fetchObj.fetchData(`posts/${postId}`, 'DELETE');
            setPosts(posts.filter(post => post.id !== postId));
        } catch (error) {
            console.error('Error deleting post:', error.message);
        }
    };

    const handleUpdatePost = async (postId, updatedPostData) => {
        try {
            const response = await fetchObj.fetchData(`posts/${postId}`, 'PUT', updatedPostData);
            if (response) {
                const updatedPosts = posts.map(post => (post.id === postId ? response : post));
                setPosts(updatedPosts);
                setEditingPostId(null);
            }
        } catch (error) {
            console.error('Error updating post:', error.message);
        }
    };

    const handlePostSelection = (postId) => {
        setSelectedPostId(postId); // Toggle selection
        setEditingPostId(null); // Ensure editing mode is reset

    };

    const handleEditPost = (postId) => {
        setEditingPostId(postId === editingPostId ? null : postId); // Toggle edit mode
    };

    const handleCancelEdit = () => {
        setEditingPostId(null);
    };
/**
 * COMMENTS
 */
const handleAddComment = async () => {
    // let user = JSON.parse(localStorage.getItem("user"));
    const userEmail = user.email;
    const userName = user.username;
    const newCommentData = {
        postId: Number(selectedPostId),
        name: userName,
        email: userEmail,
        body: newComment.body
    };
    
    try {
        const response = await fetchObj.fetchData('comments', 'POST', newCommentData);
        console.log('Add Comment Response:', response); // Log the response
        if (response) {
            setComments([...comments, response]);
            setNewComment({ name: '', email: '', body: '' });
        }
    } catch (error) {
        console.error('Error adding comment:', error.message);
    }
   
};


    const handleDeleteComment = async (commentId) => {
        try {
            await fetchObj.fetchData(`comments/${commentId}`, 'DELETE');
            setComments(comments.filter(comment => comment.id !== commentId));
        } catch (error) {
            console.error('Error deleting comment:', error.message);
        }
    };
    const handleEditComment = (commentId, body) => {
        setEditingCommentId(commentId);
        setEditingCommentBody(body);
    };
    
    const handleCancelEditComment = () => {
        setEditingCommentId(null);
        setEditingCommentBody('');
    };
    const handleUpdateComment = async (commentId) => {
        try {
            const userEmail = user.email;
            const userName = user.username;
            const updatedCommentData = { 
                postId: Number(selectedPostId),
                name: userName,
                email: userEmail,
                body: editingCommentBody
             };

            const response = await fetchObj.fetchData(`comments/${commentId}`, 'PUT', updatedCommentData);
            if (response) {
                const updatedComments = comments.map(comment => (comment.id === commentId ? response : comment));
                setComments(updatedComments);
                setEditingCommentId(null);
                setEditingCommentBody('');
                console.log('updated comment:',updatedCommentData )
            }
        } catch (error) {
            console.error('Error updating comment:', error.message);
        }
    };
    
    return (
        <div className="posts-container">
            <h2>Posts</h2>
            <div className="filter-controls">
                <select value={filterType} onChange={handleFilterTypeChange}>
                    <option value="id">ID</option>
                    <option value="title">Title</option>
                </select>
                <input
                    type="text"
                    value={filterTerm}
                    onChange={handleFilterChange}
                    placeholder={`Filter by ${filterType}`}
                />
            </div>
            <ul className="posts-list">
                {getFilteredPosts().map(post => (
                    <li 
                        key={post.id}
                        className={`post-item ${selectedPostId === post.id ? 'selected' : ''}`}
                        onClick={() => handlePostSelection(post.id)}
                    >
                        <h3 
                            className="post-title"
                            onClick={() => handlePostSelection(post.id)}
                        >
                            {post.title}
                        </h3>
                        {selectedPostId === post.id && (
                            <div className="post-details">
                                <p>{post.body}</p>
                                <div className="post-actions">
                                    <button id='btn' onClick={(e) => { e.stopPropagation(); handleDeletePost(post.id); }}>Delete</button>
                                    <button id='btn' onClick={(e) => { e.stopPropagation(); handleEditPost(post.id); }}>Edit</button>
                                    <button id='btn' onClick={(e) => { e.stopPropagation(); handleFetchComments(post.id); }}>
                                        {commentsVisibility[post.id] ? 'Hide Comments' : 'Show Comments'}
                                    </button>
                                </div>
                                {editingPostId === post.id && (
                                    <div className="edit-post">
                                        <input
                                            type="text"
                                            value={post.title}
                                            onChange={(e) => setPosts(posts.map(p => p.id === post.id ? { ...p, title: e.target.value } : p))}
                                        />
                                        <textarea
                                            placeholder="Body"
                                            value={post.body}
                                            onChange={(e) => setPosts(posts.map(p => p.id === post.id ? { ...p, body: e.target.value } : p))}
                                        />
                                        <button id='btn' onClick={(e) => { e.stopPropagation(); handleUpdatePost(post.id, post); }}>Update</button>
                                        <button id='btn' onClick={handleCancelEdit}>Cancel</button>
                                    </div>
                                )}
                                {commentsVisibility[post.id] && (
                                    <div className="comments-section">
                                        <h4>Comments</h4>
                                        <textarea
                                            placeholder="Add a comment"
                                            value={newComment.body}
                                            onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
                                        />
                                        <button id='btn' onClick={handleAddComment}>Add Comment</button>
                                        <ul className="comments-list">
                                            {comments.map(comment => {
                                                const userEmail = user.email;

                                                return (
                                                    <li key={comment.id} className="comment-item">
                                                        <p><strong>{comment.name}</strong></p>
                                                        <p className="comment-email">{comment.email}</p>
                                                        <div className="comment-body">
                                                            <p>{comment.body}</p>
                                                        </div>
                                                        {comment.email === userEmail && (
                                                            <div className="comment-actions">
                                                                <button id='btn' onClick={() => handleDeleteComment(comment.id)}>Delete Comment</button>
                                                                <button id='btn' onClick={() => handleEditComment(comment.id, comment.body)}>Edit Comment</button>
                                                            </div>
                                                        )}
                                                        {editingCommentId === comment.id && (
                                                            <div className="edit-comment">
                                                                <textarea
                                                                    value={editingCommentBody}
                                                                    onChange={(e) => setEditingCommentBody(e.target.value)}
                                                                />
                                                                <button id='btn' onClick={() => handleUpdateComment(comment.id)}>Update Comment</button>
                                                                <button id='btn' onClick={handleCancelEditComment}>Cancel</button>
                                                            </div>
                                                        )}
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
            <button className="toggle-add-post" onClick={() => setShowAddPost(!showAddPost)}>
                {showAddPost ? 'Cancel' : 'Add Post'}
            </button>
            {showAddPost && (
                <div className="new-post-form">
                    <input
                        type="text"
                        placeholder="Title"
                        value={newPost.title}
                        onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                    />
                    <textarea
                        placeholder="Body"
                        value={newPost.body}
                        onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                    />
                    <button  id='btn' onClick={handleAddPost}>Add Post</button>
                </div>
            )}
        </div>
    );
};

export default Posts;