const omdbApiKey = "98ac2d51";

async function fetchMovieData() {
    const inputField = document.getElementById('searchInput');
    const resultContainer = document.getElementById('movieResult');
    const loadingIndicator = document.getElementById('loading');

    const query = inputField.value.trim();

    if (!query) {
        resultContainer.innerHTML = '<p style="color: #ef4444; text-align: center;">[!] Please enter a movie title.</p>';
        return;
    }

    // Show loading, clear previous results
    loadingIndicator.style.display = 'block';
    resultContainer.innerHTML = '';

    try {
        const url = `https://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=${omdbApiKey}`;
        const response = await fetch(url);
        const data = await response.json();

        // Hide loading
        loadingIndicator.style.display = 'none';

        if (data.Response === "True") {
            const posterHtml = (data.Poster && data.Poster !== "N/A") 
                ? `<img src="${data.Poster}" alt="Poster" style="width: 90px; border-radius: 5px; box-shadow: 0 5px 15px rgba(0,0,0,0.5);">` 
                : '';

            resultContainer.innerHTML = `
                <div style="display: flex; gap: 15px; align-items: flex-start; background: rgba(15, 23, 42, 0.6); padding: 15px; border-radius: 8px; border: 1px solid rgba(56, 189, 248, 0.3);">
                    ${posterHtml}
                    <div style="flex: 1; color: #cbd5e1; text-align: left;">
                        <h4 style="color: #f3f4f6; margin-bottom: 5px; font-size: 1.1rem;">${data.Title} (${data.Year})</h4>
                        <p style="color: #4ecca3; font-size: 0.85rem; margin-bottom: 5px;"><strong>Genre:</strong> ${data.Genre}</p>
                        <p style="color: #38bdf8; font-size: 0.85rem; margin-bottom: 5px;"><strong>Director:</strong> ${data.Director}</p>
                        <p style="font-size: 0.8rem; line-height: 1.3;">${data.Plot}</p>
                    </div>
                </div>
            `;
        } else {
            resultContainer.innerHTML = `<p style="color: #ef4444; text-align: center;">[X] No movie found matching "${query}".</p>`;
        }
    } catch (err) {
        loadingIndicator.style.display = 'none';
        resultContainer.innerHTML = `<p style="color: #ef4444; text-align: center;">[X] Error: ${err.message}</p>`;
    }
}

// Attach event listeners when page loads
document.addEventListener('DOMContentLoaded', () => {
    const searchButton = document.getElementById('searchBtn');
    const inputField = document.getElementById('searchInput');

    if (searchButton) {
        searchButton.addEventListener('click', fetchMovieData);
    }

    if (inputField) {
        inputField.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                fetchMovieData();
            }
        });
    }
});