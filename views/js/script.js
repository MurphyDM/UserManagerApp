window.onload = function() {
    console.log("script");
    const mainCheckbox = document.getElementById('main-checkbox'),
        checkboxes = document.querySelectorAll('input[type=checkbox]'),
        deleteButton = document.getElementById('delete-button'),
        lockButton = document.getElementById('lock-button'),
        unlockButton = document.getElementById('unlock-button'),
        tools = document.getElementsByClassName('tool');

    async function buildGetAPI(url, method) {
        const response = fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                }
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

    async function buildPostAPI(url, method, data) {
        const response = fetch(url, {
                method: method,
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

    let disableToolbar = () => {
        if (tools)
            for (let tool of tools) {
                tool.style.display = "none";
            }
    }

    let checkStatus = (status) => {
        if (status == "blocked") disableToolbar();
    }

    let timerId = setInterval(() => {
        buildGetAPI('/status', 'GET', '').then(data => {
            checkStatus(data);
        });
    }, 1000);

    if (mainCheckbox) mainCheckbox.addEventListener('click', (event) => {
        checkAll();
    });

    if (deleteButton) deleteButton.addEventListener('click', (event) => {
        let checkUsers = getCheckUsers();
        buildPostAPI('/client/delete', 'POST', checkUsers);
        document.location.reload();

    });

    if (lockButton) lockButton.addEventListener('click', (event) => {
        let checkUsers = getCheckUsers();
        buildPostAPI('/client/lock', 'POST', checkUsers);
        document.location.reload();
    });

    if (unlockButton) unlockButton.addEventListener('click', (event) => {
        let checkUsers = getCheckUsers();
        buildPostAPI('/client/unlock', 'POST', checkUsers);
        document.location.reload();
    });





}