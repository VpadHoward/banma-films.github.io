function viewUser(username) {
    localStorage.setItem('view_target_user', username);
    window.location.href = 'profile.html';
}

function findEgg(eggName) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) { alert("Войди в аккаунт, чтобы собирать пасхалки!"); return; }

    let found = JSON.parse(localStorage.getItem('found_eggs_' + user.login)) || [];
    if (!found.includes(eggName)) {
        found.push(eggName);
        localStorage.setItem('found_eggs_' + user.login, JSON.stringify(found));
        
        let toast = document.createElement('div');
        toast.className = 'toast show';
        toast.innerText = "Пасхалка найдена: " + eggName.toUpperCase();
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);

        if(found.length === 5) alert("АЧИВКА РАЗБЛОКИРОВАНА: ДЕТЕКТИВ!");
    } else {
        let toast = document.createElement('div');
        toast.className = 'toast show';
        toast.style.background = '#333';
        toast.innerText = "Вы уже нашли этот секрет!";
        document.body.appendChild(toast);
        setTimeout(() => toast.remove(), 2000);
    }
}

function handleAuth(type) {
    const login = document.getElementById('auth-login').value.trim();
    const pass = document.getElementById('auth-pass').value.trim();
    if (login.length < 3 || pass.length < 3) return alert("Минимум 3 символа!");

    let users = JSON.parse(localStorage.getItem('banma_users')) || [];
    if (type === 'reg') {
        if (users.some(u => u.login === login)) return alert("Ник занят!");
        users.push({ login, pass, avatar: null });
        localStorage.setItem('banma_users', JSON.stringify(users));
        alert("Регистрация успешна! Теперь войдите.");
    } else {
        const user = users.find(u => u.login === login && u.pass === pass);
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            // При входе сбрасываем просмотр чужого профиля
            localStorage.removeItem('view_target_user'); 
            location.href = "index.html";
        } else { alert("Ошибка входа!"); }
    }
}
