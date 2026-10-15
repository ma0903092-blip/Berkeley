const apiKey = "98ac2d51"; // Replace with your key from OMDb API email

async function searchMovie() {
    const query = document.getElementById('searchInput').value.trim();
    const resultDiv = document.getElementById('movieResult');
    const loadingDiv = document.getElementById('loading');

    if (!query) {
        resultDiv.innerHTML = '<p style="color: #ef4444;">[!] Please enter a movie title.</p>';
        return;
    }

    // Show loading state, clear previous results
    loadingDiv.style.display = 'block';
    resultDiv.innerHTML = '';

    try {
        const response = await fetch(`https://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=${apiKey}`);
        const data = await response.json();

        // Hide loading state
        loadingDiv.style.display = 'none';

        if (data.Response === "True") {
            const plotText = data.Plot.length > 120 ? data.Plot.substring(0, 120) + '...' : data.Plot;
            
            resultDiv.innerHTML = `
                <div style="display: flex; gap: 20px; align-items: flex-start; background: rgba(15, 23, 42, 0.6); padding: 15px; border-radius: 8px; border: 1px solid rgba(56, 189, 248, 0.3);">
                    <img src="${data.Poster !== "N/A" ? data.Poster : ''}" alt="Movie Poster" style="width: 110px; border-radius: 5px; box-shadow: 0 5px 15px rgba(0,0,0,0.5);">
                    <div style="flex: 1; color: #cbd5e1;">
                        <h3 style="color: #f3f4f6; margin-bottom: 5px;">${data.Title} (${data.Year})</h3>
                        <p style="color: #4ecca3; font-size: 0.9rem; margin-bottom: 8px;"><strong>Genre:</strong> ${data.Genre}</p>
                        <p style="color: #38bdf8; font-size: 0.9rem; margin-bottom: 8px;"><strong>Director:</strong> ${data.Director}</p>
                        <p style="font-size: 0.85rem; line-height: 1.4;">${plotText}</p>
                    </div>
                </div>
            `;
        } else {
            resultDiv.innerHTML = `<p style="color: #ef4444; text-align: center;">[X] Archive record not found for "${query}".</p>`;
        }
    } catch (error) {
        loadingDiv.style.display = 'none';
        resultDiv.innerHTML = `<p style="color: #ef4444; text-align: center;">[X] Network Error: ${error.message}</p>`;
    }
}

// Allow pressing "Enter" key to search
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                searchMovie();
            }
        });
    }
});