const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function CreateComment(token, body, post_id) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message: body }),
  };

  const response = await fetch(`${BACKEND_URL}/comments/${post_id}`, requestOptions);

  if (response.status !== 201) {
    throw new Error("Unable to create comment");
  }

  return response;
}

export async function getCommentsforPost(token, post_id) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${BACKEND_URL}/comments/${post_id}`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to fetch comments");
  }

  const data = await response.json();
  return data;
}

export async function UpdateComment(token, body, comment_id, isYours) {
  const requestOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message: body, isYours: isYours }),
  };

  const response = await fetch(`${BACKEND_URL}/comments/${comment_id}`, requestOptions);
  if (response.status !== 200) {
    throw new Error("Unable to update comment");
  }

  return response;
}

export async function deleteComment(token, comment_id, body) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({isYours: body})
  };
  const response = await fetch(`${BACKEND_URL}/comments/${comment_id}`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to delete comment");
  }
}

export async function likeComment(token, comment_id) {
  const requestOptions = {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`
    },
  };

  const response = await fetch(`${BACKEND_URL}/comments/${comment_id}/like`, requestOptions);

  const data = await response.json();
  return data;
}