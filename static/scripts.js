function toggleMenu() {
    var menu = document.getElementById("side-menu");
    if (menu.style.left === "-250px") {
        menu.style.left = "0px";
    } else {
        menu.style.left = "-250px";
    }
}

// this prevents AOS to move down page each reloding.
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }



  window.onload = function() {
    var items = document.querySelectorAll('.grid-item');
    var cumulativeHeight = 0;
    items.forEach(function(item) {
        if (item.style.display !== 'none') {
            // Make sure to include margins if they contribute to the overall height
            cumulativeHeight += item.offsetHeight + 10; // Assuming 10px margin, adjust if necessary
        }
    });

    var windowHeight = window.innerHeight;

    // Check if cumulative height of items exceeds the window height
    if (cumulativeHeight > windowHeight) {
        // Initialize AOS
        setTimeout(function(){
            AOS.init({
                offset: 120,
                duration: 1000,
            
            });
        }, 100); // Adjust the timeout as needed
    } else {
        // Here we might need to refresh or disable AOS if it was previously initialized
        // AOS.refreshHard(); // Uncomment if necessary
    }
    
    // Also bind AOS refresh to window resize to handle dynamic changes
    window.addEventListener('resize', function(){
        AOS.refresh();
    });
};


function filterEntries() {
    const titleFilter = document.getElementById('titleFilter').value.toLowerCase();
    const countryJapan = document.getElementById('countryJapan').checked;
    const countryKorea = document.getElementById('countryKorea').checked;
    const mediaTypeFilter = document.getElementById('mediaTypeFilter').value;
    const statusFilter = document.getElementById('status').value;

    // Get all the grid items
    const items = document.querySelectorAll('.grid-item');

    items.forEach(function(item) {
        const title = (item.getAttribute('data-title') || '').toLowerCase();
        const country = item.getAttribute('data-country') || '';
        const type = item.getAttribute('data-type') || '';
        const itemStatus = item.getAttribute('data-status') || '';

        // Determine whether item should be visible
        const matchesTitle = titleFilter === '' || title.includes(titleFilter);
        const matchesCountry = (!countryJapan && !countryKorea) || 
                                (countryJapan && country === 'japan') || 
                                (countryKorea && country === 'korea');
        const matchesType = mediaTypeFilter === '' || type === mediaTypeFilter;
        const matchesStatus = statusFilter === '' || itemStatus.toLowerCase() === statusFilter.toLowerCase();

        if (matchesTitle && matchesCountry && matchesType && matchesStatus) {
            item.style.display = '';
        } else {
            item.style.display = 'none';
        }
    });
    AOS.refresh();
}




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
  









function showDetails2(element) {
    // Get the data from the clicked element
    var title = $(element).data('title');
    var status = $(element).data('status');
    var progress = 'Chapters: ' + $(element).data('all-chapters') + ' Progress: ' + $(element).data('chapters-progress'); // Add more details as needed

    // Set the data in the sidebar
    $('#side-menu-right h5:nth-of-type(1)').text(title);
    $('#side-menu-right h5:nth-of-type(2)').text(progress);
    $('#side-menu-right h5:nth-of-type(3)').text(status);

    // Show the sidebar
    $('#side-menu-right').addClass('active');
}




function showDetails(element) {
    var title = $(element).data('title');
    var status = $(element).data('status');
    var chapters = $(element).data('chapters');
    var progress = $(element).data('progress');
    var coverImage = $(element).data('cover');
    var anilistUrl = $(element).data('anilist-url');

    // Populate sidebar elements
    $('#sidebar-cover').attr('src', coverImage).attr('alt', title);
    $('#sidebar-title').text(title);
    $('#sidebar-info').html('Chapters: ' + chapters + '<br>Progress: ' + progress + '<br>Status: ' + status);
    $('#sidebar-link').attr('href', anilistUrl);

    // Show the sidebar with Bootstrap styling
    $('#side-menu-right').addClass('active');
}





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

