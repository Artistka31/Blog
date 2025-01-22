import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCommentById,
  updateComment,
} from "../redux/features/comment/commentSlice";
import { getPostById } from "../redux/features/post/postSlice";
import Moment from "react-moment";

export const EditCommentPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [comment, setComment] = useState("");
  const [postId, setPostId] = useState("");
  const [authorId, setAuthorId] = useState("");

  const {
    comments,
    loading: commentLoading,
    authors,
  } = useSelector((state) => state.comment);
  const { posts, loading: postLoading } = useSelector((state) => state.post);

  const selectedComment = comments.find((cmt) => cmt?._id === params.id);

  useEffect(() => {
    if (!selectedComment) {
      dispatch(getCommentById(params.id));
    } else {
      setComment(selectedComment.comment);
      setPostId(selectedComment.postId);
      setAuthorId(selectedComment.author._id);

      if (!posts.find((post) => post._id === selectedComment.postId)) {
        dispatch(getPostById(selectedComment.postId));
      }
    }
  }, [params.id, selectedComment, dispatch, posts]);

  const submitHandler = async () => {
    try {
      await dispatch(
        updateComment({ id: params.id, comment, author: authorId })
      );
      if (postId) {
        navigate(`/${postId}`);
      } else {
        console.error("Post ID is undefined or selectedComment is null");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const clearFormHandler = () => {
    setComment("");
  };

  if (commentLoading || postLoading) {
    return <div>Loading...</div>;
  }

  const postDetails = posts.find((post) => post._id === postId);
  const author = authors[authorId];
  const username = author?.username || "Unknown User";

  return (
    <div className="p-4 sm:p-6">
      <button className="post-button flex justify-center items-center bg-gray-600 text-xs text-white rounded-sm py-2 px-4">
        <Link className="flex" to={"/"}>
          Back
        </Link>
      </button>
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-10 py-4 sm:py-8">
        <div className="flex flex-col w-full sm:w-2/3">
          <div className="flex flex-col basis-full sm:basis-1/2 md:basis-1/4 flex-grow">
            <div
              className={
                postDetails?.imgUrl
                  ? "flex rounded-sm h-60 sm:h-80"
                  : "flex rounded-sm"
              }
            >
              {postDetails?.imgUrl && (
                <img
                  src={`http://localhost:3002/${postDetails.imgUrl}`}
                  alt="img"
                  className="object-cover w-full h-full"
                />
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2">
            <div className="text-xs text-white opacity-50">{username}</div>
            <div className="text-xs text-white opacity-50 mt-2 sm:mt-0">
              <Moment
                date={postDetails?.createdAt || null}
                format="D MMM YYYY"
              />
            </div>
          </div>
          <div className="text-white text-xl mt-2">{postDetails?.title}</div>
          <p className="text-white opacity-60 text-xs pt-2 sm:pt-4">
            {postDetails?.text}
          </p>
        </div>

        <div className="w-full sm:w-1/3 bg-gray-700 p-4 sm:p-8 flex flex-col gap-2 rounded-sm">
          <form
            className="flex flex-col gap-2"
            onSubmit={(e) => e.preventDefault()}
          >
            <label className="text-xs text-white opacity-70">
              Change comment:
              <input
                type="text"
                name="comment"
                value={comment || ""}
                onChange={(e) => setComment(e.target.value)}
                placeholder="comment"
                className="text-black w-full rounded-sm bg-gray-400 border p-2 text-xs outline-none placeholder:text-gray-700"
              />
            </label>
          </form>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
            <button
              className="post-button flex justify-center items-center bg-gray-500 text-xs text-white rounded-sm py-2 px-4"
              onClick={submitHandler}
            >
              Update
            </button>
            <button
              className="post-button flex justify-center items-center bg-red-500 text-xs text-white rounded-sm py-2 px-4"
              onClick={clearFormHandler}
            >
              <Link className="flex" to={"/posts"}>
                Cancel
              </Link>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

/* import React, { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getCommentById,
  updateComment,
} from "../redux/features/comment/commentSlice";
import { getPostById } from "../redux/features/post/postSlice";
import Moment from "react-moment";
import { getMe } from "../redux/features/auth/authSlice";

export const EditCommentPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [comment, setComment] = useState("");
  const [postId, setPostId] = useState("");
  const [authorId, setAuthorId] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  const {
    comments,
    loading: commentLoading,
    authors,
  } = useSelector((state) => state.comment);
  const { posts, loading: postLoading } = useSelector((state) => state.post);
  const { user, isLoading: authLoading } = useSelector((state) => state.auth);

  const selectedComment = comments.find((cmt) => cmt?._id === params.id);

  useEffect(() => {
    if (!selectedComment) {
      dispatch(getCommentById(params.id));
    } else {
      console.log("Selected Comment:", selectedComment); // Debug log

      setComment(selectedComment.comment);
      setPostId(selectedComment.postId);
      setAuthorId(selectedComment.author?._id || ""); // Ensure authorId is a string

      if (!posts.find((post) => post._id === selectedComment.postId)) {
        dispatch(getPostById(selectedComment.postId));
      }
    }

    if (!user && !authLoading) {
      dispatch(getMe());
    } else {
      console.log("Current user ID:", user?._id);
      setCurrentUserId(user?._id || "");
    }
  }, [params.id, selectedComment, dispatch, posts, user, authLoading]);

  const submitHandler = async () => {
    try {
      if (currentUserId === authorId) {
        console.log("Submitting comment update with author ID:", authorId); // Debug log
        await dispatch(
          updateComment({ id: params.id, comment, author: authorId })
        );
        if (postId) {
          navigate(`/${postId}`);
        } else {
          console.error("Post ID is undefined or selectedComment is null");
        }
      } else {
        console.error("Unauthorized attempt to edit comment");
      }
    } catch (error) {
      console.error("Error updating comment:", error);
    }
  };

  const clearFormHandler = () => {
    setComment("");
  };

  if (commentLoading || postLoading || authLoading) {
    return <div>Loading...</div>;
  }

  const postDetails = posts.find((post) => post._id === postId);
  const author = authors[authorId];
  const username = author?.username || "Unknown User";

  console.log("Current User ID:", currentUserId);
  console.log("Author ID from authors map:", authorId);
  console.log("Can edit comment:", currentUserId === authorId);

  if (!comment || !postId || !currentUserId) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 sm:p-6">
      <button className="flex justify-center items-center bg-gray-600 text-xs text-white rounded-sm py-2 px-4">
        <Link className="flex" to={"/"}>
          Back
        </Link>
      </button>
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-10 py-4 sm:py-8">
        <div className="flex flex-col w-full sm:w-2/3">
          <div className="flex flex-col basis-full sm:basis-1/2 md:basis-1/4 flex-grow">
            <div
              className={
                postDetails?.imgUrl
                  ? "flex rounded-sm h-60 sm:h-80"
                  : "flex rounded-sm"
              }
            >
              {postDetails?.imgUrl && (
                <img
                  src={`http://localhost:3002/${postDetails.imgUrl}`}
                  alt="img"
                  className="object-cover w-full h-full"
                />
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2">
            <div className="text-xs text-white opacity-50">{username}</div>
            <div className="text-xs text-white opacity-50 mt-2 sm:mt-0">
              <Moment
                date={postDetails?.createdAt || null}
                format="D MMM YYYY"
              />
            </div>
          </div>
          <div className="text-white text-xl mt-2">{postDetails?.title}</div>
          <p className="text-white opacity-60 text-xs pt-2 sm:pt-4">
            {postDetails?.text}
          </p>
        </div>

        <div className="w-full sm:w-1/3 bg-gray-700 p-4 sm:p-8 flex flex-col gap-2 rounded-sm">
          {currentUserId === authorId ? (
            <form
              className="flex flex-col gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <label className="text-xs text-white opacity-70">
                Change comment:
                <input
                  type="text"
                  name="comment"
                  value={comment || ""}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="comment"
                  className="text-black w-full rounded-sm bg-gray-400 border p-2 text-xs outline-none placeholder:text-gray-700"
                />
              </label>
            </form>
          ) : (
            <div className="text-red-500">
              You are not authorized to edit this comment.
            </div>
          )}
          {currentUserId === authorId && (
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-2">
              <button
                className="flex justify-center items-center bg-gray-500 text-xs text-white rounded-sm py-2 px-4"
                onClick={submitHandler}
              >
                Update
              </button>
              <button
                className="flex justify-center items-center bg-red-500 text-xs text-white rounded-sm py-2 px-4"
                onClick={clearFormHandler}
              >
                <Link className="flex" to={"/posts"}>
                  Cancel
                </Link>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; */
