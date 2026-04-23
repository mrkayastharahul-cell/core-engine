let allowed = false;

// 🔑 your user id (must match server)
const UID = "rahul001";

async function checkAccess() {
  try {
    const res = await fetch(`https://access-server.onrender.com/check?uid=${UID}`);
    const data = await res.json();

    allowed = data.access;

    if (allowed) {
      status.innerText = "Active";
      status.style.color = "green";
      light.style.background = "lime";
    } else {
      status.innerText = "Access Denied";
      status.style.color = "red";
      light.style.background = "red";
    }

  } catch (e) {
    status.innerText = "Server Error";
    status.style.color = "orange";
    console.error(e);
  }
}

// run on load
checkAccess();
