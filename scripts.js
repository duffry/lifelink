document.addEventListener('DOMContentLoaded', function() {
    console.log('Fetching series data...');
    // Get the username from the URL
    const urlParams = new URLSearchParams(window.location.search);
    const username = urlParams.get('u');
    let userAccessCode = 0;

    if (username) {
        // Fetch user access information
        fetch(`get_user_access.php?u=${username}`)
            .then(response => response.json())
            .then(data => {
                console.log('User access data:', data);
                userAccessCode = data.access_code || 0;
                fetchSeriesData(userAccessCode, username);
            })
            .catch(error => console.error('Error fetching user access data:', error));
    } else {
        fetchSeriesData(userAccessCode);
    }
});

function fetchSeriesData(userAccessCode, username) {
    const url = username ? `get_series.php?u=${username}` : 'get_series.php';
    fetch(url)
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
                    displaySeriesInfo(series, mainContent, username);
                    displaySeriesTable(series, mainContent, userAccessCode, username);
                });
            } else {
                console.log('No series data found.');
            }
        })
        .catch(error => console.error('Error fetching series data:', error));
}

// Function to display the series info section
function displaySeriesInfo(series, container, username) {
    const seriesInfoSection = document.createElement('section');
    seriesInfoSection.classList.add('series-info');

    const seriesName = document.createElement('h2');
    seriesName.classList.add('series-name');
    seriesName.textContent = series.name;

    const seriesTheme = document.createElement('p');
    seriesTheme.classList.add('series-theme');
    seriesTheme.textContent = series.theme_description;

    seriesInfoSection.appendChild(seriesName);
    seriesInfoSection.appendChild(seriesTheme);

    // Calculate and display the watched percentage if username is provided
    if (username && series.videos) {
        const totalVideos = series.videos.length;
        const watchedVideos = series.videos.filter(video => video.watched_state === 1).length;
        const watchedPercentage = totalVideos > 0 ? Math.round((watchedVideos / totalVideos) * 100) : 0;

        const watchedInfo = document.createElement('p');
        watchedInfo.classList.add('watched-info');
        watchedInfo.textContent = `Watched: ${watchedPercentage}%`;

        seriesInfoSection.appendChild(watchedInfo);

        // Create a progress bar
        const progressBar = document.createElement('div');
        progressBar.classList.add('progress-bar');
        progressBar.style.position = 'relative';
        progressBar.style.height = '4px';
        progressBar.style.width = '100%';
        progressBar.style.background = 'midgrey';

        const progressFill = document.createElement('div');
        progressFill.classList.add('progress-fill');
        progressFill.style.height = '100%';
        progressFill.style.width = `${watchedPercentage}%`;
        progressFill.style.background = 'green';

        progressBar.appendChild(progressFill);
        seriesInfoSection.appendChild(watchedInfo);
        seriesInfoSection.appendChild(progressBar);
    }
    container.appendChild(seriesInfoSection);
}

// Function to update watched percentage
function updateWatchedPercentage() {$1
    const seriesInfoSections = document.querySelectorAll('.series-info');
    seriesInfoSections.forEach(section => {
        const seriesVideos = section.parentElement.querySelectorAll('.episode-image');
        const totalVideos = seriesVideos.length;
        const watchedVideos = Array.from(seriesVideos).filter(video => video.classList.contains('watched')).length;
        const watchedPercentage = totalVideos > 0 ? Math.round((watchedVideos / totalVideos) * 100) : 0;
        const watchedInfo = section.querySelector('.watched-info');
        if (watchedInfo) {
            watchedInfo.textContent = `Watched: ${watchedPercentage}%`;
        }

        const progressFill = section.querySelector('.progress-fill');
        if (progressFill) {
            progressFill.style.width = `${watchedPercentage}%`;
        }
    });
}

