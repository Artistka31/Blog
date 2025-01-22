import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AiFillEye,
  AiFillMessage as MessengerIcon,
  AiTwotoneEdit,
  AiFillDelete,
} from "react-icons/ai";
import Moment from "react-moment";
import axios from "../utils/axios";
import { Link, useNavigate, useParams } from "react-router-dom";
import { removePost } from "../redux/features/post/postSlice";
import { toast } from "react-toastify";
import {
  createComment,
  getPostComments,
} from "../redux/features/comment/commentSlice";
import { CommentItem } from "../components/CommentItem";

export const PostPage = () => {
  const [post, setPost] = useState(null);
  const [comment, setComment] = useState("");

  const { user } = useSelector((state) => state.auth);
  const { comments } = useSelector((state) => state.comment);
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();

  const removePostHandler = () => {
    try {
      dispatch(removePost(params.id));
      toast("The post was deleted");
      navigate("/posts");
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = () => {
    try {
      const postId = params.id;
      const author = user?._id;
      if (!comment.trim()) {
        toast("Comment cannot be empty");
        return;
      }

      dispatch(createComment({ postId, comment, author }));
      setComment("");
    } catch (error) {
      console.log(error);
    }
  };

  const fetchComments = useCallback(async () => {
    try {
      dispatch(getPostComments(params.id));
    } catch (error) {
      console.log(error);
    }
  }, [params.id, dispatch]);

  const fetchPost = useCallback(async () => {
    const { data } = await axios.get(`/posts/${params.id}`);
    setPost(data);
  }, [params.id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  if (!post) {
    return (
      <div className="text-xl text-center text-white py-10">Загрузка...</div>
    );
  }

  return (
    <div className="p-4 sm:p-6">
      <button className="post-button flex justify-center items-center bg-gray-600 text-xs text-white rounded-sm py-2 px-4">
        <Link className="flex" to={"/posts"}>
          Back
        </Link>
      </button>
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-10 py-4 sm:py-8">
        <div className="flex flex-col w-full sm:w-2/3 relative">
          <div className="flex flex-col basis-full sm:basis-1/2 md:basis-1/4 flex-grow">
            <div
              className={
                post?.imgUrl
                  ? "flex rounded-sm h-60 sm:h-80"
                  : "flex rounded-sm"
              }
            >
              {post?.imgUrl && (
                <img
                  src={`http://localhost:3002/${post.imgUrl}`}
                  alt="img"
                  className="object-cover w-full h-full"
                />
              )}
            </div>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pt-2">
            <div className="text-xs text-white opacity-50">{post.username}</div>
            <div className="text-xs text-white opacity-50 mt-2 sm:mt-0">
              <Moment date={post.createdAt} format="D MMM YYYY" />
            </div>
          </div>
          <div className="text-white text-xl mt-2">{post.title}</div>
          <p className="text-white opacity-60 text-xs pt-2 sm:pt-4">
            {post.text}
          </p>

          <div className="flex gap-3 items-start sm:items-center mt-2 sm:mt-4">
            <div className="flex gap-3 mt-2">
              <button className="flex items-center justify-center gap-2 text-xs text-white opacity-50">
                <AiFillEye /> <span>{post.views || 0}</span>
              </button>
              <button className="flex items-center justify-center gap-2 text-xs text-white opacity-50">
                <MessengerIcon /> <span>{post.comments?.length || 0}</span>
              </button>
            </div>

            {user?._id === post.author && (
              <div className="flex gap-3 mt-2">
                <button className="flex items-center justify-center gap-2 text-white opacity-50">
                  <Link to={`/${params.id}/edit`}>
                    <AiTwotoneEdit />
                  </Link>
                </button>
                <button
                  onClick={removePostHandler}
                  className="flex items-center justify-center gap-2 text-white opacity-50"
                >
                  <AiFillDelete />
                </button>
              </div>
            )}
          </div>
        </div>
        <div className="w-full sm:w-1/3 p-4 sm:p-8 bg-gray-700 flex flex-col gap-2 rounded-sm">
          <form
            className="flex gap-2 flex-col sm:flex-row"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="comment"
              className="text-black w-full rounded-sm bg-gray-400 border p-2 text-xs outline-none placeholder:text-gray-700"
            />
            <button
              type="submit"
              onClick={handleSubmit}
              className="post-button flex justify-center items-center text-xs text-white rounded-sm bg-gray-600 py-2 sm:py-4 px-2 sm:px-4"
            >
              Send
            </button>
          </form>

          {Array.isArray(comments) &&
            comments.map((cmt) =>
              cmt ? <CommentItem key={cmt._id} cmt={cmt} /> : null
            )}
        </div>
      </div>
    </div>
  );
};
