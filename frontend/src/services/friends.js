const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export async function getFriendsForUser(token) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${BACKEND_URL}/friends`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to get friends");
  }

  const data = await response.json();
  return data;
}

export async function getUnapprovedFriendsForUser(token) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${BACKEND_URL}/friends/requests`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to get friends");
  }

  const data = await response.json();
  return data;
}

export async function sendFriendRequest(token, username) {
  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ receiver: username }),
  };

  const response = await fetch(`${BACKEND_URL}/friends/request`, requestOptions);

  if (response.status !== 201 && response.status !== 200) {
    throw new Error("Unable to get friends");
  }

  const data = await response.json();
  return data;
}
export async function getFriendsForAnotherUser(token, username) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${BACKEND_URL}/friends/${username}`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to get friends");
  }

  const data = await response.json();
  return data;
}

export async function getUnapprovedFriendsForAnotherUser(token, username) {
  const requestOptions = {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const response = await fetch(`${BACKEND_URL}/friends/${username}/requests`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to get friends");
  }

  const data = await response.json();
  return data;
}


export async function deleteFriend(token, request_id) {
  const requestOptions = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  };
  const response = await fetch(`${BACKEND_URL}/friends/${request_id}`, requestOptions);

  if (response.status !== 200) {
    throw new Error("Unable to delete friend");
  }
}

export async function approveFriendRequest(token, friendRequestId) {
  const requestOptions = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ request_id: friendRequestId }),
  };

  const response = await fetch(`${BACKEND_URL}/friends/${friendRequestId}`, requestOptions);
  if (response.status !== 200) {
    throw new Error("Friend request approval did not work");
  }

  return response;
}