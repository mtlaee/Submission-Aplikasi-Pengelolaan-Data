const RENDER_EVENT = "render-book";
const SAVE_EVENT = "save-book";
const MOVE_EVENT = "move-book";
const DELETE_EVENT = "delete-book";
const STORAGE_KEY = "BOOKSHELF_APPS";
const books = [];

const isStorageExist = () => {
    if (typeof Storage === undefined) {
        alert("Maaf browser tidak mendukung storage");
        return false;
    }
    return true;
};

document.addEventListener(RENDER_EVENT, () => {
    const bukuBelumdibaca = document.getElementById('belumDibaca');
    bukuBelumdibaca.innerHTML = "";
    const bukuSudahdibaca = document.getElementById('sudahDibaca');
    bukuSudahdibaca.innerHTML = "";
    for (const bookItem of books) {
        const bookElement = buatBukuElemen(bookItem);
        if (!bookItem.isComplete) {
            bukuBelumdibaca.append(bookElement);
        } else {
            bukuSudahdibaca.append(bookElement);
        }
    }
});

document.addEventListener(SAVE_EVENT, () => {
    const CustomAlert = document.createElement('div');
    CustomAlert.classList.add('alert');
    CustomAlert.innerText = "Item Berhasil Disimpan";
    document.body.insertBefore(CustomAlert, document.body.children[0]);
    setTimeout(() => {
        CustomAlert.remove();
    }, 2000);
});

document.addEventListener(MOVE_EVENT, () => {
    const CustomAlert = document.createElement('div');
    CustomAlert.classList.add('alert');
    CustomAlert.innerText = "Item Berhasil Dipindahkan";

    document.body.insertBefore(CustomAlert, document.body.children[0]);
    setTimeout(() => {
        CustomAlert.remove();
    }, 2000);
});

document.addEventListener(DELETE_EVENT, () => {
    const CustomAlert = document.createElement('div');
    CustomAlert.classList.add('alert');
    CustomAlert.innerText = "Item Berhasil Dihapus";

    document.body.insertBefore(CustomAlert, document.body.children[0]);
    setTimeout(() => {
        CustomAlert.remove();
    }, 2000);
});

const loadDataFromStorage = () => {
    const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (data !== null) {
        for (const item of data) {
            books.push(item);
        }
    }
    document.dispatchEvent(new Event(RENDER_EVENT));
};

const saveData = () => {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVE_EVENT));
    }
};

const moveData = () => {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(MOVE_EVENT));
    }
};

const deleteData = () => {
    if (isStorageExist()) {
        const parsed = JSON.stringify(books);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(DELETE_EVENT));
    }
};

const tambahBuku = () => {
    const judulBuku = document.getElementById('judul');
    const penulisBuku = document.getElementById('penulis');
    const tahunTerbit = document.getElementById('tahun');
    const statusBukudibaca = document.getElementById('isCheck');
    let bukuChecked;
    if (statusBukudibaca.checked) {
        bukuChecked = true;
    }
    else {
        bukuChecked = false;
    }
    books.push({
        id: +new Date(),
        title: judulBuku.value,
        author: penulisBuku.value,
        year: Number(tahunTerbit.value),
        isComplete: bukuChecked,
    })
    judulBuku.value = null;
    penulisBuku.value = null;
    tahunTerbit.value = null;
    statusBukudibaca.checked = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
};

const buatBukuElemen = (bukuObject) => {
    const judulBukuElemen = document.createElement('p');
    judulBukuElemen.classList.add('item-title');
    judulBukuElemen.innerHTML = `${bukuObject.title} <span>(${bukuObject.year})</span>`;

    const penulisBukuElemen = document.createElement('p');
    penulisBukuElemen.classList.add('item-writer');
    penulisBukuElemen.innerText = bukuObject.author;

    const dekripsiContainer = document.createElement('div');
    dekripsiContainer.classList.add('item-desc');
    dekripsiContainer.append(judulBukuElemen, penulisBukuElemen);

    const actionContainer = document.createElement('div');
    actionContainer.classList.add('item-action');

    const container = document.createElement('div');
    container.classList.add('item');
    container.append(dekripsiContainer);
    container.setAttribute('id', `book-${bukuObject.id}`);

    if (bukuObject.isComplete) {
        const btnReturn = document.createElement('button');
        btnReturn.classList.add('kembalikan-btn');
        btnReturn.innerHTML = `<i class='bx bx-undo'></i>`;

        btnReturn.addEventListener('click', () => {
            kembalikanBukudariSudaDibaca(bukuObject.id);
        });

        const btnDelete = document.createElement('button');
        btnDelete.classList.add('hapus-btn');
        btnDelete.innerHTML = `<i class='bx bx-trash'></i>`;

        btnDelete.addEventListener('click', () => {
            hapusBuku(bukuObject.id);
        });

        actionContainer.append(btnReturn, btnDelete);
        container.append(actionContainer);
    } else {
        const btnFinish = document.createElement('button');
        btnFinish.classList.add('selesai-btn');
        btnFinish.innerHTML = `<i class='bx bx-check'></i>`;

        btnFinish.addEventListener('click', () => {
            addToSudaDibaca(bukuObject.id);
        });

        const btnDelete = document.createElement('button');
        btnDelete.classList.add('hapus-btn');
        btnDelete.innerHTML = `<i class='bx bx-trash'></i>`;

        btnDelete.addEventListener('click', () => {
            hapusBuku(bukuObject.id);
        });

        actionContainer.append(btnFinish, btnDelete);
        container.append(actionContainer);
    }
    return container;
}

const addToSudaDibaca = (bookId) => {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isComplete = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    moveData();
};

const kembalikanBukudariSudaDibaca = (bookId) => {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isComplete = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    moveData();
};

const hapusBuku = (bookId) => {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    deleteData();
};

const findBook = (bookId) => {
    for (const bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
};

const findBookIndex = (bookId) => {
    for (const index in books) {
        if (books[index].id === bookId) {
            return index;
        }
    }
    return -1;
};

document.addEventListener('DOMContentLoaded', () => {
    if (isStorageExist()) {
      loadDataFromStorage();
    }
    const FomDatabuku = document.getElementById('form-tambah-buku');
    FomDatabuku.addEventListener('submit', (event) => {
      event.preventDefault();
      tambahBuku();
    });
});
