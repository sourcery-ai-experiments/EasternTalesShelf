

// EXAMPLE OF USING DOMCONTENTLOADED
//document.addEventListener('DOMContentLoaded', (event) => {
    // Your code to run after the DOM is fully loaded
//});


function toggleMenu() {
    var menu = document.getElementById("side-menu");
    if (menu.style.left === "-250px") {
        menu.style.left = "0px";
    } else {
        menu.style.left = "-250px";
    }
}

document.addEventListener('DOMContentLoaded', function() {
    // Code for chatInput
    var chatInput = document.getElementById('chatInput');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });
    } else {
        console.error('chatInput element not found!');
    }});


// Code for syncButton
var syncButton = document.getElementById('syncButton');

if (syncButton) {
    syncButton.addEventListener('click', function() {
        if (isDevelopment) {
            // Only run fetch in development mode
            fetch('/sync', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(response => {
                // Check if the response is okay and content type is JSON
                if (response.ok && response.headers.get("content-type")?.includes("application/json")) {
                    return response.json();
                }
                throw new Error('Server responded with a non-JSON response.');
            })
            .then(data => {
                console.log('Success:', data);
                alert('Sync successful!');
            })
            .catch((error) => {
                console.error('Error:', error);
                alert('An error occurred: ' + error.message);
            });
        } else {
            // If not in development mode, show an alert
            alert('This function is not available in the demo.');
        }
    });
} else {
    console.error('Sync button element not found!');
}


var currentFilterType = 'ALL'; // Default to 'ALL' on page load

// this prevents AOS to move down page each reloding.
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }



// Consolidated load event listener
window.addEventListener('load', function() {

    // Initialize or refresh AOS based on cumulative height logic
    var items = document.querySelectorAll('.grid-item');
    var cumulativeHeight = 0;
    items.forEach(function(item) {
        if (item.style.display !== 'none') {
            cumulativeHeight += item.offsetHeight + 10; // Adjust if necessary
        }
    });

    var windowHeight = window.innerHeight;
    if (cumulativeHeight > windowHeight) {
        setTimeout(function(){
            AOS.init({
                offset: 120,
                duration: 1000,
            });
        }, 100); // Adjust the timeout as needed
    }

    // AOS refresh logic
    AOS.refresh();

    // Set border color based on data-status
    items.forEach(function(item) {
        var status = item.getAttribute('data-user-status');
        if(status) {
            status = status.toUpperCase();
            var statusClass = 'border-' + status.toLowerCase();
            item.classList.add(statusClass);
        }
    });
});

// Consolidated resize event listener
window.addEventListener('resize', () => {
    AOS.refresh();
});

// Initialize a variable to keep track of the current status filter
let currentStatusFilter = '';

// Event listener for status filter options
document.querySelectorAll('.status-option').forEach(function(option) {
    option.addEventListener('click', function() {
        // Remove 'selected' class from all options
        document.querySelectorAll('.status-option').forEach(function(opt) {
            opt.classList.remove('selected');
        });

        // Add 'selected' class to the clicked option
        this.classList.add('selected');

        // Update the currentStatusFilter variable with the new value
        currentStatusFilter = this.getAttribute('data-value');

        // Call filterEntries to apply the filters
        filterEntries();
    });
});

// Initialize a variable to keep track of the current status filter
let currentReleasingStatusFilter = '';

// Event listener for status filter options
document.querySelectorAll('.statusReleasing-option').forEach(function(option) {
    option.addEventListener('click', function() {
        // Remove 'selected' class from all options
        document.querySelectorAll('.statusReleasing-option').forEach(function(opt) {
            opt.classList.remove('selected');
        });

        // Add 'selected' class to the clicked option
        this.classList.add('selected');

        // Update the currentStatusFilter variable with the new value
        currentReleasingStatusFilter = this.getAttribute('data-value');

        // Call filterEntries to apply the filters
        filterEntries();
    });
});


