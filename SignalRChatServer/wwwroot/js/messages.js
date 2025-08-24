async function fetchMessages() {
    try {
        const res = await fetch('/messages', {
            headers: {
                'X-API-KEY': 'supersecret123' // Use your API key if needed
            }
        });
        const data = await res.json();
        displayMessages(data);
    } catch (err) {
        console.error('Error fetching messages:', err);
    }
}

function displayMessages(messages) {
    const tbody = document.querySelector('#messagesTable tbody');
    tbody.innerHTML = '';

    messages.forEach(msg => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${msg.id}</td>
            <td>${msg.user}</td>
            <td>${msg.message}</td>
            <td>${new Date(msg.timestamp).toLocaleString()}</td>
        `;
        tbody.appendChild(tr);
    });
}

// Search functionality
document.getElementById('searchInput').addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#messagesTable tbody tr');
    rows.forEach(row => {
        const text = row.innerText.toLowerCase();
        row.style.display = text.includes(term) ? '' : 'none';
    });
});

fetchMessages();
