const popupContainer = document.getElementById("popup-container");
const okButton = document.getElementById("ok-button");
const cancelButton = document.getElementById("cancel-button");
const nameInput = document.getElementById("name");
const incomeInput = document.getElementById("income");
const priceInput = document.getElementById("price");
const addButton = document.getElementById("add-button");
const deleteButton = document.getElementById("delete-button");

var items = JSON.parse(localStorage.getItem("items")) || [];

/*for (let index = 0; index < 10; index++) {
    addItem();
}*/

addButton.onclick = function () {
    nameInput.value = "Investment";
    incomeInput.value = "10";
    priceInput.value = "1000";
    deleteButton.style.display = "none";
    okButton.onclick = function () {
        for (let i = 0; i < items.length; i++) {
            const element = items[i];
            if (element.name == nameInput.value) {
                return;
            }
        }
        if (validateInputs()) {
            addItem();
            showPopup(false);
        }
    }
    cancelButton.onclick = function () {
        showPopup(false);
    }
    showPopup(true);
}

updateContent();

function validateInputs() {
    if (Number(incomeInput.value) == NaN || Number(priceInput.value) == NaN) {
        return false;
    }
    if (incomeInput.value < 0 || priceInput.value < 0) {
        return false;
    }
    return nameInput.value != "" && incomeInput.value != "" && priceInput.value != "";
}

function showPopup(show) {
    popupContainer.style.display = show ? "flex" : "none";
}

function addItem() {
    let item = {
        name: nameInput.value,
        income: incomeInput.value,
        price: priceInput.value,
    }

    items.push(item);

    updateContent();
}

function removeItem(itemName) {
    for (let i = 0; i < items.length; i++) {
        if (items[i].name == itemName) {
            items.splice(i, 1);
        }
    }

    updateContent();
}

function editItem(itemName) {
    let itemIndex = null;

    for (let i = 0; i < items.length; i++) {
        if (items[i].name == itemName) {
            itemIndex = i;
            break;
        }
    }

    if (itemIndex == null) {
        return;
    }

    nameInput.value = items[itemIndex].name;
    incomeInput.value = items[itemIndex].income;
    priceInput.value = items[itemIndex].price;

    okButton.onclick = function () {
        if (validateInputs()) {
            items[itemIndex].name = nameInput.value;
            items[itemIndex].income = incomeInput.value;
            items[itemIndex].price = priceInput.value;
            updateContent();
            showPopup(false);
        }
    }
    cancelButton.onclick = function () {
        updateContent();
        showPopup(false);
    }

    deleteButton.style.display = "flex";
    deleteButton.onclick = function () {
        removeItem(itemName);
        showPopup(false);
    }
    showPopup(true);
}

function updateContent() {
    items.sort((a, b) => b.income / b.price - a.income / a.price);
    localStorage.setItem("items", JSON.stringify(items));
    document.getElementById("content").innerHTML = "";
    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        console.log(items[i]);
        let content = document.createElement("div");
        content.classList.add("item");
        content.innerHTML = `
        <div class="item-name">${item.name}</div>
        <div style = "display: flex; justify-content: space-between;">
        <div class="item-income">+${Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 2 }).format(item.income)}</div>
        <div class="item-price">${Intl.NumberFormat('en-US', { notation: "compact", maximumFractionDigits: 2 }).format(item.price)}</div>
        <div class="item-result">${((item.income / item.price) * 100).toFixed(0)}%</div>
        </div>
        `;
        content.onclick = function () {
            editItem(item.name);
        }
        document.getElementById("content").appendChild(content);
    }
    let dummy = document.createElement("div");
    dummy.style.marginTop = "50px";
    //document.getElementById("content").appendChild(dummy);
}