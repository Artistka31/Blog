import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { PostItem } from "../components/PostItem";
import { PopularPosts } from "../components/PopularPosts";
import { getAllPosts } from "../redux/features/post/postSlice";

export const MainPage = () => {
  const dispatch = useDispatch();
  const { posts, popularPosts } = useSelector((state) => state.post);

  useEffect(() => {
    dispatch(getAllPosts());
  }, [dispatch]);

  if (!posts.length) {
    <div className="text-xl text-center text-white py-10">
      Posts don't exist
    </div>;
  }
  return (
    <div className="max-w-[60em] mx-auto py-10 sm:px-6">
      <div className="flex flex-col sm:flex-row justify-between gap-8">
        <div className="flex flex-col gap-10 basis-4/5">
          {posts?.map((post, idx) => (
            <PostItem key={idx} post={post} />
          ))}
        </div>
        <div className="basis-1/5">
          <div className="text-xs uppercase text-white">Popular:</div>
          {popularPosts?.map((post, idx) => (
            <PopularPosts key={idx} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};
