import React, { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { AiTwotoneEdit } from "react-icons/ai";
import { useSelector, useDispatch } from "react-redux";
import { fetchAuthorById } from "../redux/features/comment/commentSlice"; // Corrected import path

export const CommentItem = ({ cmt }) => {
  const dispatch = useDispatch();
  const authors = useSelector((state) => state.comment.authors);
  const loading = useSelector((state) => state.comment.loading);
  const currentUser = useSelector((state) => state.auth.user);

  const author = useMemo(
    () => authors[cmt.author] || { username: "Anonymous" },
    [authors, cmt.author]
  );

  useEffect(() => {
    if (!authors[cmt.author]) {
      dispatch(fetchAuthorById(cmt.author));
    }
    /*  console.log("Comment data:", cmt);
    console.log("Author ID:", cmt.author);
    console.log("Authors from Redux:", authors);
    console.log("Resolved author data:", author); */
    if (!cmt.comment) {
      toast("The comment is empty");
    }
    if (!author || !author.username) {
      console.error("Author data is not available or incomplete:", author);
    } else {
      console.log("Author data is available");
    }
  }, [cmt, author, authors, dispatch]);

  const avatarText = author.username
    ? author.username.trim().toUpperCase().split("").slice(0, 2)
    : cmt.comment.trim().toUpperCase().split("").slice(0, 2);

  if (!cmt.comment) {
    console.error("CommentItem: Empty comment detected!", cmt);
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center justify-center shrink-0 rounded-full w-10 h-10 bg-blue-300 text-sm">
        {avatarText}
      </div>
      <div className="flex items-center justify-start px-1 py-0.5 shrink-0 rounded-0 bg-gray-600 text-[8px] text-white">
        {loading ? "Loading..." : author.username || "Unknown"}
      </div>
      <div className="flex text-gray-300 text-[10px]">{cmt.comment}</div>
      {currentUser && currentUser._id === cmt.author && (
        <button className="flex items-center justify-center gap-2 text-white opacity-50">
          <Link to={`/${cmt._id}/editcomment`}>
            <AiTwotoneEdit />
          </Link>
        </button>
      )}
    </div>
  );
};
