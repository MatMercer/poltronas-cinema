/* Cinema Chair class, describes a chair */
/**
 * @param key The key, eg: 'A1' or 'C5'
 * @param isSelected
 */
function CinemaChair(key, isSelected) {
    const self = this;

    self.key = key;
    self.selected = isSelected;
}
/* Cinema room, describes a room */
/**
 * @param chairMap A matrix of booleans describing the chair map
 * @param {Element} container A DOM element container
 * @param {Element} counterElement A DOM element container
 */
function CinemaRoom(chairMap, container, counterElement) {
    const self = this;
    self.chairMap = chairMap;
    self.container = container;
    self.counterElement = counterElement;
    self.chairsArray = [];
    self.selectedIds = [];

    /**
     * Generates all the chairs based in the chairMap
     */
    self.genChairs = function() {
        let chairId = -1;
        for(i in self.chairMap) {
            let domRow = document.createElement("div");
            self.container.appendChild(domRow);
            for (j in self.chairMap[i]) {
                let chair = self.chairMap[i][j];

                if (chair) {
                    // Appends the chair element
                    chairId += 1;
                    chairObject = new CinemaChair(chairId, false);
                    let domChair = self.createDomChair(chairId, chairObject);
                    domRow.appendChild(domChair);

                    // Add it to the array
                    self.chairsArray[chairId] = chairObject;


                    if(self.selectedIds.indexOf(chairId) !== -1) {
                        self.selectChair(domChair, true);
                    }
                }
                else {
                    let domEmptyChair = self.createEmptyChair();
                    domRow.appendChild(domEmptyChair);
                }
            }
        }

        self.updateSelectedChairs();
    };

    /**
     * Generates a chair DOM element
     * @returns {Element}
     */
    self.createDomChair = function(id, chairObject) {
        chair = document.createElement("span");
        chair.classList.add("chair");
        chair.classList.add("avaible");

        chairImg = document.createElement("img");
        chairImg.src = "/poltronas-cinema/vendor/icons/armchair.svg";

        chair.chairId = id;
        chair.chair = chairObject;

        chair.appendChild(chairImg);

        chair.addEventListener("click", self.chairClick);

        return chair;
    };

    /**
     * Generates a empty chair DOM element
     * @returns {Element}
     */
    self.createEmptyChair = function() {
        chair = document.createElement("span");
        chair.classList.add("chair");
        chair.classList.add("empty");

        return chair;
    };

    /**
     * Handles a chair click
     * @param {MouseEvent} event
     */
    self.chairClick = function(event) {
        const chairDom = event.srcElement.parentNode;

        if (chairDom.chair !== undefined) {
            const chair = self.chairsArray[chairDom.chair.key];

            if (chair.selected) {
                self.unselectChair(chairDom);
            }
            else {
                self.selectChair(chairDom, false);
            }
        }
    };

    /**
     * Selects a chair
     * @param {Element} chairDom
     * @param {boolean} cookieConsumed
     */
    self.selectChair = function (chairDom, cookieConsumed) {
        chairDom.chair.selected = true;

        // Manages the classes
        chairDom.classList.remove("avaible");
        chairDom.classList.add("occuped");

        if (!cookieConsumed) {
            self.selectedIds.push(chairDom.chair.key);
            self.updateSelectedChairs();
        }
    };

    /**
     * Unselects a chair
     * @param {Element} chairDom
     */
    self.unselectChair = function(chairDom) {
        chairDom.chair.selected = false;

        // Manages the classes
        chairDom.classList.remove("occuped");
        chairDom.classList.add("avaible");

        const index = self.selectedIds.indexOf(chairDom.chair.key);
        self.selectedIds.splice(index, 1);

        self.updateSelectedChairs();
    };

    /**
     * Updates the counter element and cookies
     */
    self.updateSelectedChairs = function() {
        self.counterElement.textContent = self.selectedIds.length + ' / ' + self.chairsArray.length;
        self.saveCookies();
    };

    /**
     * Save the selected chairs to cookies
     */
    self.saveCookies = function () {
        const expiresDate = new Date();
        expiresDate.setTime(expiresDate.getTime() + (60*60*1000));
        const expires = "expires="+ expiresDate.toUTCString();

        const chairsJSON = JSON.stringify(self.selectedIds);

        document.cookie = "selectedChairs=" + chairsJSON + ";" + expires + ";path=/";
    };

    /**
     * Sends the selected chairs from cookie to the
     * self.selectedIds array
     */
    self.getSelectedChairsFromCookies = function() {
        equalIndx = document.cookie.indexOf("=");

        try {
            self.selectedIds = window.JSON.parse(document.cookie.substr(equalIndx + 1, document.cookie.length - 1));
        }
        catch (e) {}
    };

    // Init the room
    self.getSelectedChairsFromCookies();
    self.genChairs();
}
