// 保存されたテーマを描画前に適用し、切り替えボタンを有効化する。
// data-theme 未設定時は OS の設定 (prefers-color-scheme) に追従する。
(function () {
  var KEY = "theme";
  var root = document.documentElement;
  var media = window.matchMedia("(prefers-color-scheme: dark)");

  // ちらつきを避けるため、ここは head 内で同期的に実行する
  try {
    var saved = localStorage.getItem(KEY);
    if (saved === "light" || saved === "dark") {
      root.setAttribute("data-theme", saved);
    }
  } catch (e) {
    // プライベートウィンドウ等で localStorage が使えない場合は OS 設定に従う
  }

  function isDark() {
    var explicit = root.getAttribute("data-theme");
    return explicit ? explicit === "dark" : media.matches;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var button = document.getElementById("theme-toggle");
    if (!button) {
      return;
    }

    function sync() {
      var dark = isDark();
      button.textContent = dark ? "☀" : "☾";
      button.setAttribute(
        "aria-label",
        dark ? "ライトテーマに切り替え" : "ダークテーマに切り替え"
      );
    }

    function toggle() {
      var next = isDark() ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try {
        localStorage.setItem(KEY, next);
      } catch (e) {
        // 保存できなくても、このページ内では切り替わる
      }
      sync();
    }

    button.addEventListener("click", toggle);
    media.addEventListener("change", sync);

    // JavaScript が動く環境でのみボタンを見せる
    button.removeAttribute("hidden");
    sync();
  });
})();
