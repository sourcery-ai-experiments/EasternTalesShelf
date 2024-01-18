function toggleMenu() {
    var menu = document.getElementById("side-menu");
    if (menu.style.left === "-250px") {
        menu.style.left = "0px";
    } else {
        menu.style.left = "-250px";
    }
}


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
}

