// サブページ用共通カラー＆秒単位カウントダウン同期処理
function adjustColor(hex, percent) {
  let num = parseInt(hex.replace("#", ""), 16),
    amt = Math.round(2.55 * percent),
    R = (num >> 16) + amt,
    G = ((num >> 8) & 0x00ff) + amt,
    B = (num & 0x0000ff) + amt;
  return (
    "#" +
    (
      0x1000000 +
      (R < 255 ? (R < 0 ? 0 : R) : 255) * 0x10000 +
      (G < 255 ? (G < 0 ? 0 : G) : 255) * 0x100 +
      (B < 255 ? (B < 0 ? 0 : B) : 255)
    )
      .toString(16)
      .slice(1)
  );
}

function hexToRgba(hex, alpha) {
  let r = parseInt(hex.slice(1, 3), 16),
    g = parseInt(hex.slice(3, 5), 16),
    b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

window.addEventListener("DOMContentLoaded", () => {
  const savedTitle = localStorage.getItem("oshi_trip_title") || "Oshi Live Board";
  const savedDate = localStorage.getItem("oshi_trip_date");
  const savedColor = localStorage.getItem("oshi_color") || "#f2d1c9";

  // タイトル表示同期
  const titleDisplay = document.getElementById("app-title-display");
  if (titleDisplay) titleDisplay.innerText = savedTitle;

  // リアルタイムカウントダウン（秒単位）
  if (savedDate) {
    const targetDate = new Date(savedDate);
    targetDate.setHours(0, 0, 0, 0);

    const timerSpan = document.getElementById("countdown-timer");

    if (timerSpan) {
      function refreshSubTimer() {
        const now = new Date();
        const diff = targetDate.getTime() - now.getTime();

        if (diff <= 0) {
          const isSameDay = now.toDateString() === targetDate.toDateString();
          if (isSameDay) {
            timerSpan.innerHTML = "<strong>本日開催！🔥</strong>";
          } else {
            timerSpan.innerHTML = "<strong>無事終了✨</strong>";
          }
          clearInterval(subTimerInterval);
          return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        const formatSec = String(seconds).padStart(2, "0");
        const formatMin = String(minutes).padStart(2, "0");
        const formatHrs = String(hours).padStart(2, "0");

        timerSpan.innerHTML = `まで あと <strong>${days}</strong>日 <strong>${formatHrs}</strong>:<strong>${formatMin}</strong>:<strong>${formatSec}</strong>`;
      }

      refreshSubTimer();
      const subTimerInterval = setInterval(refreshSubTimer, 1000);
    }
  }

  // カラーパレットから選ばれたテーマ色の適応
  const darkColor = adjustColor(savedColor, -15);
  const tapeColor = hexToRgba(savedColor, 0.7);
  document.documentElement.style.setProperty("--theme-main", savedColor);
  document.documentElement.style.setProperty("--theme-dark", darkColor);
  document.documentElement.style.setProperty("--theme-tape", tapeColor);
});

// 🚀【追加：サブページ用のモーダル開閉＆設定保存プログラム】

// モーダルを開く
function openSetupModal() {
  const modal = document.getElementById("setup-modal");
  if (modal) {
    // 現在保存されている値を入力欄にセットする
    const savedTitle = localStorage.getItem("oshi_trip_title") || "Oshi Live Board";
    const savedDate = localStorage.getItem("oshi_trip_date") || "";
    const savedColor = localStorage.getItem("oshi_color") || "#f2d1c9";

    document.getElementById("input-title").value = savedTitle;
    document.getElementById("input-date").value = savedDate;
    document.getElementById("input-color").value = savedColor;

    modal.classList.add("setup-active");
  }
}

// モーダルを閉じる
function closeSetupModal() {
  const modal = document.getElementById("setup-modal");
  if (modal) {
    modal.classList.remove("setup-active");
  }
}

// 設定を保存する
function saveSettings() {
  const titleInput = document.getElementById("input-title").value;
  const dateInput = document.getElementById("input-date").value;
  const colorInput = document.getElementById("input-color").value;

  if (!dateInput) {
    alert("参戦する日を選んでね！");
    return;
  }

  // データをブラウザに記憶
  localStorage.setItem("oshi_trip_title", titleInput);
  localStorage.setItem("oshi_trip_date", dateInput);
  localStorage.setItem("oshi_color", colorInput);

  // 画面に即時反映して、モーダルを閉じる
  if (document.getElementById("app-title-display")) {
    document.getElementById("app-title-display").innerText = titleInput;
  }

  // カラーを即時反映
  const darkColor = adjustColor(colorInput, -15);
  const tapeColor = hexToRgba(colorInput, 0.7);
  document.documentElement.style.setProperty("--theme-main", colorInput);
  document.documentElement.style.setProperty("--theme-dark", darkColor);
  document.documentElement.style.setProperty("--theme-tape", tapeColor);

  closeSetupModal();

  // ページ全体をリロードしてタイマーなども最新の状態にする
  location.reload();
}
