export const getUser = async (name) => {
  let user = await fetch(`https://api.github.com/users/${name}`, {
    method: "GET",
    mode: "cors",
  });
  return user;
};

export const getPageData = async (name, page, limit) => {
  const data = await fetch(
    `https://api.github.com/users/${name}/repos?per_page=${limit}&page=${page}`,
    {
      method: "GET",
      mode: "cors",
    }
  );
  return data;
};
