const apiKey = "98ac2d51";

async function searchMovie() {
    const searchInput = document.getElementById('searchInput');
    const resultDiv = document.getElementById('movieResult');
    const loadingDiv = document.getElementById('loading');

    if (!searchInput || !resultDiv || !loadingDiv) {
        console.error("Missing required DOM elements.");
        return;
    }

    const query = searchInput.value.trim();

    if (!query) {
        resultDiv.innerHTML = '<p style="color: #ef4444; text-align: center;">[!] Please enter a movie title.</p>';
        return;
    }

    // Show loading state, clear previous results
    loadingDiv.style.display = 'block';
    resultDiv.innerHTML = '';

    try {
        const url = `https://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=${apiKey}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP error status: ${response.status}`);
        }

        const data = await response.json();

        // Hide loading state
        loadingDiv.style.display = 'none';

        if (data.Response === "True") {
            const plotText = data.Plot && data.Plot !== "N/A" 
                ? (data.Plot.length > 120 ? data.Plot.substring(0, 120) + '...' : data.Plot)
                : "No synopsis available.";

            const posterImg = (data.Poster && data.Poster !== "N/A") 
                ? `<img src="${data.Poster}" alt="Movie Poster" style="width: 90px; border-radius: 5px; box-shadow: 0 5px 15px rgba(0,0,0,0.5);">` 
                : '';

            resultDiv.innerHTML = `
                <div style="display: flex; gap: 15px; align-items: flex-start; background: rgba(15, 23, 42, 0.6); padding: 15px; border-radius: 8px; border: 1px solid rgba(56, 189, 248, 0.3);">
                    ${posterImg}
                    <div style="flex: 1; color: #cbd5e1; text-align: left;">
                        <h4 style="color: #f3f4f6; margin-bottom: 5px; font-size: 1.1rem;">${data.Title} (${data.Year})</h4>
                        <p style="color: #4ecca3; font-size: 0.85rem; margin-bottom: 5px;"><strong>Genre:</strong> ${data.Genre}</p>
                        <p style="color: #38bdf8; font-size: 0.85rem; margin-bottom: 5px;"><strong>Director:</strong> ${data.Director}</p>
                        <p style="font-size: 0.8rem; line-height: 1.3;">${plotText}</p>
                    </div>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `<p style="color: #ef4444; text-align: center;">[X] Record not found for "${query}".</p>`;
        }
    } catch (error) {
        loadingDiv.style.display = 'none';
        resultDiv.innerHTML = `<p style="color: #ef4444; text-align: center;">[X] Error: ${error.message}</p>`;
    }
}

// Bind event listeners automatically on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('searchBtn');
    const searchInput = document.getElementById('searchInput');

    if (searchBtn) {
        searchBtn.addEventListener('click', searchMovie);
    }

    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                searchMovie();
            }
        });
    }
});