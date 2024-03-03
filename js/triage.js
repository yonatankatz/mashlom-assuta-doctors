let selectedCategories = [];
let selectedRows = [];
let triageData = {};

const colorByLevel = {
    1: "#FE0000",
    2: "#ED4400",
    3: "#E7FF0D",
    4: "#44D113",
    5: "#3594E8"
};

const captionByLevel = {
    1: "חדר הלם",
    2: "15 דקות",
    3: "30 דקות",
    4: "60 דקות",
    5: "120 דקות"
}


function scrollToElement(element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function populateChips(flattenJson){
    const chipsContainer = document.getElementById("filters");
    const chipValues = new Set();
    for (let i = 0; i < flattenJson.length; i++) {
        const category = flattenJson[i].category_display;
        if (chipValues.has(category)){
            continue;
        }
        
        chipValues.add(category);
        const chip = document.createElement("div");
        chip.classList.add("chip");
        chip.textContent = category;
        const stringToFilter = flattenJson[i].category;
        chip.addEventListener("click", function() {
            toggleFilter(this,stringToFilter);
        });
        if (chipValues.size  == 13) {
            chip.id="anchor-for-scrolling";
        }
        chipsContainer.appendChild(chip);
    }
}

document.addEventListener("DOMContentLoaded", function() {

const listContainer = document.getElementById("list");
    readJsonFromFile();
});

function toggleFilter(chipElement, category) {
    console.log(category);
    chipElement.classList.toggle('selected');
    if (chipElement.classList.contains('selected')) {
        selectedCategories.push(category); // Add category to the selected list
    } else {
        var index = selectedCategories.indexOf(category);
        if (index !== -1) {
            selectedCategories.splice(index, 1); // Remove category from the selected list
        }
    }
    filterTable();
    scrollToElement(document.getElementById("anchor-for-scrolling"));
}

function filterTable() {
    for (var i = 0; i < triageData.length; i++) {
        const currCondition = document.getElementById("item" + i);
        if (selectedCategories.length == 0 || selectedCategories.includes(triageData[i].category)) {
            currCondition.style.display = "";
        } else {
            currCondition.style.display = "none";
        }
    }
}

function readJsonFromFile() {
  fetch('data/canadian-pediatric-ed-triage.json')
      .then(response => response.json())
      .then(data => {
        
          triageData = flattenJson(data);
          console.log(triageData);
          populateChips(triageData);
          populateListItems(triageData);
          loadTopItems();
      })
      .catch(error => console.error('Error reading JSON file:', error));
}

function flattenJson(inputJson) {
        let outputJson = [];

        inputJson.states.forEach(stateItem => {
            const state = stateItem.state;
            const state_display = stateItem.state_display_name;

            Object.keys(stateItem).forEach(key => {
                if (key !== 'state' && key !== 'state_display_name') {
                    let level = key.split('-')[0];
                    level = level === "immediate" ? 1 : parseInt(level.substring(5));
                    const symptoms = stateItem[key].symptoms;

                    symptoms.forEach(symptom => {
                        outputJson.push({
                          category: state,
                          description: symptom,
                          level: level,
                          category_display: state_display ? state_display : state
                        });
                    });
                }
            });
        });

return outputJson;
}

function populateListItems(jsonData) {
    const conditionsContainer = document.getElementById("list-conditions");
    for (var i = 0; i < jsonData.length; i++) {
        const listItem = document.createElement("div");
        listItem.id = "item" + i;
        listItem.classList.add("list-condition");
        listItem.innerHTML = `${jsonData[i].description}<span class="badge" style="background-color: ${colorByLevel[jsonData[i].level]}">${jsonData[i].level}</span>`;
        const constI = i;
        listItem.addEventListener("click", function(event) {
            toggleRow(event.target, constI);
        });        
        conditionsContainer.appendChild(listItem);
    }
}

function toggleRow(row, index) {
if (row.classList.contains("selected-row")) {
  row.classList.remove("selected-row");
  var rowIndex = selectedRows.indexOf(index);
  if (rowIndex !== -1) {
    selectedRows.splice(rowIndex, 1); // Remove deselected row index from selectedRows
  }
} else {
  row.classList.add("selected-row");
  selectedRows.push(index); // Add selected row index to selectedRows
}
console.log(selectedRows); // Print selected row indices (you can remove this)
const level = getMinWaitingTime();
if (level !== Infinity){
    setTriageLevel(level);
}
else {
    initTriageLevel();
}
}

function getMinWaitingTime() {
    var minWaitingTime = Infinity;
    for (var i = 0; i < selectedRows.length; i++) {
        var rowIndex = selectedRows[i];
        minWaitingTime = Math.min(triageData[rowIndex].level, minWaitingTime);
    }

    return minWaitingTime;
}

function loadTopItems() {
    const usage = getItem("usage");
    let itemsArray = Object.entries(usage);
    itemsArray.sort((a, b) => b[1] - a[1]);
    itemsArray.slice(0, 7);
    let keysArray = itemsArray.map(item => parseInt(item[0]));
    for (var i = 0; i < triageData.length; i++) {
        const currCondition = document.getElementById("item" + i);
        if (keysArray.includes(i)) {
            currCondition.style.display = "";
        } else {
            currCondition.style.display = "none";
        }
    }
}

function storeSelected() {
    const usage = getItem("usage");
    for (var i = 0; i < selectedRows.length; ++i) {
        if (!usage[selectedRows[i]]) {
            usage[selectedRows[i]] = 1;
        }
        else {
            usage[selectedRows[i]] += 1;
        }
    }
    setItem("usage", usage);
}


function resetAll() {
    storeSelected();
    var rowsToDeselected = document.querySelectorAll(".selected");
    rowsToDeselected.forEach(function(row) {
        row.classList.remove("selected");
    });
    rowsToDeselected = document.querySelectorAll(".selected-row");
    rowsToDeselected.forEach(function(row) {
        row.classList.remove("selected-row");
    });
    selectedCategories = [];
    selectedRows = [];
    initTriageLevel();
    scrollToElement(document.getElementById("header"));
    closeSearchBar();
    loadTopItems();
}

function initTriageLevel() {
    const element = document.getElementById("triage-level");
    element.innerHTML = "בחר מצב חולה. לאיפוס, לחץ כאן ->"
    const headerElement = document.getElementById("header");
    headerElement.style.backgroundColor = "#FFFFFF";
}

function setTriageLevel(level) {
    const element = document.getElementById("triage-level");
    element.innerHTML = `<span class="triage-caption">טריאז' ${level}</span><span class="triage-sub-caption">${captionByLevel[level]}</span>`;
    const headerElement = document.getElementById("header");
    headerElement.style.backgroundColor = colorByLevel[level]; 
}

function closeSearchBar() {
    const element = document.getElementById("searchbox-container");
    const footerMenuElement = document.getElementById("footer-menu");
    element.style.display = 'none';
    footerMenuElement.style.display = 'block';
    document.getElementById('searchInput').value = "";
    resetSearch();
}

function openSearchBar() {
    const element = document.getElementById("searchbox-container");
    const footerMenuElement = document.getElementById("footer-menu");

    element.style.display = 'block';
    footerMenuElement.style.display = 'none';
    const searchInputElement = document.getElementById('searchInput');
    searchInputElement.focus();

}

function toggleSearchBar() {
    const element = document.getElementById("searchbox-container");
    const footerMenuElement = document.getElementById("footer-menu");
    if (element.style.display === 'none' || element.style.display === '') {  
        openSearchBar();
    } else {
        closeSearchBar();
    }
}

function resetSearch() {
    filterTable();
}

function searchTyping(event) {
    if (event.key === 'Escape' || event.keyCode === 27) {
        toggleSearchBar();
        return;
    }
    var allRows = document.querySelectorAll(".list-condition");
    const input = document.getElementById("searchInput");
    const filter = input.value.toUpperCase();
    if (!filter) {
        resetSearch();
        return;
    }
    for (var i = 0; i < triageData.length; i++) {
        const currCondition = document.getElementById("item" + i);
        if (triageData[i].description.toUpperCase().indexOf(filter) > -1) {            
            currCondition.style.display = "";
        }
        else {
            currCondition.style.display = "none";
        }
    }
}

document.getElementById('searchBtn').addEventListener('click', function() {
    toggleSearchBar();
});