export const showAlert = (text) => {
    const alertEl = document.createElement("div");
    alertEl.innerText = text;
    alertEl.className = "alert slide-in";
    document.body.appendChild(alertEl);

    setTimeout(() => {
        alertEl.className = "alert slide-out";
        setTimeout(() => {
            alertEl.remove();
        }, 400);
    }, 3000);
};