function filterEntries() {
    const titleFilter = document.getElementById('titleFilter').value.toLowerCase();
    const countryJapan = document.getElementById('countryJapan').checked;
    const countryKorea = document.getElementById('countryKorea').checked;
    
    // Since we are not using select for status, we will use currentStatusFilter
    // const statusFilter = document.getElementById('status').value;

    const filterLogic = {
        'NOVEL': (country, type) => country === 'JP' && type === 'NOVEL',
        'MANHWA': (country, type) => country === 'KR' && type === 'MANGA',
        'MANGA': (country, type) => country === 'JP' && type === 'MANGA',
        'ALL': () => true
    };

    // Get all the grid items
    const items = document.querySelectorAll('.grid-item');

    items.forEach(function(item) {
        const title = (item.getAttribute('data-title') || '').toLowerCase();
        const country = item.getAttribute('data-country') || '';
        const type = item.getAttribute('data-type') || '';
        const itemStatus = item.getAttribute('data-user-status') || '';
        const itemReleasingStatus = item.getAttribute('data-release-status') || '';
        // Determine whether item should be visible based on the navbar filter and side menu filters
        const matchesTitle = titleFilter === '' || title.includes(titleFilter);
        const matchesCountry = (!countryJapan && !countryKorea) || 
                                (countryJapan && country === 'JP') || 
                                (countryKorea && country === 'KR');
        
        //const matchesStatus = statusFilter === '' || itemStatus.toLowerCase() === statusFilter.toLowerCase();
        // Determine whether item should be visible based on the status filter
        // Using currentStatusFilter instead of statusFilter
        const matchesStatus = currentStatusFilter === '' || itemStatus.toLowerCase() === currentStatusFilter.toLowerCase();
        const matchesFilterType = filterLogic[currentFilterType](country, type);
        const matchesReleasingStatus = currentReleasingStatusFilter === '' || itemReleasingStatus.toLowerCase() === currentReleasingStatusFilter.toLowerCase();
        // Determine whether item should be visible based on the status filter
        // Using currentStatusFilter instead of statusFilter
        
        if (matchesTitle && matchesCountry  && matchesStatus && matchesFilterType && matchesReleasingStatus) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });

    AOS.refresh();
}




function updateNavigationStyles(selectedFilter) {
    // Remove 'active' class from all nav links
    document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
        link.classList.remove('active');
    });

    // Add 'active' class to the selected nav link
    const selectedNavLink = document.querySelector(`.navbar-nav .nav-link[onclick*="${selectedFilter}"]`);
    if (selectedNavLink) {
        selectedNavLink.classList.add('active');
    }
}

// Function to filter by type when a navbar item is clicked
function filterByType(filterType) {
    currentFilterType = filterType;
    updateNavigationStyles(filterType);
    filterEntries();
}

// Make sure to call filterEntries on page load to apply any default filters
filterEntries();



// Wait until the DOM is fully loaded before initializing the filter
document.addEventListener('DOMContentLoaded', function() {
    filterByType(currentFilterType);
});



document.addEventListener('aos:in', ({ detail }) => {
    console.log('animated in', detail);
    // You could trigger a layout update here, if necessary
    // For example, if you're using a layout library or need to manually update the footer position
  });
  
  document.addEventListener('aos:out', ({ detail }) => {
    console.log('animated out', detail);
    // Handle the animation out event
  });
  



// Global variables for timeout and animation tracking
var globalTimeout;
var isAnimating = false;

// Global variables for animation timeouts
var timeouts = {
    cover: null,
    info: null,
    link: null,
    description: null,
    readmore: null,
    externalLinks: null,
    genres: null,
    title_placeholder: null
};

