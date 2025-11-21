export const showFlashGlobal = (message, type = "info", duration = 5000) => {
  window.dispatchEvent(
    new CustomEvent("global-flash", { detail: { message, type, duration } })
  );
};
