async function initBoard() {
  await checkIfUserLoggedIn();
  await init('board')
  changeImageOnHover(
    "deleteBtnImage",
    "../assets/img/boardDeleteTaskBrightBlue.svg",
    "../assets/img/boardDeleteTaskDarkBlue.svg"
  );
}

function showEditTask(id, animationClass, className) {
  toggleClass(id, className);
  playAnimation(id, animationClass);
  toggleBlurFilter();
}

function hideEditTask(id, className) {
  toggleClass(id, className);
  toggleBlurFilter();
}
