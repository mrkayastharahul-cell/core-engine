(function () {
  if (window.__AUTO__) return;
  window.__AUTO__ = true;

  let running = false;
  let targets = [];

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
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
      <b>AR Wallet</b>
      <span id="light" style="width:12px;height:12px;border-radius:50%;background:red;"></span>
    </div>

    <input id="amount" value="1000" style="
      width:100%;
      padding:8px;
      border-radius:8px;
      border:1px solid #ccc;
      margin-bottom:10px;
      font-size:14px;
    " />

    <div style="display:flex;gap:10px;">
      <button id="start" style="flex:1;background:#22c55e;color:#fff;border:none;padding:8px;border-radius:10px;">Start</button>
      <button id="stop" style="flex:1;background:#ef4444;color:#fff;border:none;padding:8px;border-radius:10px;">Stop</button>
    </div>

    <div id="status" style="margin-top:10px;text-align:center;font-size:13px;">
      Checking...
    </div>
  `;

  document.body.appendChild(box);

  const status = document.getElementById("status");
  const light = document.getElementById("light");

  function removeUI() {
    box.remove();
  }

  function beep() {
    new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg").play();
  }

  // ===== ACCESS CONTROL (TEMP - CONNECT SERVER LATER)
  let allowed = true;

  function setAccess() {
    if (allowed) {
      status.innerText = "Active";
      status.style.color = "green";
      light.style.background = "lime";
    } else {
      status.innerText = "Access Denied";
      status.style.color = "red";
      light.style.background = "red";
    }
  }

  setAccess();

  // ===== CLICK DEFAULT =====
  function clickDefault() {
    document.querySelectorAll("p, div, span").forEach(el => {
      if (el.innerText.trim() === "Default") {
        el.click();
      }
    });
  }

  // ===== STRICT MATCH =====
  function findTargets() {
    return Array.from(document.querySelectorAll(".ml10")).filter(el => {
      const text = el.innerText.replace(/\s+/g, '');
      return targets.some(t => new RegExp(`₹${t}(?!\\d)`).test(text));
    });
  }

  function highlight(el) {
    el.style.outline = "3px solid red";
    el.style.background = "rgba(255,0,0,0.2)";
  }

  function findBuy(el) {
    let current = el;
    while (current && current !== document.body) {
      let btn = current.querySelector(".van-button--primary");
      if (btn) return btn;
      current = current.parentElement;
    }
    return null;
  }

  async function clickTargets(rows) {
    for (let row of rows) {
      highlight(row);

      let btn = findBuy(row);

      if (btn) {
        btn.click();

        if (document.body.innerText.includes("Select Payment Method")) {
          beep();
          running = false;
          removeUI();
          return true;
        }
      }
    }
    return false;
  }

  // ===== LOOP =====
  async function loop() {
    while (running) {

      if (document.body.innerText.includes("Select Payment Method")) {
        beep();
        running = false;
        removeUI();
        return;
      }

      clickDefault();

      await sleep(200);

      const rows = findTargets();

      if (rows.length > 0) {
        document.querySelectorAll(".ml10").forEach(el => {
          el.style.display = rows.includes(el) ? "" : "none";
        });

        let success = await clickTargets(rows);
        if (success) return;
      }

      await sleep(200);
    }
  }

  function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  }

  // ===== BUTTONS =====
  document.getElementById("start").onclick = () => {
    if (!allowed) {
      status.innerText = "Access Denied";
      status.style.color = "red";
      return;
    }

    const val = document.getElementById("amount").value.trim();
    targets = [val];

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
