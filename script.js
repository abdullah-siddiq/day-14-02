document.addEventListener('DOMContentLoaded', function() {
    const dataContainer = document.createElement('div');
    dataContainer.setAttribute('class', 'data-container');

    let currentPage = 1;
    const recordsPerPage = 10;
    const totalRecords = 100; // Assuming there are 100 records, update if necessary.
    const totalPages = Math.ceil(totalRecords / recordsPerPage);

    function prevPage() {
        if (currentPage > 1) {
            changePage(currentPage - 1);
        }
    }

    function nextPage() {
        if (currentPage < totalPages) {
            changePage(currentPage + 1);
        }
    }

    function changePage(pageNum) {
        if (pageNum < 1) pageNum = 1;
        if (pageNum > totalPages) pageNum = totalPages;

        const start = (pageNum - 1) * recordsPerPage;
        const end = pageNum * recordsPerPage;

        currentPage = pageNum;
        fetchDataAndUpdateTable(start, end);

        document.getElementById('prev').style.visibility = pageNum === 1 ? 'hidden' : 'visible';
        document.getElementById('next').style.visibility = pageNum === totalPages ? 'hidden' : 'visible';

        updateActivePageLink(pageNum);
    }

    function fetchDataAndUpdateTable(start, end) {
        dataContainer.innerHTML = '';
        const request = new XMLHttpRequest();
        const url = "https://raw.githubusercontent.com/Rajavasanthan/jsondata/master/pagenation.json";

        request.open('GET', url, true);
        request.send();

        request.onload = function() {
            const data = JSON.parse(this.response);
            const table = createTable(data.slice(start, end));
            dataContainer.appendChild(table);
        }
    }

    function createTable(data) {
        const table = document.createElement('table');
        table.setAttribute('class', 'data-table');
        table.id = "DataTable";

        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        const headerRow = document.createElement('tr');
        ['Id', 'Name', 'E-Mail'].forEach(text => {
            const th = document.createElement('th');
            th.innerHTML = text;
            headerRow.appendChild(th);
        });

        thead.appendChild(headerRow);
        table.appendChild(thead);

        data.forEach(item => {
            const row = document.createElement('tr');
            ['id', 'name', 'email'].forEach(key => {
                const td = document.createElement('td');
                td.innerHTML = item[key];
                row.appendChild(td);
            });
            tbody.appendChild(row);
        });

        table.appendChild(tbody);
        return table;
    }

    function updateActivePageLink(pageNum) {
        document.querySelectorAll('.pagination a').forEach((a, index) => {
            if (index + 1 === pageNum) {
                a.classList.add('active');
            } else {
                a.classList.remove('active');
            }
        });
    }

    function createPaginationLinks() {
        const paginationDiv = document.createElement('div');
        paginationDiv.setAttribute('class', 'pagination');

        const prevLink = document.createElement('a');
        prevLink.href = 'javascript:void(0)';
        prevLink.id = 'prev';
        prevLink.innerHTML = '&laquo;';
        prevLink.addEventListener('click', prevPage);

        const nextLink = document.createElement('a');
        nextLink.href = 'javascript:void(0)';
        nextLink.id = 'next';
        nextLink.innerHTML = '&raquo;';
        nextLink.addEventListener('click', nextPage);

        paginationDiv.appendChild(prevLink);

        for (let i = 1; i <= totalPages; i++) {
            const pageLink = document.createElement('a');
            pageLink.href = 'javascript:void(0)';
            pageLink.innerHTML = i;
            pageLink.addEventListener('click', () => changePage(i));
            if (i === 1) pageLink.classList.add('active');
            paginationDiv.appendChild(pageLink);
        }

        paginationDiv.appendChild(nextLink);

        return paginationDiv;
    }

    const heading = document.createElement('div');
    heading.innerHTML = 'PAGINATION';
    heading.setAttribute('class', 'heading');

    document.body.appendChild(heading);
    document.body.appendChild(dataContainer);
    document.body.appendChild(createPaginationLinks());

    changePage(1);
});