function showDetails(element) {  
    resetAnimationsAndTimers(); // Reset animations and clear timeouts
    // Check if an animation is ongoing, if so, reset everything immediately
    

    // Abort any ongoing animations, clear timeouts, and hide elements
    $('#sidebar-cover, #sidebar-title, #sidebar-info, #sidebar-description, #sidebar-external-links, #sidebar-genres, #sidebar-link').stop(true, true).hide();
    clearTimeout(window.typewriterTimeout); // Clear any ongoing typewriter timeouts

    // Ensure the sidebar is visible for height calculations
    $('#side-menu-right').removeClass('sidebar-hidden').addClass('sidebar-visible');


    var title = $(element).data('title');
    var coverImage = $(element).data('cover');
    var anilistUrl = $(element).data('anilist-url');
    var description = $(element).data('description');

    // SIDEBAR INFORMATIONS ABOUT ENTRIES
    var chapters_progress = $(element).data('chapters-progress');
    var chapters_total = $(element).data('all-chapters');
    var volumes_progress = $(element).data('volumes-progress');
    var volumes_total = $(element).data('all-volumes');
    var user_status = $(element).data('user-status');
    var release_status = $(element).data('release-status');
    
    if (chapters_total === 0 || chapters_total == null) {
        chapters_total = '?';
    }
    if (volumes_total === 0 || volumes_total == null) {
        volumes_total = '?';
    }
    
    
    // Convert user_status and release_status to uppercase
    user_status = user_status.toUpperCase();
    release_status = release_status.toUpperCase();

    // Convert user_status and release_status to first uppercase, then lowercase
    user_status = user_status.charAt(0).toUpperCase() + user_status.slice(1).toLowerCase();
    release_status = release_status.charAt(0).toUpperCase() + release_status.slice(1).toLowerCase();

    // Retrieve the raw data from the data attributes
    var externalLinksData = $(element).attr('data-external-links');
    var genresData = $(element).attr('data-genres');

    // Populate sidebar elements ----------------------------------------------------------------------------
    
    // Hide all elements before updating
    $('#sidebar-cover, #sidebar-title, #sidebar-info, #sidebar-description, #sidebar-external-links, #sidebar-genres, #sidebar-link').hide();

    // Debounce subsequent calls to prevent rapid execution
    clearTimeout(globalTimeout);
    globalTimeout = setTimeout(function() {
        

        // Update the elements
        $('#sidebar-cover').attr('src', coverImage).attr('alt', title);

        // Update the placeholder with the title content
        $('#sidebar-title-placeholder').text(title);

        // Calculate and set the height for the title container
        var titleHeight = $('#sidebar-title-placeholder').height();
        $('#sidebar-title-container').height(titleHeight);

        // Reset and start typewriter effect for title
        document.getElementById('sidebar-title').innerHTML = '';
        window.typewriterTimeout = setTimeout(function() {
            typeWriter(title, 'sidebar-title', 40);
            $('#sidebar-title').fadeIn(300);
        }, 650);

    
        // Initialize the sidebar info HTML with chapters and volumes
        let sidebarInfoHTML = `
            <p><i class="fas fa-book-open chapter-icon flip"></i> Chapters: ${chapters_progress} / ${chapters_total}</p>
            <p><i class="fas fa-layer-group progress-icon bounce"></i> Volumes: ${volumes_progress} / ${volumes_total}</p>`;

        // Apply animation classes based on the status
        let statusIcon = '';
        switch (user_status) {
            case 'Completed':
                statusIcon = '<i class="fas fa-check-circle status-icon pulse"></i>';
                break;
            case 'Planning':
                statusIcon = '<i class="fas fa-hourglass-start status-icon fade"></i>';
                break;
            case 'Current':
                statusIcon = '<i class="fas fa-book-reader status-icon vertical-move"></i>';
                break;
            case 'Paused':
                statusIcon = '<i class="fas fa-pause-circle status-icon shake"></i>';
                break;
            default:
                statusIcon = '<i class="fas fa-question-circle status-icon"></i>'; // No animation for the default case
        }

        // Determine the release status icon and apply animation
        let releaseStatusIcon = '';
        if (release_status === 'Releasing') {
            releaseStatusIcon = '<i class="fas fa-sync-alt status-icon rotate"></i>';
        } else if (release_status === 'Finished') {
            releaseStatusIcon = '<i class="fas fa-flag-checkered status-icon shake"></i>';
        } else {
            releaseStatusIcon = '<i class="fas fa-circle-notch status-icon"></i>'; // Placeholder icon for other statuses
        }



        // Append user status and release status to sidebar info
        sidebarInfoHTML += `<p>${statusIcon} Status: ${user_status}</p>
            <p>${releaseStatusIcon} Release: ${release_status}</p>`;

        // Set the HTML to the sidebar-info element
        $('#sidebar-info').html(sidebarInfoHTML);

        

        

        

        // Set the description and always start with it collapsed
        $('#sidebar-description').html(description).removeClass('expanded').addClass('collapse');
        $('#sidebar-readmore').text('Read More');

        // Reset max-height to collapsed state
        $('#sidebar-description').css('max-height', '7.5em'); // The max-height for the collapsed state

        // Hide the Read More button if the content is short enough to not need expansion
        if ($('#sidebar-description')[0].scrollHeight <= 90) { // 90px is 5 lines here
            $('#sidebar-readmore').hide();
        } else {
            $('#sidebar-readmore').show();
        }

        // ---------------------------OPERATION ON LINK BUTTONS--------------------

        var serviceMap = {
            'tapas.io': { name: 'Tapas', class: 'tapas' },
            'tappytoon.com': { name: 'Tappytoon', class: 'tappytoon' },
            'www.webtoons.com': { name: 'Webtoons', class: 'webtoons' },
            'yenpress.com': { name: 'Yen Press', class: 'yenpress' },
            'sevenseasentertainment.com': { name: 'Seven Seas', class: 'sevenseas' },
            'j-novel.club': { name: 'J-Novel Club', class: 'jnovel' },
            // Add more mappings as needed
        };

        // Safely parse the JSON string into an array for external links
        try {
            var externalLinks = JSON.parse(externalLinksData || "[]");
            var serviceLinksHtml = '';
            var linksHtml = '<h5 class="mb-2">Links</h5>';

            externalLinks.forEach(function(url) {
                Object.keys(serviceMap).forEach(function(key) {
                    if (url.includes(key)) {
                        var serviceName = serviceMap[key].name;
                        var linkClass = serviceMap[key].class; // Custom class for serviceMap links
                        var buttonHtml = '<a href="' + url + '" class="btn ' + linkClass + ' btn-sm m-1" target="_blank">' + serviceName + '</a>';
                        serviceLinksHtml += buttonHtml;
                    }
                });
            });

            // Check if there are any service links to display
            if (serviceLinksHtml === '') {
                $('#sidebar-external-links').html('<h5 class="mb-2">No links available</h5>');
            } else {
                linksHtml += serviceLinksHtml;
                $('#sidebar-external-links').html(linksHtml);
            }
        } catch (e) {
            console.error('Parsing error for external-links data:', e);
            $('#sidebar-external-links').html('<h5 class="mb-2">No links available</h5>');
        }

        // ------------------------------- end of link buttons ---------------------

        // Safely parse the JSON string into an array for genres
        try {
            var genres = JSON.parse(genresData || "[]"); // Default to an empty array if undefined
            var genresHtml = '<h5 class="mb-2">Genres</h5>';
            genres.forEach(function(genre) {
                genresHtml += '<span class="badge bg-secondary me-1">' + genre + '</span>';
            });
            $('#sidebar-genres').html(genresHtml);
        } catch (e) {
            console.error('Parsing error for genres data:', e);
            $('#sidebar-genres').html('<h5 class="mb-2">No genres available</h5>');
        }

        

        // Start animations with controlled timeouts
        timeouts.cover = setTimeout(() => $('#sidebar-cover').fadeIn(1500), 100);
        timeouts.info = setTimeout(() => $('#sidebar-info').fadeIn(700), 600);
        timeouts.link = setTimeout(() => {
            $('#sidebar-link').attr('href', anilistUrl).fadeIn(650);
        }, 750);
        
        timeouts.description = setTimeout(() => $('#sidebar-description').fadeIn(800), 900);
        timeouts.readmore = setTimeout(() => $('#sidebar-readmore').fadeIn(650), 1100);
        timeouts.externalLinks = setTimeout(() => $('#sidebar-external-links').fadeIn(750), 1300);
        timeouts.genres = setTimeout(() => $('#sidebar-genres').fadeIn(750), 1550);

        // Show the sidebar with Bootstrap styling
        $('#side-menu-right').addClass('active');
    }, 100);
}


