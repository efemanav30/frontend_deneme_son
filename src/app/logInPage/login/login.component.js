document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('container');
    const registerBtn = document.querySelectorAll('#register');
    const loginBtn = document.querySelectorAll('#login');

    registerBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            container.classList.add("active");
        });
    });

    loginBtn.forEach(btn => {
        btn.addEventListener('click', () => {
            container.classList.remove("active");
        });
    });
});
