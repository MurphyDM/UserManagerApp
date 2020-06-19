window.onload = function() {
    console.log("script");
    const mainCheckbox = document.getElementById('main-checkbox'),
        checkboxes = document.querySelectorAll('input[type=checkbox]'),
        deleteButton = document.getElementById('delete-button'),
        lockButton = document.getElementById('lock-button'),
        unlockButton = document.getElementById('unlock-button'),
        tools = document.getElementsByClassName('tool');

    async function buildGetAPI(url) {
        const response = fetch(url, {
                method: 'GET'
            })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                return data;
            })
            .catch((err) => new Error("Error in promise"));

        return response;
    }

    async function buildPostAPI(url, data) {
        const response = fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                body: JSON.stringify(data)
            })
            .then((res) => {
                return res.json();
            })
            .then((data) => {
                return data;
            })

        return response;
    }

    function checkAll() {
        let c;
        checkboxes.forEach(e => {
            if (e.id == 'main-checkbox') return (c = e.checked);
            e.checked = c;
        });
    }

    function getCheckUsers() {
        let checkUsers = new Array();
        checkboxes.forEach(e => {
            if (e.checked)
                if (e != mainCheckbox) checkUsers.push(e.id);
        });
        return checkUsers;
    }

    let timerId = setInterval(() => {
        buildPostAPI('/userblocked', "blocked");
    }, 2000);

    if (mainCheckbox) mainCheckbox.addEventListener('click', (event) => {
        checkAll();
    });

    if (deleteButton) deleteButton.addEventListener('click', (event) => {
        let checkUsers = getCheckUsers();
        buildPostAPI('/client/delete', checkUsers);
        document.location.reload();

    });

    if (lockButton) lockButton.addEventListener('click', (event) => {
        let checkUsers = getCheckUsers();
        buildPostAPI('/client/lock', checkUsers);
        document.location.reload();
    });

    if (unlockButton) unlockButton.addEventListener('click', (event) => {
        let checkUsers = getCheckUsers();
        buildPostAPI('/client/unlock', checkUsers);
        document.location.reload();
    });

}