function resetAnimationsAndTimers() {
    // Stop all ongoing animations immediately and clear queue
    $('#sidebar-cover, #sidebar-info, #sidebar-link, #sidebar-description, #sidebar-readmore, #sidebar-external-links, #sidebar-genres').stop(true, true).hide();

    // Clear all timeouts
    for (var key in timeouts) {
        clearTimeout(timeouts[key]);
    }
}


// JavaScript to toggle the description with animation
$(document).on('click', '#sidebar-readmore', function() {
    var content = $('#sidebar-description');
    var maxHeight = parseInt(content.css('max-height'), 10); // Get the current max-height
    var fullHeight = content[0].scrollHeight; // Calculate the full height of the content

    if (content.hasClass('collapse')) {
        // Expand the content
        content.animate({
            'max-height': fullHeight // Animate towards the full height
        }, 500, function() {
            content.removeClass('collapse').addClass('expanded');
            $('#sidebar-readmore').text('Read Less').addClass('read-less');
        });
    } else {
        // Collapse the content
        content.animate({
            'max-height': '7.5em' // Animate towards the collapsed max-height
        }, 500, function() {
            content.removeClass('expanded').addClass('collapse');
            $('#sidebar-readmore').text('Read More').removeClass('read-less');
        });
    }
});





// Insert this code into chat-script.js
function toggleChatbot() {
    var chatbot = document.getElementById('chatbot');
    // Toggle the visibility without affecting the chat history
    chatbot.style.display = chatbot.style.display === 'none' ? 'flex' : 'none';
}

