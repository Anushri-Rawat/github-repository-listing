import {
  formatDate,
  advancedPagination,
  displayLoader,
} from "./scripts/helper.js";
import { getPageData, getUser } from "./api/index.js";

(() => {
  const input = document.querySelector("#searchUser");
  const searchBtn = document.querySelector(".search-btn");
  const reposPerPageSelect = document.getElementById("reposPerPage");
  const pagination = document.querySelector(".pagination");
  const userInfo = document.querySelector(".user__info");
  const userRepo = document.querySelector(".user__repos");

  let reposPerPage = parseInt(reposPerPageSelect.value, 10),
    page = 1,
    totalRepos = 1;

  // search user functionality
  searchBtn.addEventListener("click", async function () {
    displayLoader("flex");
    try {
      if (!input.value.trim()) {
        throw new Error("Please enter a valid username");
      }
      const res = await getUser(input.value);

      const data = await res.json();
      if (res.status !== 200) {
        throw new Error("User not found");
      }
      displayLoader("none");
      page = 1;
      displayUserInfo(data);
      totalRepos = data.public_repos;
      handlePageChange(page);
    } catch (err) {
      displayLoader("none");
      displayErrorMessage(err.message);
    }
  });

  //change repos per page
  reposPerPageSelect.addEventListener("change", function () {
    reposPerPage = parseInt(reposPerPageSelect.value, 10);
    handlePageChange(page, totalRepos);
  });

  //pagination logic
  pagination.addEventListener("click", function (e) {
    if (e.target.tagName.toLowerCase() === "button") {
      let currPage = parseInt(e.target.dataset.page);
      if (!isNaN(currPage)) {
        page = currPage;
        handlePageChange(currPage, totalRepos);
      } else if (e.target.id === "prevBtn" && page > 1) {
        handlePageChange(page - 1, totalRepos);
      } else if (
        e.target.id === "nextBtn" &&
        page < Math.ceil(totalRepos / reposPerPage)
      ) {
        handlePageChange(page + 1, totalRepos);
      }
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  });

  async function handlePageChange(idx) {
    displayLoader("flex");
    try {
      page = idx;
      if (page > Math.ceil(totalRepos / reposPerPage)) page = 1;
      const res = await getPageData(input.value, page, reposPerPage);
      const data = await res.json();
      if (res.status !== 200) {
        throw new Error("An error occured while fetching the repositories.");
      }
      displayLoader("none");
      displayUserRepos(data);
      displayPagination();
    } catch (err) {
      displayLoader("none");
      fetchErrorMessage(err.message);
    }
  }
  function displayPagination() {
    const totalPages = Math.ceil(totalRepos / reposPerPage);
    let advancedPaginationButtons = advancedPagination(page, totalPages);

    pagination.innerHTML = `${
      page > 1
        ? `<button id="prevBtn"><i class="fa-solid fa-arrow-left"></i></button>`
        : ""
    }${advancedPaginationButtons}${
      page < totalPages
        ? `<button id="nextBtn"><i class="fa-solid fa-arrow-right"></i></button>`
        : ""
    }`;
  }

  function displayUserInfo(user) {
    userInfo.innerHTML = "";
    userInfo.innerHTML = `<img src=${user.avatar_url} alt=${user.login}/>
      <div class="user__info--details">
      <h2 class="user__info--title">${user.name ?? user.login}</h2>
      <p style="margin:10px 0 5px">${user.bio ? user.bio : "No Bio"}</p>
      <div class="user__info--followers">
      <i class="fa-solid fa-user-group"></i>
      <span>${user.followers} followers</span>
      <span>${user.following} following</span>
      </div>
      ${
        user.company
          ? `<span><i class="fa-regular fa-building" style="padding: 0 3px 0 2px"></i>${user.company}</span>`
          : ""
      }
        ${
          user.location
            ? `<span><i class="fa fa-map-marker" aria-hidden="true" style="padding: 0 3px 0 2px"></i>${user.location}</span>`
            : ""
        }
        ${
          user.twitter_username
            ? `<span><i class="fa-brands fa-twitter" style="padding: 0 2px 0 1px"></i><a href=https://twitter.com/${user.twitter_username}>https://twitter.com/${user.twitter_username}</a></span>`
            : ""
        }
        ${
          user.html_url
            ? `<span><i class="fa-solid fa-link"></i><a href=${user.html_url}>${user.html_url}</a></span>`
            : ""
        }
      </div>`;
  }
  function displayUserRepos(repos) {
    userRepo.innerHTML = "";
    repos.forEach((repo) => {
      let topicsHTML = "";
      if (repo.topics.length > 0) {
        topicsHTML = repo.topics
          .map((item, i) => `<span class="tags" key=${i}>${item}</span>`)
          .join("");
      } else if (repo.language) {
        topicsHTML = `<span class="tags" key="150">${repo.language}</span>`;
      }

      userRepo.innerHTML += `<div class="user__repos__repo">
            <div class="user__repos__repo--header">
            <a href=${repo.html_url} class="user__repos__repo--title">${
        repo.name
      }</a>
                <span class="user__repos__repo--type">${
                  repo.visibility
                }</span></div>
            ${
              repo.description
                ? `<p style="margin-bottom:8px">${
                    repo.description.length > 100
                      ? repo.description.slice(0, 100) + "..."
                      : repo.description
                  }</p>`
                : ""
            }
            <div class="tags-container">${topicsHTML}</div>
            <div class="user__repos__repo--footer">
            ${
              repo.language
                ? `<div style="font-weight:600;margin-right:10px;"><span style="margin-right:3px;">Lang:</span>${repo.language}</div>`
                : ""
            }
            <span>${formatDate(repo.updated_at)}</span>
            </div>
          </div>`;
    });
  }
})();

//
