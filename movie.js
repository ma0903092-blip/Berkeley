const apiKey = "98ac2d51";

async function searchMovie() {
    console.log("Search button clicked!"); // Debug log

    const searchInput = document.getElementById('searchInput');
    const resultDiv = document.getElementById('movieResult');
    const loadingDiv = document.getElementById('loading');

    // Safety checks in case IDs are missing
    if (!searchInput || !resultDiv || !loadingDiv) {
        console.error("Error: One or more HTML element IDs ('searchInput', 'movieResult', 'loading') are missing from index.html!");
        alert("Configuration Error: Check HTML element IDs.");
        return;
    }

    const query = searchInput.value.trim();
    if (!query) {
        resultDiv.innerHTML = '<p style="color: #ef4444;">[!] Please enter a movie title.</p>';
        return;
    }

    // Show loading state, clear previous results
    loadingDiv.style.display = 'block';
    resultDiv.innerHTML = '';

    try {
        const url = `https://www.omdbapi.com/?t=${encodeURIComponent(query)}&apikey=${apiKey}`;
        console.log("Fetching URL:", url);

        const response = await fetch(url);
        const data = await response.json();
        console.log("API Response received:", data);

        // Hide loading state
        loadingDiv.style.display = 'none';

        if (data.Response === "True") {
            const plotText = data.Plot && data.Plot.length > 120 ? data.Plot.substring(0, 120) + '...' : (data.Plot || "No plot available.");
            
            resultDiv.innerHTML = `
                <div style="display: flex; gap: 20px; align-items: flex-start; background: rgba(15, 23, 42, 0.6); padding: 15px; border-radius: 8px; border: 1px solid rgba(56, 189, 248, 0.3);">
                    <img src="${data.Poster !== "N/A" ? data.Poster : ''}" alt="Movie Poster" style="width: 90px; border-radius: 5px; box-shadow: 0 5px 15px rgba(0,0,0,0.5);">
                    <div style="flex: 1; color: #cbd5e1;">
                        <h4 style="color: #f3f4f6; margin-bottom: 5px;">${data.Title} (${data.Year})</h4>
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
        console.error("Fetch error:", error);
        loadingDiv.style.display = 'none';
        resultDiv.innerHTML = `<p style="color: #ef4444; text-align: center;">[X] Error: ${error.message}</p>`;
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