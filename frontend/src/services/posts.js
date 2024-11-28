// docs: https://vitejs.dev/guide/env-and-mode.html
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getPosts(token) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${BACKEND_URL}/posts`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to fetch posts");
  }

  const data = await response.json();
  return data;
}

export async function CreatePost(token, body) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message: body }),
  };

  const response = await fetch(`${BACKEND_URL}/posts`, requestOptions);
  // console.log(response)
  if (response.status !== 201) {
    throw new Error("Unable to create post");
  }

  return response;
}

export async function UpdatePost(token, body, post_id, isYours) {
  const requestOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message: body, isYours: isYours }),
  };

  const response = await fetch(`${BACKEND_URL}/posts/${post_id}`, requestOptions);
  if (response.status !== 200) {
    throw new Error("Unable to update post");
  }

  return response;
}

export async function deletePostId(token, post_id, body) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({isYours: body})
  };
  const response = await fetch(`${BACKEND_URL}/posts/${post_id}`, requestOptions);
  // console.log(response)
  if (response.status !== 200) {
    throw new Error("Unable to delete post");
  }
}

export async function likePost(token, post_id) {
  const requestOptions = {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`
    },
  };

  const response = await fetch(`${BACKEND_URL}/posts/${post_id}/like`, requestOptions);

  const data = await response.json();
  return data;
}

export async function getYourPosts(token) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${BACKEND_URL}/posts/mine`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to fetch posts");
  }

  const data = await response.json();
  return data;
}
