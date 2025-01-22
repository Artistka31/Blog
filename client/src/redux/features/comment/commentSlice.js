import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../../utils/axios";

const initialState = {
  comments: [],
  loading: false,
  error: null,
  authors: {},
};

export const createComment = createAsyncThunk(
  "comment/createComment",
  async ({ postId, comment, author }, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(`/comments/${postId}`, {
        postId,
        comment,
        author,
      });
      return data;
    } catch (error) {
      console.error("Error creating comment:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const getPostComments = createAsyncThunk(
  "comment/getPostComments",
  async (postId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/posts/comments/${postId}`);
      const { comments, authors } = data; // Extract comments and authors from response
      return { comments, authors };
    } catch (error) {
      console.error("Error fetching post comments:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const fetchAuthorById = createAsyncThunk(
  "comment/fetchAuthorById",
  async (authorId, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`/authors/${authorId}`);
      console.log("Fetched author data:", data);
      return data;
    } catch (error) {
      console.error("Error fetching author:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const getCommentById = createAsyncThunk(
  "comment/getCommentById",
  async (id, { rejectWithValue }) => {
    try {
      const { data: commentData } = await axios.get(`/comments/${id}`);
      console.log("Fetched comment data:", commentData);

      const authorData = await fetchAuthorById(commentData.author);
      console.log("Fetched author data:", authorData);

      return { ...commentData, author: authorData };
    } catch (error) {
      console.error("Error fetching comment by ID:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

export const updateComment = createAsyncThunk(
  "comment/updateComment",
  async ({ id, comment, author }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(`/comments/${id}`, { comment, author });
      return data;
    } catch (error) {
      console.error("Error updating comment:", error);
      return rejectWithValue(error.response.data);
    }
  }
);

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.comments.push(action.payload);
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getPostComments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPostComments.fulfilled, (state, action) => {
        const { comments, authors } = action.payload;
        state.loading = false;
        state.comments = comments;
        state.authors = authors;
        console.log("Redux state after comments fetch:", state);
      })
      .addCase(getPostComments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(fetchAuthorById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAuthorById.fulfilled, (state, action) => {
        state.loading = false;
        const author = action.payload;
        state.authors[author._id] = author;
      })
      .addCase(fetchAuthorById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getCommentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCommentById.fulfilled, (state, action) => {
        const { comment, author } = action.payload;

        const existingCommentIndex = state.comments.findIndex(
          (cmt) => cmt._id === comment._id
        );
        if (existingCommentIndex === -1) {
          state.comments.push({ ...comment, author });
        } else {
          state.comments[existingCommentIndex] = { ...comment, author };
        }

        state.authors[author._id] = author;

        console.log("Redux state after comment fetch:", state);
      })
      .addCase(getCommentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    builder
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false;
        const updatedComments = state.comments.map((comment) =>
          comment && comment._id === action.payload._id
            ? action.payload
            : comment
        );
        state.comments = updatedComments;
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default commentSlice.reducer;
