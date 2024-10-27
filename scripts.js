// Fetch the latest series information from the backend and update the page
document.addEventListener('DOMContentLoaded', function() {
    console.log('Fetching series data...');
    fetch('get_series.php')
        .then(response => {
            console.log('Response received:', response);
            return response.json();
        })
        .then(data => {
            console.log('Data received:', data);

            // Handle if data is an array or single object
            let seriesList = [];
            if (Array.isArray(data)) {
                seriesList = data;
            } else if (typeof data === 'object' && data !== null) {
                seriesList = [data];
            }

            if (seriesList.length > 0) {
                console.log('Sorting data...');
                seriesList.sort((a, b) => new Date(b.first_airing_date) - new Date(a.first_airing_date));

                // Clear existing main content
                const mainContent = document.getElementById('main-content');
                mainContent.innerHTML = '';

                // Loop through each series and add its info and table to the main content
                seriesList.forEach(series => {
                    console.log('Adding series:', series);
                    displaySeriesInfo(series, mainContent);
                    displaySeriesTable(series, mainContent);
                });
            } else {
                console.log('No series data found.');
            }
        })
        .catch(error => console.error('Error fetching series data:', error));
});

// Function to display the series info section
function displaySeriesInfo(series, container) {
    const seriesInfoSection = document.createElement('section');
    seriesInfoSection.classList.add('series-info');

    const seriesName = document.createElement('h2');
    seriesName.classList.add('series-name');
    seriesName.textContent = series.name;

    const seriesTheme = document.createElement('p');
    seriesTheme.classList.add('series-theme');
    seriesTheme.textContent = series.theme_description;

    const seriesDate = document.createElement('p');
    seriesDate.classList.add('series-date');
    seriesDate.textContent = `First aired: ${series.first_airing_date}`;

    seriesInfoSection.appendChild(seriesName);
    seriesInfoSection.appendChild(seriesTheme);
    seriesInfoSection.appendChild(seriesDate);

    container.appendChild(seriesInfoSection);
}

// Function to display the series table
function displaySeriesTable(series, container) {
    const seriesTableSection = document.createElement('section');
    seriesTableSection.classList.add('series-table');

    // Ensure hermits and videos are initialized to empty arrays if not present
    series.hermits = series.hermits || [];
    series.videos = series.videos || [];

    console.log('Series hermits:', series.hermits);
    console.log('Series videos:', series.videos);

    // Determine maximum episode number from video data
    const maxEpisodeNumber = series.videos.reduce((max, video) => Math.max(max, Number(video.episode_number)), 1);
    console.log('Max Episode Number:', maxEpisodeNumber);

    // Create the table header based on the max episode number
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `<th></th>`; // Empty header for hermit names

    for (let i = 1; i <= maxEpisodeNumber; i++) {
        headerRow.innerHTML += `<th>E${i}</th>`;
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);
    console.log('Header Row:', headerRow);

    // Create the table body
    const tbody = document.createElement('tbody');
    const hermitsArray = Array.isArray(series.hermits) ? series.hermits : Object.values(series.hermits);
    console.log('Hermits Array:', hermitsArray);

    hermitsArray.forEach(hermit => {
        console.log('Processing hermit:', hermit);
        const row = document.createElement('tr');

        // Hermit name column
        const hermitCell = document.createElement('td');
        hermitCell.textContent = hermit.display_name;
        row.appendChild(hermitCell);

        // Episode columns
        for (let i = 1; i <= maxEpisodeNumber; i++) {
            const episodeCell = document.createElement('td');
            const img = document.createElement('img');
            img.src = hermit.image_color; // Use image link from the hermit object
            img.alt = hermit.display_name;
            img.classList.add('episode-image');

            // Convert ID and episode number to numbers for consistent matching
            const video = series.videos.find(v => Number(v.hermit_id) === Number(hermit.hermit_id) && Number(v.episode_number) === i);
            
            if (video && video.video_link) {
                console.log(`Video found for Hermit ID ${hermit.hermit_id}, Episode ${i}`);
                img.classList.remove('grayscale'); // Colored image if video exists
                img.addEventListener('click', () => {
                    window.open(video.video_link, '_blank');
                });
            } else {
                console.log(`No video found for Hermit ID ${hermit.hermit_id}, Episode ${i}`);
                img.classList.add('grayscale'); // Greyscale if no video exists
                img.addEventListener('click', () => {
                    addVideoLink(hermit.hermit_id, series.series_id, i);
                });
            }

            episodeCell.appendChild(img);
            row.appendChild(episodeCell);
        }

        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    seriesTableSection.appendChild(table);
    container.appendChild(seriesTableSection);
}

// Function to prompt the user to add a video link
function addVideoLink(hermitId, seriesId, episodeNumber) {
    const videoUrl = prompt('Please enter the YouTube video URL:');
    if (videoUrl) {
        if (isValidYouTubeUrl(videoUrl)) {
            // Send the valid URL to the backend to update the database
            fetch('add_video.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    hermit_id: hermitId,
                    series_id: seriesId,
                    episode_number: episodeNumber,
                    video_url: videoUrl
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Video link added successfully!');
                    location.reload();
                } else {
                    alert('Failed to add video link. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error adding video link:', error);
                alert('An error occurred. Please try again.');
            });
        } else {
            alert('Invalid YouTube URL. Please enter a valid YouTube video link.');
        }
    }
}

// Function to validate a YouTube URL
function isValidYouTubeUrl(url) {
    const pattern = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
    return pattern.test(url) && !/[?&](t=|start=|end=)/.test(url);
}