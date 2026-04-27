document.getElementById('connectButton').addEventListener('click', () => {
    const urlInput = document.getElementById('urlInput');
    const statusWindow = document.getElementById('statusWindow');
    const url = urlInput.value.trim();

    if (!url) {
        statusWindow.innerHTML += 'Error: URL is required.<br>';
        return;
    }

    statusWindow.innerHTML += `Connecting to ${url}...<br>`;

    fetch(`/proxy?url=${encodeURIComponent(url)}`)
        .then(response => response.text())
        .then(data => {
            statusWindow.innerHTML += `Connected to ${url}.<br>`;
            statusWindow.innerHTML += data;
        })
        .catch(error => {
            statusWindow.innerHTML += `Failed to connect to ${url}.<br>`;
            statusWindow.innerHTML += `Error: ${error.message}<br>`;
        });
});
