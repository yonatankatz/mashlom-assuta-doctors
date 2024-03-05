var app = angular.module("app", []);

app.controller("TriageController", ['$scope', '$rootScope', '$http', '$timeout', function($scope, $rootScope, $http, $timeout) {
    const ctrl = this;
    window.ctrl = this;
    ctrl.searchText = "";
    ctrl.selectedCategories = [];
    ctrl.selectedRows = [];
    ctrl.triageData = {};
    // values: 1-5, or 100 indicating not set.
    ctrl.triageLevel = 100; 
    ctrl.categories = [];
    ctrl.validMeasures = {};
    // values: RECENTLY_USE, SEARCH_FILTER, CATEGORY_FILTER
    ctrl.itemsShowingState = "RECENTLY_USE";
    // values: TRIAGE, MEASURES
    ctrl.dataShown = "TRIAGE";
    ctrl.colorByLevel = {
        1: "#FE0000",
        2: "#ED4400",
        3: "#b6bf50",
        4: "#44D113",
        5: "#3594E8"
    };

    ctrl.captionByLevel = {
        1: "חדר הלם",
        2: "15 דקות",
        3: "30 דקות",
        4: "60 דקות",
        5: "120 דקות"
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
                        categoryDisplay: state_display ? state_display : state
                        });
                    });
                }
            });
        });
        return outputJson;
    }

    function getCategories(){
        const categories = new Set();
        var result = []
        for (let i = 0; i < ctrl.triageData.length; i++) {
            const currData = ctrl.triageData[i];
            const category = currData.categoryDisplay;
            if (categories.has(category)){
                continue;
            }
            categories.add(category);
            ctrl.categories.push({categoryId: currData.category,
                        categoryDisplay: currData.categoryDisplay});
        }
    }

    function init() {
        $http.get('data/canadian-pediatric-ed-triage.json').then(function(response) {
            // The response.data contains the JSON object
            ctrl.jsonData = response.data;
            ctrl.triageData = flattenJson(ctrl.jsonData);
            getCategories();
            loadTopItems();
        })
        .catch(function(error) {
            console.log('Error fetching triage data file:', error);
        });
        $http.get('data/valid-measures.json').then(function(response) {
            // The response.data contains the JSON object
            ctrl.validMeasures = response.data;
        })
        .catch(function(error) {
            console.log('Error fetching measures data file:', error);
        });
    }
    init();


    function scrollToElement(element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    document.addEventListener("DOMContentLoaded", function() {

    const listContainer = document.getElementById("list");
        readJsonFromFile();
    });

    ctrl.toggleFilter = function(categoryId) {
        ctrl.itemsShowingState = "CATEGORY_FILTER";
        toggleItemInList(ctrl.selectedCategories, categoryId);
        // if there are no more categories - we go back to the roots: the recent items.
        if (ctrl.selectedCategories.length == 0) {
            ctrl.itemsShowingState = "RECENTLY_USE";
        }
    };

    ctrl.showItem = function(item) {
        if (ctrl.itemsShowingState == "RECENTLY_USE") {
            return item.$isRecent;
        } else if (ctrl.itemsShowingState == "CATEGORY_FILTER") {
            return ctrl.selectedCategories.includes(item.category);
        } else if (ctrl.itemsShowingState == "SEARCH_FILTER") {
            return item.description.toUpperCase().indexOf(ctrl.searchText.toUpperCase()) > -1;
        }
        return false;
    };

    function toggleItemInList(list, item) {
        if (list.includes(item)) {
            list.splice(list.indexOf(item), 1);
        } else {
            list.push(item)
        }
    }

    ctrl.toggleRow = function(item) {
        toggleItemInList(ctrl.selectedRows, item);
        ctrl.triageLevel = getMinWaitingTime();
    }

    function getMinWaitingTime() {
        var minWaitingTime = 100;
        for (var i = 0; i < ctrl.selectedRows.length; i++) {
            minWaitingTime = Math.min(ctrl.selectedRows[i].level, minWaitingTime);
        }
        return minWaitingTime;
    }

    function loadTopItems() {
        const usage = getItem("usage");
        let itemsArray = Object.entries(usage);
        itemsArray.sort((a, b) => b[1] - a[1]);
        itemsArray.slice(0, 7);
        let keysArray = itemsArray.map(item => item[0]);
        for (var i = 0; i < ctrl.triageData.length; i++) {
            ctrl.triageData[i].$isRecent = keysArray.includes(ctrl.triageData[i].description);
        }
    }

    function storeSelected() {
        const usage = getItem("usage");
        for (var i = 0; i < ctrl.selectedRows.length; ++i) {
            if (!usage[ctrl.selectedRows[i].description]) {
                usage[ctrl.selectedRows[i].description] = 1;
            }
            else {
                usage[ctrl.selectedRows[i].description] += 1;
            }
        }
        setItem("usage", usage);
    }


    ctrl.resetAll = function() {
        storeSelected();
        ctrl.selectedCategories.length = 0;
        ctrl.selectedRows.length = 0;
        ctrl.triageLevel = 100;
        ctrl.closeSearchBar();
        loadTopItems();
    }

    ctrl.openSearchBar = function() {
        ctrl.dataShown = 'TRIAGE';
        ctrl.searchBarOpen = true; 
        $timeout(function() {
            document.getElementById('searchInput').focus();
          });
    }

    ctrl.closeSearchBar = function() {
        ctrl.searchBarOpen = false; 
        ctrl.searchText = "";
        if (this.selectedCategories.length > 0) {
            ctrl.itemsShowingState = "CATEGORY_FILTER";
        }
        else {
            ctrl.itemsShowingState = "RECENTLY_USE";
        }
    };

    ctrl.searchTyping = function(event) {
        if (event.key === 'Escape' || event.keyCode === 27) {
            ctrl.closeSearchBar();
            return;
        }
        if (ctrl.searchText.length > 0) {
            ctrl.itemsShowingState = "SEARCH_FILTER";
        }
    };
    ctrl.closeMeasures = function() {
        ctrl.dataShown = 'TRIAGE';
    };

    ctrl.openMeasures = function() {
        ctrl.dataShown = 'MEASURES';
    };
}]);