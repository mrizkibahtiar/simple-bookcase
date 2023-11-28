const title = document.querySelector('#title');
const author = document.querySelector('#author');
const year = document.querySelector('#year');
const isComplete = document.querySelector('#statusBaca');
const warning = document.querySelector('#warning');
const submit = document.querySelector('#submit');
const storageKey = 'DATA_BUKU';

function masukkanData() {
    const dataBukuBaru = {
        id: new Date().getTime(),
        title: title.value,
        author: author.value,
        year: parseInt(year.value),
        isComplete: isComplete.checked,
    }
    masukkanStorage(dataBukuBaru);
}

function cekForm() {
    if (title.value === "" || author.value === "" || year.value === "") {
        warning.classList.remove('hidden');
        return false;
    } else {
        if (warning.classList.contains('hidden')) {
            masukkanData();
            return true;
        } else {
            warning.classList.add('hidden');
            masukkanData();
            return true;
        }
    }
}


submit.addEventListener('click', function (e) {
    cekForm();
    tampilkanKeLayar();
    e.preventDefault();
});

isComplete.addEventListener('click', function () {
    if (isComplete.checked) {
        submit.querySelector('span').innerText = 'finished';
    } else {
        submit.querySelector('span').innerText = 'not finished';
    }
})

function cekStorage() {
    return typeof (Storage) !== undefined;
}

function masukkanStorage(data) {
    if (cekStorage()) {
        let dataBuku = [];
        if (localStorage.getItem(storageKey) !== null) {
            dataBuku = JSON.parse(localStorage.getItem(storageKey));
        }
        dataBuku.push(data);
        localStorage.setItem(storageKey, JSON.stringify(dataBuku));
    }
}

function getDataBuku() {
    if (cekStorage()) {
        return JSON.parse(localStorage.getItem(storageKey)) || [];
    } else {
        return [];
    }
}

function tampilkanKeLayar() {
    const dataBuku = getDataBuku();
    document.querySelector('.rak-selesai').innerHTML = `<h2 class='title'>finished reading</h2>`;
    document.querySelector('.rak-belum-selesai').innerHTML = `<h2 class='title'>not finished reading</h2>`;

    for (let i = 0; i < dataBuku.length; i++) {
        const rakTujuan = dataBuku[i].isComplete ? '.rak-selesai' : '.rak-belum-selesai';
        const rakElemen = document.querySelector(rakTujuan);

        let div = document.createElement('div');
        div.classList.add(dataBuku[i].isComplete ? 'card-selesai' : 'card-belum');
        div.innerHTML = `
            <h2>${dataBuku[i].title}</h2>
            <p>Author : ${dataBuku[i].author}</p>
            <p>Year : ${dataBuku[i].year}</p>
            <button ${dataBuku[i].isComplete ? 'class=button-belum' : 'class=button-selesai'}>${dataBuku[i].isComplete ? 'not finished' : 'finished'}</button>
            <button class='button-hapus' >delete</button>
        `;

        rakElemen.appendChild(div);


        if (dataBuku[i].isComplete === true) {
            const buttonBelum = div.querySelector('.button-belum');
            buttonBelum.addEventListener('click', function () {
                dataBuku[i].isComplete = false;
                localStorage.setItem(storageKey, JSON.stringify(dataBuku));
                tampilkanKeLayar();
            });

            const buttonHapus = div.querySelector('.button-hapus');
            buttonHapus.addEventListener('click', function () {
                dataBuku.splice(i, 1);
                localStorage.setItem(storageKey, JSON.stringify(dataBuku));
                tampilkanKeLayar();
            });
        } else {
            const buttonSelesai = div.querySelector('.button-selesai');
            buttonSelesai.addEventListener('click', function () {
                dataBuku[i].isComplete = true;
                localStorage.setItem(storageKey, JSON.stringify(dataBuku));
                tampilkanKeLayar();
            });

            const buttonHapus = div.querySelector('.button-hapus');
            buttonHapus.addEventListener('click', function () {
                dataBuku.splice(i, 1);
                localStorage.setItem(storageKey, JSON.stringify(dataBuku));
                tampilkanKeLayar();
            });
        }
    }
}


window.addEventListener('load', function () {
    if (cekStorage) {
        if (this.localStorage.getItem !== null) {
            tampilkanKeLayar();
        }
    } else {
        alert('Browser anda tidak mendukung web storage');
    }
});
