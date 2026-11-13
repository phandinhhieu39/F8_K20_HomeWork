import api from "./api";

export const postService = {
  createPost: async (payload, isFormData = false) => {
    const config = isFormData ? { headers: { "Content-Type": undefined } } : {};
    const res = await api.post("/posts", payload, config);
    return res.data;
  },

  updatePost: async (postId, payload) => {
    const res = await api.put(`/posts/${postId}`, payload);
    return res.data;
  },

  getFeed: async (tab = "forYou", page = 1) => {
    let endpoint = "/posts/feed";
    if (tab === "following") endpoint = "/posts/following";
    else if (tab === "ghost" || tab === "disappearing")
      endpoint = "/posts/ghost";

    const response = await api.get(endpoint, {
      params: { page, limit: 10 },
    });
    return response.data;
  },

  likePost: async (postId) => {
    const res = await api.post(`/posts/${postId}/like`);
    return res.data;
  },

  unlikePost: async (postId) => {
    try {
      const res = await api.delete(`/posts/${postId}/like`);
      return res.data;
    } catch (e) {
      const res = await api.post(`/posts/${postId}/unlike`);
      return res.data;
    }
  },

  repost: async (postId) => {
    const res = await api.post(`/posts/${postId}/repost`);
    return res.data;
  },

  savePost: async (postId) => {
    const res = await api.post(`/posts/${postId}/save`);
    return res.data;
  },

  unsavePost: async (postId) => {
    try {
      const res = await api.delete(`/posts/${postId}/save`);
      return res.data;
    } catch (e) {
      const res = await api.post(`/posts/${postId}/unsave`);
      return res.data;
    }
  },

  notInterested: async (postId) => {
    const res = await api.post(`/posts/${postId}/not-interested`);
    return res.data;
  },

  reportPost: async (postId, reason) => {
    const res = await api.post(`/posts/${postId}/report`, { reason });
    return res.data;
  },

  blockUser: async (userId) => {
    const res = await api.post(`/users/${userId}/block`);
    return res.data;
  },

  muteUser: async (userId) => {
    const res = await api.post(`/users/${userId}/mute`);
    return res.data;
  },

  restrictUser: async (userId) => {
    const res = await api.post(`/users/${userId}/restrict`);
    return res.data;
  },

  deletePost: async (postId) => {
    const res = await api.delete(`/posts/${postId}`);
    return res.data;
  },
};

export default postService;
