export const Get = async (endpoint: string): Promise<Response> =>
  fetch(endpoint, {
    method: "GET",
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
    redirect: "follow",
    referrerPolicy: "no-referrer",
  });

export const Post = async (endpoint: string, data: any = null): Promise<Response> =>
  fetch(endpoint, {
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

export const Put = async (endpoint: string, data: any = null): Promise<Response> =>
  fetch(endpoint, {
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

export const Delete = async (endpoint: string, data: any = null): Promise<Response> =>
  fetch(endpoint, {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache",
    credentials: "include",
    redirect: "follow",
    referrerPolicy: "no-referrer",
    body: data,
  });
