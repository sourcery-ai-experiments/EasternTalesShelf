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
    }

    // Code for syncButton
var syncButton = document.getElementById('syncButton');
if (syncButton) {
    syncButton.addEventListener('click', function() {
        fetch('http://10.147.17.146:8057/sync', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('Sync successful:', data.message);
                alert('Sync successful!');
                fetch('http://10.147.17.146:8057/log_sync', { method: 'POST' }) // Send a request to log the sync success
                .then(() => {
                    window.location.reload(); // Reload the page after closing the alert
                });
            } else {
                console.error('Sync failed:', data.message);
                alert('Sync failed: ' + data.message);
            }
        })
        .catch((error) => {
            console.error('Error:', error);
            alert('An error occurred: ' + error);
        });
    });
} else {
    console.error('syncButton element not found!');
}
});
var currentFilterType = 'ALL'; // Default to 'ALL' on page load

// this prevents AOS to move down page each reloding.
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }



  window.addEventListener('load', function() {
    // Initialize AOS only if cumulative height exceeds the window height
    var items = document.querySelectorAll('.grid-item');
    var cumulativeHeight = 0;
    items.forEach(function(item) {
        if (item.style.display !== 'none') {
            cumulativeHeight += item.offsetHeight + 10; // Adjust if necessary
        }
    });
    
    var windowHeight = window.innerHeight;
    if (cumulativeHeight > windowHeight) {
        // Delayed initialization of AOS
        setTimeout(function(){
            AOS.init({
                offset: 120,
                duration: 1000,
            });
        }, 100); // Adjust the timeout as needed
    } else {
        // If previously initialized, refresh or disable AOS
        // AOS.refreshHard(); // Uncomment if necessary
    }

    // Bind AOS refresh to window resize to handle dynamic changes
    window.addEventListener('resize', function(){
        AOS.refresh();
    });

    // Set border color based on data-status
    items.forEach(function(item) {
        var status = item.getAttribute('data-status');
        if(status) {
            status = status.toUpperCase(); // Convert to uppercase to match the CSS classes
            var statusClass = 'border-' + status.toLowerCase(); // Construct the class name to add
            //console.log('status:', status); // Debug line
            //console.log('statusClass:', statusClass); // Debug line
            item.classList.add(statusClass); // Just add the class, don't check if it exists
        }
    });

});



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
function filterEntries() {
    const titleFilter = document.getElementById('titleFilter').value.toLowerCase();
    const countryJapan = document.getElementById('countryJapan').checked;
    const countryKorea = document.getElementById('countryKorea').checked;
    const mediaTypeFilter = document.getElementById('mediaTypeFilter').value;
    const statusFilter = document.getElementById('status').value;

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
        const itemStatus = item.getAttribute('data-status') || '';
        
        // Determine whether item should be visible based on the navbar filter and side menu filters
        const matchesTitle = titleFilter === '' || title.includes(titleFilter);
        const matchesCountry = (!countryJapan && !countryKorea) || 
                                (countryJapan && country === 'JP') || 
                                (countryKorea && country === 'KR');
        const matchesType = mediaTypeFilter === '' || type === mediaTypeFilter;
        const matchesStatus = statusFilter === '' || itemStatus.toLowerCase() === statusFilter.toLowerCase();
        const matchesFilterType = filterLogic[currentFilterType](country, type);

        if (matchesTitle && matchesCountry && matchesType && matchesStatus && matchesFilterType) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });

    AOS.refresh();
}

// This function sets the current filter type and applies the filters
function filterByType(filterType) {
    currentFilterType = filterType;
    updateNavigationStyles(filterType);
    filterEntries();
}




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
  

// After the window has finished loading
window.addEventListener('load', () => {
    AOS.refresh();
  });
  
  // Whenever the window is resized
window.addEventListener('resize', () => {
    AOS.refresh();
});
  

function showDetails(element) {
    var title = $(element).data('title');
    var status = $(element).data('status');
    var chapters = $(element).data('chapters');
    var progress = $(element).data('progress');
    var coverImage = $(element).data('cover');
    var anilistUrl = $(element).data('anilist-url');
    var description = $(element).data('description');
    var serviceMap = {
        'kakao.com': 'KakaoPage KR',
        'tapas.io': 'Tapas',
        'webtoon.com': 'Webtoons',
        // Add more mappings as needed
    };
    
    // Retrieve the raw data from the data attributes
    var externalLinksData = $(element).attr('data-external-links');
    var genresData = $(element).attr('data-genres');
    
    // Populate sidebar elements
    $('#sidebar-cover').attr('src', coverImage).attr('alt', title);
    $('#sidebar-title').text(title);
    $('#sidebar-info').html('Chapters: ' + chapters + '<br>Progress: ' + progress + '<br>Status: ' + status);
    $('#sidebar-description').html(description);

    // Check if the description is longer than 5 lines
    if ($('#sidebar-description').prop('scrollHeight') > 90) { // 90px is 5 lines here
        $('#sidebar-readmore').show().text('Read More');
        $('#sidebar-description').addClass('collapse');
    } else {
        $('#sidebar-readmore').hide();
        $('#sidebar-description').removeClass('collapse');
    }

    // Safely parse the JSON string into an array for external links
    try {
        var externalLinks = JSON.parse(externalLinksData || "[]"); // Default to an empty array if undefined
        var linksHtml = '<h5 class="mb-2">Links</h5>';
        externalLinks.forEach(function(url) {
            var serviceName = "Some other site"; // Default text if service is not in the map
            Object.keys(serviceMap).forEach(function(key) {
                if (url.includes(key)) {
                    serviceName = serviceMap[key];
                }
            });
            linksHtml += '<a href="' + url + '" class="btn btn-primary btn-sm m-1" target="_blank">' + serviceName + '</a>';
        });
        $('#sidebar-external-links').html(linksHtml);
    } catch (e) {
        console.error('Parsing error for external-links data:', e);
        $('#sidebar-external-links').html('<h5 class="mb-2">No links available</h5>');
    }

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

    $('#sidebar-link').attr('href', anilistUrl);

    // Show the sidebar with Bootstrap styling
    $('#side-menu-right').addClass('active');
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
            $('#sidebar-readmore').text('Read Less');
        });
    } else {
        // Collapse the content
        content.animate({
            'max-height': '7.5em' // Animate towards the collapsed max-height
        }, 500, function() {
            content.removeClass('expanded').addClass('collapse');
            $('#sidebar-readmore').text('Read More');
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



