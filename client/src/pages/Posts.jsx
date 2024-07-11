import React, { useEffect, useState } from 'react';
import useFetch from '../hooks/useFetchHook';
import {v4 as uuidv4} from 'uuid'
const Posts = () => {
    const [posts, setPosts] = useState([]);
    const [filterTerm, setFilterTerm] = useState('');
    const [filterType, setFilterType] = useState('id'); // 'id' or 'title'
    const [selectedPostId, setSelectedPostId] = useState(null);
    const [editingPostId, setEditingPostId] = useState(null);
    const [comments, setComments] = useState([]);
    const [showComments, setShowcomments]=useState(false);
    const [newPost, setNewPost] = useState({ title: '', body: '' });
    const [newComment, setNewComment]=useState({name:'', email:'', body:''});
    const [showAddPost, setShowAddPost] = useState(false);
    const fetchObj = useFetch();

    useEffect(() => {
        const fetchPosts = async () => {
            let user = JSON.parse(localStorage.getItem("user"));
            const userIdNumber = Number(user.id);
            let userPosts = await fetchObj.fetchData('posts');
            let filteredPosts = userPosts.filter(post => post.userId === userIdNumber);

            setPosts(filteredPosts);
        };

        fetchPosts();
    }, [fetchObj]);

    const handleFetchComments = async (postID) => {
        const postIDNumber = Number(postID);
        console.log("postID:", postIDNumber);

        let postComents = await fetchObj.fetchData('comments');
        let filteredComments = postComents.filter(comment => comment.postId=== postIDNumber);

        setComments(filteredComments);
        console.log("comments:", postComents);
        console.log("filtered Comments:", filteredComments)
        // setShowcomments(true);
        setSelectedPostId(postID); // Ensure the post remains selected

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
        let user = JSON.parse(localStorage.getItem("user"));
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
        let user = JSON.parse(localStorage.getItem("user"));
        const userEmail = user.email;
    
        const newCommentData = {
            postId: selectedPostId,
            id:uuidv4().toString(),
            name: newComment.name,
            email: userEmail,
            body: newComment.body
        };
        const response = await fetchObj.fetchData('comments', 'POST', newCommentData);
        if (response) {
            setComments([...comments, response]);
            setNewComment({ name: '', email: '', body: '' });
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

    const handleUpdateComment = async (commentId, updatedCommentData) => {
        try {
            const response = await fetchObj.fetchData(`comments/${commentId}`, 'PUT', updatedCommentData);
            if (response) {
                const updatedComments = comments.map(comment => (comment.id === commentId ? response : comment));
                setComments(updatedComments);
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
            <ul>
                {getFilteredPosts().map(post => (
                    <li 
                        key={post.id}
                        onClick={() => handlePostSelection(post.id)}
                        style={{ 
                            // cursor: 'pointer', 
                            // backgroundColor: selectedPostId === post.id ? '#e0e0e0' : 'transparent',
                            padding: '10px',
                            margin: '10px 0',
                            borderRadius: '5px'
                        }}
                    >
                        <h3 
                        onClick={() => handlePostSelection(post.id)}
                        style={{ cursor: 'pointer' }}
                        >
                            {post.title}
                            </h3>
                        {selectedPostId === post.id && (
                            <>
                                <p>{post.body}</p>
                                <button onClick={(e) => {e.stopPropagation(); handleDeletePost(post.id);}}>Delete</button>
                                <button onClick={(e) => {e.stopPropagation(); handleEditPost(post.id);}}>Edit</button>
                                <button onClick={(e) => {e.stopPropagation(); handleFetchComments(post.id);}}>Show Commemts</button>
                                {editingPostId === post.id && (
                                    <div>
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
                                        <button onClick={() => handleUpdatePost(post.id, post)}>Update</button>
                                        <button onClick={(e) => { handleCancelEdit();}}>Cancel</button>
                                    </div>
                                )}
                                    <div>
                                        <h4>Comments</h4>
                                        <textarea
                                        placeholder="Add a comment"
                                        value={newComment.body}
                                        onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
                                    />
                                    <input
                                        type="text"
                                        placeholder="Name"
                                        value={newComment.name}
                                        onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                                    />
                                     <input
                                        type="email"
                                        placeholder="Email"
                                        value={newComment.email}
                                        onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                                    />
                                        <button onClick={handleAddComment}>Add Comment</button>
                                        <ul>
                                        {comments.map(comment => {
    let user = JSON.parse(localStorage.getItem("user"));
    const userEmail = user.email;

    return (
        <li key={comment.id}>
            <p>{comment.name} </p>
            <span><p>Email:</p> <p>{comment.email}</p></span>
            <p>{comment.body}</p>
            {comment.email === userEmail && ( // Only show buttons if the comment email matches the user's email
                <div>
                    <button onClick={(e) => { handleDeleteComment(comment.id); }}>Delete Comment</button>
                    <button onClick={(e) => { handleUpdateComment(comment.id, { ...comment, body: 'Updated comment text' }); }}>Update Comment</button>
                </div>
            )}
        </li>
    );
})}
                                        </ul>
                                        

                                    </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
            <button onClick={() => setShowAddPost(!showAddPost)}>
                {showAddPost ? 'Cancel' : 'Add New Post'}
            </button>
            {showAddPost && (
                <div>
                    <h3>Add New Post</h3>
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
                    <button onClick={handleAddPost}>Add Post</button>
                </div>
            )}
        </div>
    );
};

export default Posts;