function sendMessage() {
    console.log('Enter was pressed and sendMessage called');
    var input = document.getElementById('chatInput');
    var messageText = input.value.trim();
    if (messageText) {
        // Add user message
        addMessage('user', messageText);
        input.value = ''; // Clear the input
        // Simulate a bot response
        setTimeout(function() {
            addMessage('bot', "Let me think...");
        }, 1000);
    }
}

function addMessage(sender, text) {
    var messagesContainer = document.getElementById('chatMessages');
    var messageBubble = document.createElement('div');
    messageBubble.classList.add('chat-bubble', sender);
    var avatar = document.createElement('span');
    avatar.classList.add('avatar');
    messageBubble.appendChild(avatar);
    messageBubble.appendChild(document.createTextNode(text));
    messagesContainer.appendChild(messageBubble);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function openAniList(url) {
    window.open(url, '_blank');
}


// Modify the typewriter function to use a global timeout
window.typewriterTimeout = null;
function typeWriter(text, elementId, speed) {
    let i = 0;
    function type() {
        if (i < text.length) {
            document.getElementById(elementId).innerHTML += text.charAt(i);
            i++;
            window.typewriterTimeout = setTimeout(type, speed);
        }
    }
    type();
}

function scoreToColor(score) {
    var displayText = score === 0.0 ? '?' : score.toString();
    var color;

    if (score === 0.0) {
        color = '#9E9E9E'; // Default color for score 0.0
    } else {
        var roundedScore = Math.floor(score); // Round down to nearest whole number
        switch (roundedScore) {
            case 10:
                color = '#4CAF50'; // Bright green
                break;
            case 9:
                color = '#8BC34A'; // Light green
                break;
            case 8:
                color = '#CDDC39'; // Lime
                break;
            case 7:
                color = '#D4E157'; // Light lime
                break;
            case 6:
                color = '#FFEB3B'; // Yellow
                break;
            case 5:
                color = '#FFC107'; // Amber
                break;
            case 4:
                color = '#FF9800'; // Orange
                break;
            case 3:
                color = '#FF5722'; // Deep orange
                break;
            case 2:
                color = '#F44336'; // Red
                break;
            case 1:
                color = '#B71C1C'; // Deep red
                break;
            default:
                color = '#9E9E9E'; // Default color for invalid scores
                break;
        }
    }

    return { color: color, text: displayText };
}


// Apply colors to score elements
document.querySelectorAll('.score-icon').forEach(function(element, index) {
    var score = parseFloat(element.getAttribute('data-score')); // Assuming you store the score in a data attribute
    var result = scoreToColor(score);
    element.style.backgroundColor = result.color;
    element.textContent = result.text;
});


document.addEventListener('DOMContentLoaded', function() {
    const mangaEntries = document.querySelectorAll('.grid-item');
    const statusCounts = {
        'COMPLETED': 0,
        'PLANNING': 0,
        'CURRENT': 0,
        'PAUSED': 0,
        'ALL-STATUS': mangaEntries.length // This is a special case for the 'All' filter
    };
    const releaseStatusCounts = {
        'RELEASING': 0,
        'FINISHED': 0
    };

    mangaEntries.forEach(entry => {
        const status = entry.getAttribute('data-user-status');
        if (status in statusCounts) {
            statusCounts[status]++;
        }
        const release_status = entry.getAttribute('data-release-status');
        if (release_status in releaseStatusCounts) {
            releaseStatusCounts[release_status]++;
        }
    });

    // Update the counts in the HTML
    document.getElementById('count-completed').textContent = statusCounts['COMPLETED'];
    document.getElementById('count-planning').textContent = statusCounts['PLANNING'];
    document.getElementById('count-current').textContent = statusCounts['CURRENT'];
    document.getElementById('count-paused').textContent = statusCounts['PAUSED'];
    document.getElementById('count-all-user-stats').textContent = statusCounts['ALL-STATUS'];
    document.getElementById('count-all-release-stats').textContent = statusCounts['ALL-STATUS'];
    document.getElementById('count-releasing').textContent = releaseStatusCounts['RELEASING'];
    document.getElementById('count-finished').textContent = releaseStatusCounts['FINISHED'];
});