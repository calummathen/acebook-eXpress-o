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

  if (response.status !== 201) {
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