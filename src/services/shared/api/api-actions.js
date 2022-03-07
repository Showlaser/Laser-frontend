export const Get = async (endpoint) => {
  try {
    return await fetch(endpoint, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });
  } catch (error) {
    return error;
  }
};

export const Post = async (endpoint, data = null) => {
  try {
    return await fetch(endpoint, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
  } catch (error) {
    return error;
  }
};

export const Put = async (endpoint, data = null) => {
  try {
    return await fetch(endpoint, {
      method: "PUT",
      mode: "cors",
      cache: "no-cache",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
  } catch (error) {
    return error;
  }
};

export const Delete = async (endpoint, data = null) => {
  try {
    return await fetch(endpoint, {
      method: "DELETE",
      mode: "cors",
      cache: "no-cache",
      credentials: "include",
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: data,
    });
  } catch (error) {
    return error;
  }
};
