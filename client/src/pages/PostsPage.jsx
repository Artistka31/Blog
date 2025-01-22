import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import { PostItem } from "../components/PostItem";

export const PostsPage = () => {
  const [posts, setPosts] = useState([]);
  const fetchMyPosts = async () => {
    try {
      const { data } = await axios.get("/posts/user/me");
      setPosts(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchMyPosts();
  }, []);

  return (
    <div className="max-w-[45em] mx-auto py-10 flex flex-col gap-10 sm:px-6">
      {posts?.map((post, idx) => (
        <PostItem post={post} key={idx} />
      ))}
    </div>
  );
};
