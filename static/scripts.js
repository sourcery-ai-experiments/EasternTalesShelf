function toggleMenu() {
    var menu = document.getElementById("side-menu");
    if (menu.style.left === "-250px") {
        menu.style.left = "0px";
    } else {
        menu.style.left = "-250px";
    }
}

/*
function applyFilters() {
    var form = document.getElementById('filterForm');
    var status = form.status.value;
    var country = form.country_made.value;
    var type = form.media_type.value;

    var items = document.querySelectorAll('.grid-item');

    items.forEach(function(item) {
        var itemStatus = item.getAttribute('data-status');
        var itemCountry = item.getAttribute('data-country');
        var itemType = item.getAttribute('data-type');

        if ((status === '' || itemStatus === status) &&
            (country === '' || itemCountry === country) &&
            (type === '' || itemType === type)) {
            item.style.display = ''; // Show the item
        } else {
            item.style.display = 'none'; // Hide the item
        }
    });
    
    // Call the adjustAOS function to recheck if AOS needs to be enabled or disabled
    adjustAOS();
    AOS.refresh();
}
*/
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
        AOS.init({
            offset: 120,
            duration: 1000,
           
        });
    } else {
        // Here we might need to refresh or disable AOS if it was previously initialized
        // AOS.refreshHard(); // Uncomment if necessary
    }
    
    // Also bind AOS refresh to window resize to handle dynamic changes
    window.addEventListener('resize', function(){
        AOS.refresh();
    });
};


function showDetails(element) {
    // Get the data from the clicked element
    var title = $(element).data('title');
    var status = $(element).data('status');
    var progress = 'Chapters: ' + $(element).data('chapters') + ' Progress: ' + $(element).data('progress'); // Add more details as needed

    // Set the data in the sidebar
    $('#side-menu-right h5:nth-of-type(1)').text(title);
    $('#side-menu-right h5:nth-of-type(2)').text(progress);
    $('#side-menu-right h5:nth-of-type(3)').text(status);

    // Show the sidebar
    $('#side-menu-right').addClass('active');
}