export const Get = async (endpoint, getWithCredentials = false) => {
  try {
    return await fetch(endpoint, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
      credentials: getWithCredentials ? "include" : "same-origin",
      redirect: "follow",
      referrerPolicy: "no-referrer",
    });
  } catch (error) {
    return error;
  }
};

export const Post = async (
  endpoint,
  data = null,
  postWithCredentials = false
) => {
  try {
    return await fetch(endpoint, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: postWithCredentials
        ? {}
        : {
            "Content-Type": postWithCredentials
              ? "multipart/form-data"
              : "application/json",
          },
      credentials: postWithCredentials ? "include" : "same-origin",
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: postWithCredentials ? data : JSON.stringify(data),
    });
  } catch (error) {
    return error;
  }
};

export const Put = async (
  endpoint,
  data = null,
  putWithCredentials = false
) => {
  try {
    return await fetch(endpoint, {
      method: "PUT",
      mode: "cors",
      cache: "no-cache",
      headers: putWithCredentials
        ? {}
        : {
            "Content-Type": putWithCredentials
              ? "multipart/form-data"
              : "application/json",
          },
      credentials: putWithCredentials ? "include" : "same-origin",
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: JSON.stringify(data),
    });
  } catch (error) {
    return error;
  }
};

export const Delete = async (
  endpoint,
  data = null,
  deleteWithCredentials = false
) => {
  try {
    return await fetch(endpoint, {
      method: "DELETE",
      mode: "cors",
      cache: "no-cache",
      credentials: deleteWithCredentials ? "include" : "same-origin",
      redirect: "follow",
      referrerPolicy: "no-referrer",
      body: data,
    });
  } catch (error) {
    return error;
  }
};
