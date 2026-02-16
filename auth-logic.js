const firebaseConfig = {
  apiKey: "AIzaSyBAq9KvzGD7xwri2pr0iOCefXq_ct5Q13M",
  authDomain: "banma-films.firebaseapp.com",
  databaseURL: "https://banma-films-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "banma-films",
  storageBucket: "banma-films.firebasestorage.app",
  messagingSenderId: "851799074788",
  appId: "1:851799074788:web:1a682c3f09bf9ddb3e09f1",
  measurementId: "G-ND3BFD33ZW"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

function viewUser(username) {
    localStorage.setItem('view_target_user', username);
    window.location.href = 'profile.html';
}

function findEgg(eggName) {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) { alert("Войди в аккаунт!"); return; }

    db.ref('users/' + user.login + '/eggs').get().then((snapshot) => {
        let found = snapshot.val() || [];
        if (!found.includes(eggName)) {
            found.push(eggName);
            db.ref('users/' + user.login + '/eggs').set(found);
            
            let toast = document.createElement('div');
            toast.className = 'toast show';
            toast.innerText = "Пасхалка найдена: " + eggName.toUpperCase();
            document.body.appendChild(toast);
            setTimeout(() => toast.remove(), 3000);
            if(found.length === 5) alert("АЧИВКА: ДЕТЕКТИВ!");
        }
    });
}

function handleAuth(type) {
    const login = document.getElementById('auth-login').value.trim().toLowerCase();
    const pass = document.getElementById('auth-pass').value.trim();
    if (login.length < 3) return alert("Ник слишком короткий");

    const userRef = db.ref('users/' + login);

    if (type === 'reg') {
        userRef.get().then((snapshot) => {
            if (snapshot.exists()) {
                alert("Ник уже занят!");
            } else {
                userRef.set({
                    login: login,
                    pass: pass,
                    avatar: null,
                    eggs: []
                }).then(() => alert("Регистрация успешна! Входи."));
            }
        });
    } else {
        userRef.get().then((snapshot) => {
            const data = snapshot.val();
            if (data && data.pass === pass) {
                localStorage.setItem('currentUser', JSON.stringify(data));
                localStorage.removeItem('view_target_user'); 
                location.href = "index.html";
            } else {
                alert("Неверный логин или пароль!");
            }
        });
    }
}