// Function to display the series table
function displaySeriesTable(series, container, userAccessCode, username) {
    const seriesTableSection = document.createElement('section');
    seriesTableSection.classList.add('series-table');

    series.hermits = series.hermits || [];
    series.videos = series.videos || [];

    const maxEpisodeNumber = series.videos.reduce((max, video) => Math.max(max, Number(video.episode_number)), 1);

    const table = document.createElement('table');
    const thead = document.createElement('thead');
    const headerRow = document.createElement('tr');
    headerRow.innerHTML = `<th></th>`;
    for (let i = 1; i <= maxEpisodeNumber; i++) {
        headerRow.innerHTML += `<th>E${i}</th>`;
    }
    thead.appendChild(headerRow);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const hermitsArray = Array.isArray(series.hermits) ? series.hermits : Object.values(series.hermits);

    hermitsArray.forEach(hermit => {
        const row = document.createElement('tr');
        const hermitCell = document.createElement('td');
        hermitCell.textContent = hermit.display_name;
        row.appendChild(hermitCell);

        for (let i = 1; i <= maxEpisodeNumber; i++) {
            const episodeCell = document.createElement('td');
            const img = document.createElement('img');
            img.src = hermit.image_color;
            img.alt = hermit.display_name;
            img.classList.add('episode-image');

            const video = series.videos.find(v => Number(v.hermit_id) === Number(hermit.hermit_id) && Number(v.episode_number) === i);

            let pressStartTime;
            let longPressDetected = false;

            if (video && video.video_link) {
                img.classList.remove('grayscale');

                img.addEventListener('contextmenu', (e) => {
                    e.preventDefault();
                });

                img.addEventListener('mousedown', (e) => {
                    if (e.button !== 0) return; // Only respond to left mouse button clicks
                    pressStartTime = Date.now();
                    longPressDetected = false;
                    console.log("Mouse down event detected, timestamp recorded");
                });

                img.addEventListener('touchstart', (e) => {
                    pressStartTime = Date.now();
                    longPressDetected = false;
                });

                img.addEventListener('mouseup', (e) => {
                    if (e.button !== 0) return; // Only respond to left mouse button clicks
                    const pressDuration = Date.now() - pressStartTime;
                    console.log("Mouse up event detected, duration:", pressDuration, "ms");
                    if (pressDuration >= 1000) {
                        longPressDetected = true;
                        console.log("Long press detected, toggling watched state");
                        toggleWatchedState(username, video.video_id, img); // Correct call
                    } else {
                        longPressDetected = false;
                    }
                });

                img.addEventListener('touchend', (e) => {
                    const pressDuration = Date.now() - pressStartTime;
                    if (pressDuration >= 1000) {
                        longPressDetected = true;
                        toggleWatchedState(username, video.video_id, img);
                    } else {
                        longPressDetected = false;
                    }
                });

                img.addEventListener('click', (e) => {
                    if (e.button !== 0) return; // Only respond to left mouse button clicks
                    if (!longPressDetected) {
                        console.log("Regular click, opening video link");
                        if (video.video_link) {
                            window.open(video.video_link, '_blank');
                        } else {
                            console.log("Video link is undefined or not available");
                        }
                    } else {
                        console.log("Click prevented due to long press");
                    }
                });

                if (video.watched_state === 1) {
                    img.classList.add('watched');
                }
            } else {
                img.classList.add('grayscale');
                if (userAccessCode > 0) {
                    img.addEventListener('click', () => {
                        addVideoLink(hermit.hermit_id, series.series_id, i);
                    });
                }
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

// Function to toggle watched state
function toggleWatchedState(username, videoId, imgElement) {
    fetch('update_watched_status.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, video_id: videoId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Toggle watched state visually without reloading the page
            imgElement.classList.toggle('watched');
            // Recalculate and update watched percentage
            updateWatchedPercentage();
        } else {
            console.error('Failed to update watched state:', data.message);
        }
    })
    .catch(error => console.error('Error updating watched state:', error));
}
