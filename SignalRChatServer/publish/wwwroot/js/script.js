window.addEventListener('DOMContentLoaded', () => {
    const cpuText = document.getElementById('cpu-text');
    const ramText = document.getElementById('ram-text');
    const diskText = document.getElementById('disk-text');
    const cpuWarning = document.getElementById('cpu-warning');
    const ramWarning = document.getElementById('ram-warning');
    const uptimeEl = document.getElementById('uptime');
    const cpuCoresEl = document.getElementById('cpu-cores');
    const totalRamEl = document.getElementById('total-ram');
    const netIn = document.getElementById('net-in');
    const netOut = document.getElementById('net-out');
    const processTable = document.getElementById('process-table');

    const maxPoints = 30;
    let cpuData = Array(maxPoints).fill(0);
    let ramData = Array(maxPoints).fill(0);
    let diskData = Array(maxPoints).fill(0);
    let labels = Array.from({ length: maxPoints }, (_, i) => `${maxPoints - i}s ago`);

    function createChart(ctx, color) {
        return new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    data: Array(maxPoints).fill(0),
                    borderColor: color,
                    backgroundColor: color.replace(')', ',0.2)'),
                    tension: 0.4,
                    fill: true,
                    pointRadius: 0
                }]
            },
            options: {
                responsive: true,
                animation: { duration: 500, easing: 'easeOutQuart' },
                scales: { y: { beginAtZero: true, max: 100 }, x: { ticks: { autoSkip: true, maxTicksLimit: 10 } } },
                plugins: { legend: { display: false }, tooltip: { enabled: true } }
            }
        });
    }

    const cpuChart = createChart(document.getElementById('cpu-chart').getContext('2d'), 'rgb(46,204,113)');
    const ramChart = createChart(document.getElementById('ram-chart').getContext('2d'), 'rgb(52,152,219)');
    const diskChart = createChart(document.getElementById('disk-chart').getContext('2d'), 'rgb(155,89,182)');

    function getColor(value) {
        if (value < 50) return 'rgb(46,204,113)';
        else if (value < 80) return 'rgb(241,196,15)';
        else return 'rgb(231,76,60)';
    }

    function updateChartColor(chart, value) {
        const newColor = getColor(value);
        anime({
            targets: chart.data.datasets[0],
            borderColor: newColor,
            backgroundColor: newColor.replace(')', ',0.2)'),
            easing: 'easeOutExpo',
            duration: 500,
            update: function () { chart.update('none'); }
        });
    }

    async function update() {
        try {
            const res = await fetch('/server-status');
            const data = await res.json();

            const cpu = data.cpuUsage || 0;
            const ramUsed = data.ramUsedPercent || 0;
            const diskUsed = data.diskUsedPercent || 0;

            // Animate numbers
            anime({ targets: cpuText, innerHTML: [parseFloat(cpuText.innerHTML) || 0, cpu], round: 1, duration: 500, easing: 'easeOutExpo' });
            anime({ targets: ramText, innerHTML: [parseFloat(ramText.innerHTML) || 0, ramUsed], round: 1, duration: 500, easing: 'easeOutExpo' });
            anime({ targets: diskText, innerHTML: [parseFloat(diskText.innerHTML) || 0, diskUsed], round: 1, duration: 500, easing: 'easeOutExpo' });

            // Warnings
            cpuWarning.textContent = cpu >= 80 ? '⚠️ High CPU' : cpu >= 50 ? '⚠️ Medium CPU' : '';
            cpuWarning.className = cpu >= 80 ? 'warning high' : cpu >= 50 ? 'warning medium' : 'warning';
            ramWarning.textContent = ramUsed >= 80 ? '⚠️ High RAM' : ramUsed >= 50 ? '⚠️ Medium RAM' : '';
            ramWarning.className = ramUsed >= 80 ? 'warning high' : ramUsed >= 50 ? 'warning medium' : 'warning';

            // Other metrics
            uptimeEl.textContent = data.uptime || '0s';
            cpuCoresEl.textContent = data.cpuCores || 0;
            totalRamEl.textContent = Math.round(data.totalRam || 0) + ' MB';
            netIn.textContent = data.network?.in || 0;
            netOut.textContent = data.network?.out || 0;

            // Update charts
            function slide(dataArray, value) { dataArray.push(value); dataArray.shift(); return dataArray; }
            cpuChart.data.datasets[0].data = slide(cpuData, cpu);
            ramChart.data.datasets[0].data = slide(ramData, ramUsed);
            diskChart.data.datasets[0].data = slide(diskData, diskUsed);

            updateChartColor(cpuChart, cpu);
            updateChartColor(ramChart, ramUsed);
            updateChartColor(diskChart, diskUsed);

            labels.push('0s'); labels.shift(); labels.forEach((_, i) => labels[i] = `${maxPoints - i - 1}s ago`);
            cpuChart.data.labels = labels; cpuChart.update('none');
            ramChart.data.labels = labels; ramChart.update('none');
            diskChart.data.labels = labels; diskChart.update('none');

            // Top Processes Table
            processTable.innerHTML = '<tr><th>Name</th><th>CPU%</th><th>RAM MB</th></tr>';
            (data.topProcesses || []).forEach(p => {
                let row = `<tr><td>${p.processName}</td><td>${p.cpu}</td><td>${p.ram}</td></tr>`;
                processTable.innerHTML += row;
            });

        } catch (err) { console.error(err); }
    }

    update();
    setInterval(update, 1000);
});
