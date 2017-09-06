const request = superagent;

const handleError = err => console.error(err);

const makeTableRow = (id, name, type) => `<tr class="js-clickableRow" id="${id}"><td>${name}</td><td>${type}</td></tr>`;

$(document).ready(() => {

    let selectedId;

    const onRowClick = e => {
        e.preventDefault();
        selectedId = e.currentTarget.id;
        const $datas = $(e.currentTarget).find('td');
        const $name = $('#js-nameInput').val($($datas[0]).text());
        const $type = $('#js-typeInput').val($($datas[1]).text());
        $('#js-deleteButton').show();
        $('#js-addMessage').hide();
        $('#js-updateMessage').show();
    };

    request
        .get('/api/animal')
        .then(({ text }) => {
            const data = JSON.parse(text);
            for(const d of data) {
                $('#js-tableBody').append(makeTableRow(d.id, d.name, d.type));
            }
            $('.js-clickableRow')
                .off('click')
                .on('click', onRowClick);
        })
        .catch(err => handleError(err));

    $('#js-animalForm').on('submit', e => {
        e.preventDefault();
        const $name = $('#js-nameInput');
        const name = $name
            .val()
            .trim();
        const $type = $('#js-typeInput');
        const type = $type
            .val()
            .trim();
        if(selectedId) {
            request
                .post(`/api/animal/${selectedId}`)
                .send({
                    name,
                    type
                })
                .then(res => {
                    const { text, statusCode } = res;
                    if(statusCode !== 200) {
                        alert(`Returned with status code ${statusCode}`);
                        return;
                    }
                    const data = JSON.parse(text);
                    $(`#${selectedId}`).replaceWith(makeTableRow(data.id, data.name, data.type));
                    $name.val('');
                    $type.val('');
                    $name[0].focus();
                    $('#js-deleteButton').hide();
                    $('#js-addMessage').show();
                    $('#js-updateMessage').hide();
                    selectedId = '';
                })
                .catch(err => handleError(err));
        } else {
            request
                .post('/api/animal')
                .send({
                    name,
                    type
                })
                .then(res => {
                    const { text, statusCode } = res;
                    if(statusCode !== 200) {
                        alert(`Returned with status code ${statusCode}`);
                        return;
                    }
                    const data = JSON.parse(text);
                    $('#js-tableBody').append(makeTableRow(data.id, data.name, data.type));
                    $name.val('');
                    $type.val('');
                    $name[0].focus();
                })
                .catch(err => handleError(err));
        }

    });

    $('#js-deleteButton').on('click', e => {
        e.preventDefault();
        request
            .delete(`/api/animal/${selectedId}`)
            .then(res => {
                const { statusCode } = res;
                if(statusCode !== 200) {
                    alert(`Returned with status code ${statusCode}`);
                    return;
                }
                $(`#${selectedId}`).detach();
                const $name = $('#js-nameInput');
                const $type = $('#js-typeInput');
                $name.val('');
                $type.val('');
                $name[0].focus();
                $('#js-deleteButton').hide();
                $('#js-addMessage').show();
                $('#js-updateMessage').hide();
                selectedId = '';
            })
            .catch(err => handleError(err));
    });

});
