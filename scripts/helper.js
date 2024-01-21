export function formatDate(updatedAt) {
  const now = new Date();
  const updatedDate = new Date(updatedAt);
  const timeDiff = now - updatedDate;
  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);

  if (weeks > 0 && weeks < 5) {
    return `Updated ${weeks === 1 ? "1 week" : `${weeks} weeks`} ago`;
  } else if (days > 0 && days < 7) {
    return `Updated ${days === 1 ? "1 day" : `${days} days`} ago`;
  } else if (hours > 0 && hours < 24) {
    return `Updated ${hours === 1 ? "1 hour" : `${hours} hours`} ago`;
  } else if (minutes > 0 && minutes < 60) {
    return `Updated ${minutes === 1 ? "1 minute" : `${minutes} minutes`} ago`;
  } else {
    const options = { month: "long", day: "numeric", year: "numeric" };
    const formattedDate = updatedDate.toLocaleDateString(undefined, options);
    return `Updated on ${formattedDate}`;
  }
}

export function displayLoader(state) {
  const loader = document.querySelector(".loader");
  loader.style.display = state;
}
export function displayErrorMessage(errorMessage) {
  const userInfo = document.querySelector(".user__info");
  const userRepo = document.querySelector(".user__repos");
  userInfo.innerHTML = "";
  userRepo.innerHTML = "";
  userInfo.innerHTML = `<div class="error">${errorMessage}</div>`;
}

export function advancedPagination(page, totalPages) {
  let active = page,
    beforePage = page - 1,
    afterPage = page + 1;
  let paginationButtons = "";
  if (totalPages <= 6) {
    paginationButtons = [...Array(totalPages)]
      .map(
        (_, i) =>
          `<button key=${i} data-page=${i + 1}  ${
            i + 1 === page ? 'class="selected"' : ""
          }>${i + 1}</button>`
      )
      .join("");
  } else {
    if (active < 5) {
      beforePage = 1;
      afterPage = 5;
    } else if (active > totalPages - 4) {
      beforePage = totalPages - 4;
      afterPage = totalPages;
      paginationButtons += `<button key=${1} data-page=${1}  ${
        page === 1 ? 'class="selected"' : ""
      }>1</button><span>...</span>`;
    } else {
      beforePage = active - 1;
      afterPage = active + 1;
      paginationButtons += `<button key=${1} data-page=${1}  ${
        page === 1 ? 'class="selected"' : ""
      }>1</button><span class="dots">...</span>`;
    }
    for (let i = beforePage; i <= afterPage; i++)
      paginationButtons += `<button key=${i} data-page=${i}  ${
        i === page ? 'class="selected"' : ""
      }>${i}</button>`;

    if (active == 1 || active <= totalPages - 4)
      paginationButtons += `<span class="dots">...</span> <button key=${totalPages} data-page=${totalPages}  ${
        page === totalPages ? 'class="selected"' : ""
      }>${totalPages}</button>`;
  }
  return paginationButtons;
}
