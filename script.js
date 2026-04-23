(function () {
  if (window.__AUTO__) return;
  window.__AUTO__ = true;

  let running = false;
  let targets = [];

  const KEY = "A1B2C3-RAHUL";

  // ===== UI =====
  const box = document.createElement("div");
  box.style = `
    position:fixed;
    bottom:20px;
    right:20px;
    width:260px;
    background:#fff;
    color:#000;
    padding:15px;
    border-radius:14px;
    z-index:999999;
    font-family:sans-serif;
    box-shadow:0 5px 20px rgba(0,0,0,0.3);
  `;

  box.innerHTML = `
    <div style="display:flex;justify-content:space-between;margin-bottom:10px;">
      <b>AR Wallet</b>
      <span id="light" style="width:12px;height:12px;border-radius:50%;background:red;"></span>
    </div>

    <input id="amount" value="1000" readonly style="
      width:100%;
      padding:8px;
      border-radius:8px;
      border:1px solid #ccc;
      margin-bottom:10px;
    " />

    <div style="display:flex;gap:10px;">
      <button id="start" style="flex:1;background:#22c55e;color:#fff;border:none;padding:8px;border-radius:10px;">Start</button>
      <button id="stop" style="flex:1;background:#ef4444;color:#fff;border:none;padding:8px;border-radius:10px;">Stop</button>
    </div>

    <div id="status" style="margin-top:10px;text-align:center;">Checking...</div>
  `;

  document.body.appendChild(box);

  const status = document.getElementById("status");
  const light = document.getElementById("light");

  const sleep = ms => new Promise(r => setTimeout(r, ms));

  function removeUI() { box.remove(); }

  function beep() {
    new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg").play();
  }

  // ===== ACCESS =====
  let allowed = false;

  async function checkAccess() {
    try {
      const res = await fetch(`https://access-server.onrender.com/check?key=${KEY}`);
      const data = await res.json();
      allowed = data.access;

      if (allowed) {
        status.innerText = "Active";
        status.style.color = "green";
        light.style.background = "lime";
      } else {
        status.innerText = "Access Denied";
        status.style.color = "red";
      }
    } catch {
      status.innerText = "Server Error";
      status.style.color = "orange";
    }
  }

  checkAccess();

  // ===== CLICK DEFAULT =====
  function clickDefault() {
    document.querySelectorAll("p, div, span").forEach(el => {
      if (el.innerText.trim() === "Default") el.click();
    });
  }

  // ===== GET EXACT AMOUNT =====
  function getAmount(el) {
    const amtEl = el.querySelector(".amount");
    if (!amtEl) return null;

    const match = amtEl.innerText.match(/\d+/);
    return match ? match[0] : null;
  }

  function findTargets() {
    return Array.from(document.querySelectorAll(".ml10")).filter(el => {
      const amt = getAmount(el);
      return amt && targets.includes(amt);
    });
  }

  function highlight(el) {
    el.style.outline = "3px solid red";
  }

  function findBuy(row) {
    let current = row;
    while (current && current !== document.body) {
      const btn = current.querySelector(".van-button--primary");
      if (btn) return btn;
      current = current.parentElement;
    }
    return null;
  }

  // ===== MOVE MATCHES TO TOP =====
  function moveMatchesToTop(rows) {
    const parent = rows[0]?.parentElement;
    if (!parent) return;

    rows.reverse().forEach(row => {
      parent.prepend(row);
    });
  }

  // ===== CLICK FIRST MATCH ONLY =====
  async function clickTargets(rows) {
    const row = rows[0];
    if (!row) return false;

    highlight(row);

    const btn = findBuy(row);
    if (btn) {
      btn.click();

      if (document.body.innerText.includes("Select Payment Method")) {
        beep();
        running = false;
        removeUI();
        return true;
      }
    }
    return false;
  }

  // ===== MAIN LOOP =====
  async function loop() {
    while (running) {

      if (document.body.innerText.includes("Select Payment Method")) {
        beep();
        running = false;
        removeUI();
        return;
      }

      clickDefault();

      const rows = findTargets();

      if (rows.length > 0) {

        // move correct results to top
        moveMatchesToTop(rows);

        // hide others
        document.querySelectorAll(".ml10").forEach(el => {
          const amt = getAmount(el);
          el.style.display = (amt && targets.includes(amt)) ? "" : "none";
        });

        let success = await clickTargets(rows);
        if (success) return;
      }

      await sleep(1000); // ONLY delay
    }
  }

  // ===== BUTTONS =====
  document.getElementById("start").onclick = () => {
    if (!allowed) {
      status.innerText = "Access Denied";
      return;
    }

    targets = [document.getElementById("amount").value.trim()];
    running = true;

    status.innerText = "Running";
    light.style.background = "lime";

    loop();
  };

  document.getElementById("stop").onclick = () => {
    running = false;
    status.innerText = "Stopped";
    light.style.background = "red";
  };

})();
