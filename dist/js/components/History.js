window.HistoryView = function (navigateTo) {
    const render = () => `
    <div class="p-4 fade-in pb-24">
        <header class="flex items-center justify-between mb-6">
            <h2 class="font-bold text-lg">${window.t('history_title')}</h2>
            <button id="btn-pdf" class="btn btn-primary" style="width: auto; padding: 0.5rem; font-size: 0.8rem;">
                📄 PDF
            </button>
        </header>

        <div id="history-list" class="flex flex-col gap-4">
            <div class="text-center text-secondary mt-10">
                <span class="spinner" style="display:inline-block;"></span> Loading...
            </div>
        </div>
    </div>
    `;

    setTimeout(() => {
        const listContainer = document.getElementById('history-list');
        const btnPdf = document.getElementById('btn-pdf');

        // Load Data
        window.DB.getAllEntries().then(entries => {
            if (entries.length === 0) {
                listContainer.innerHTML = `<p class="text-center text-secondary">No records found.</p>`;
                return;
            }

            // Sort by date desc
            entries.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

            listContainer.innerHTML = entries.map(entry => {
                const date = new Date(entry.createdAt).toLocaleDateString();
                const type = entry.data.activityType || 'Treatment';
                const status = entry.synced ? '✅ Synced' : '⏳ Pending';

                return `
                <div class="card p-4 flex justify-between items-center">
                    <div>
                        <h4 class="font-bold capitalize">${type}</h4>
                        <p class="text-sm text-secondary">${date} • ${entry.data.beneficiary || 'Unknown'}</p>
                    </div>
                    <div class="text-sm">
                        ${status}
                    </div>
                </div>
                `;
            }).join('');

            // PDF Generation
            btnPdf.addEventListener('click', () => {
                if (!window.jspdf) {
                    alert("PDF Library loading... Try again in a few seconds.");
                    return;
                }

                const doc = new window.jspdf.jsPDF();

                // Title
                doc.setFontSize(18);
                doc.text("Pashu Sakhi Monthly Report", 14, 22);
                doc.setFontSize(11);
                doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 30);

                // Table Header
                let y = 40;
                doc.setFontSize(10);
                doc.setTextColor(100);
                doc.text("Date", 14, y);
                doc.text("Activity", 50, y);
                doc.text("Beneficiary", 90, y);
                doc.text("Status", 150, y);

                doc.line(14, y + 2, 190, y + 2); // Line
                y += 10;

                // Rows
                doc.setTextColor(0);
                entries.forEach(entry => {
                    if (y > 280) { // New Page
                        doc.addPage();
                        y = 20;
                    }
                    const date = new Date(entry.createdAt).toLocaleDateString();
                    const type = entry.data.activityType || 'Treatment';

                    doc.text(date, 14, y);
                    doc.text(type, 50, y);
                    doc.text(entry.data.beneficiary || '-', 90, y);
                    doc.text(entry.synced ? 'Synced' : 'Pending', 150, y);
                    y += 10;
                });

                doc.save("PashuSakhi_Report.pdf");
            });

        });
    }, 0);

    return render();
};
