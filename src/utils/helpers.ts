export const postData = async ({ url, data }: { url: string; data?: any }) => {
  const res = await fetch(url, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    credentials: "same-origin",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    console.log("Error in postData", { url, data, res });

    throw Error(res.statusText);
  }

  return res.json();
};

export const getData = async ({ url }: { url: string }) => {
  console.log("getting,", url);

  const res = await fetch(url, {
    method: "GET",
    credentials: "same-origin",
  });

  if (!res.ok) {
    console.log("Error in getData", { url, res });

    throw Error(res.statusText);
  }

  return res.json();
};
