class BoxLayout {
  constructor(selector, options = { header, fullScreenButton, pagination }) {
    this.pluginName = "BoxLayout";
    this.pluginShortName = "Bxl";
    this.selector = selector;
    this.layout = options?.data?.layout;
    this.data = options?.data || [
      { items: ["https://via.placeholder.com/400"] },
    ];
    this.maxShow = options?.maxShow || 5;
    this.itemIndex = 0;
    this.showed = 0;
    this.customLayout = {
      1: ["col-12"],
      2: ["col-12:col-12", "col-6:col-6"],
      3: [
        "col-6:col-6<col-12:col-12>",
        "col-12<col-6:col-6>:col-12",
        "col-6<col-12:col-12>:col-6",
        "col-4:col-4:col-4",
      ],
      4: [
        "col-6:col-6:col-6:col-6",
        "col-6:col-6<col-12:col-12:col-12>",
        "col-12:col-4:col-4:col-4",
      ],
      5: [
        "col-6:col-6:col-4:col-4:col-4",
        "col-6<col-12:col-12>:col-6<col-11:col-12:col-12>",
        "col-6<col-12:col-12:col-12>:col-6<col-12:col-12>",
        "col-8:col-4:col-4:col-4:col-4",
      ],
    };

    this.init();
  }

  createName(str) {
    return `${this.pluginShortName.replace(/\s+/g, "-").toLowerCase()}-${str}`;
  }
  getWidth(col) {
    return (col / 12) * 100;
  }

  customSplit(text) {
    let parts = [];
    let temp = "";
    let withinAngleBrackets = 0;

    for (let char of text) {
      if (char === "<") {
        withinAngleBrackets++;
      } else if (char === ">") {
        withinAngleBrackets--;
      }

      if (char === ":" && withinAngleBrackets === 0) {
        parts.push(temp);
        temp = "";
      } else {
        temp += char;
      }
    }

    if (temp !== "") {
      parts.push(temp);
    }

    return parts;
  }

  generateHTML(items, layout, startIndex = 0) {
    let display;
    let showed = startIndex + 1;
    let itemIndex = startIndex;
    // let items = this.data.items;
    console.log(items);
    const cols = this.customSplit(layout);
    let html;
    html = `<div style="display: flex;flex-wrap: wrap;width: 100%;height: 100%;" class="${this.createName(
      "row"
    )}">`;

    cols.forEach((col) => {
      if (showed <= this.maxShow) {
        display = "";
      } else {
        display = "";
      }
      if (col.includes("<")) {
        // Column contains nested rows
        let colNum = col.split("<")[0];
        colNum = colNum.split("-")[1];

        html += `<div style="flex-shrink: 0;max-width: 100%;flex: 0 0 auto;width:${this.getWidth(
          colNum
        )}%;" class="${this.createName("col")}">`;
        // Column contains content

        html += `<!-- Content for column: ${colNum} -->`;
        let startIndex = col.indexOf("<") + 1;
        let lastIndex = col.indexOf(">");
        let subCol = col.substring(startIndex, lastIndex);

        // html += this.generateHTML(subCol);
        let subHtml = this.generateHTML(items, subCol, itemIndex);
        html += subHtml.html;
        itemIndex = subHtml.itemIndex;
        html += `<!-- End content for column: ${colNum} -->`;
        html += "</div>"; // Close column
      } else {
        let colNum = col.split("-")[1];
        html += `<div style="flex-shrink: 0;max-width: 100%;flex: 0 0 auto;width:${this.getWidth(
          colNum
        )}%;" class="${this.createName("col")}">`;
        // Column contains content
        html += `<!-- Content for column: ${colNum} -->`;
        // html += `<div class="div-class-name  w-100 h-100">`;
        html += `<div class="${this.createName(
          "img-container"
        )}" style="position:relative; height:100%; width:100%;">`;
        html += `<img src="${items[itemIndex]}" alt="item-${
          itemIndex + 1
        }" class="${this.createName(
          "img"
        )}" style="height:100%; width:100%;"/>`;

        if (itemIndex + 1 == this.maxShow && items.length - this.maxShow > 0) {
          html += `<div class="${this.createName(
            "all-images"
          )}" style="position:absolute; top:0; left:0; width:100%; height:100%; display:flex;align-items:center;justify-content:center; ">`;
          html += `<span style=" border-color:white;color:white;">`;
          html += `+${items.length - this.maxShow}`;
          html += `</span>`;
          html += `</div>`;
        }
        html += `</div>`;

        html += `<!-- End content for column: ${colNum} -->`;
        html += "</div>"; // Close column
        itemIndex++;
      }
    });

    // let isRem = (itemIndex < items.length && this.maxShow < itemIndex) ?

    if (itemIndex == this.maxShow && items.length > itemIndex) {
      console.log("EXTRAr");
      console.log(items.length);
      console.log(itemIndex);
      console.log(this.maxShow);
      // if (items[itemIndex] && this.maxShow < items.length) {
      for (let index = itemIndex; index < items.length; index++) {
        let colNum = "12";
        html += `<div style="display:none;flex-shrink: 0;max-width: 100%;flex: 0 0 auto;width:${this.getWidth(
          colNum
        )}%;" class="${this.createName("col")}">`;
        // Column contains content
        html += `<!-- Content for column: ${colNum} -->`;
        html += `<div class="${this.createName(
          "img-container"
        )}" style="position:relative; height:100%; width:100%;">`;
        html += `<img src="${items[index]}" alt="item-${
          index + 1
        }" class="${this.createName(
          "img"
        )}" style="height:100%; width:100%;"/>`;

        html += `</div>`;

        html += `<!-- End content for column: ${colNum} -->`;
        html += "</div>"; // Close column
        itemIndex = index;
      }
    }

    html += "</div>"; // Close row

    // return html;
    return { html, itemIndex: itemIndex };
  }

  init() {
    // let items = this.data.items;

    const slidersContainer = document.createElement("div");
    slidersContainer.className = `${this.createName("sliders-container")}`;

    this.data.forEach((item) => {
      let items = item.items;
      console.log("items");
      console.log(items);
      const slidersItem = document.createElement("div");
      slidersItem.className = `${this.createName("slider-items")}`;
      // Get the number of items
      let numItems = parseInt(
        items.length > this.maxShow ? this.maxShow : items.length
      );

      // Get the layout options for the given number of items
      let layouts = this.customLayout[numItems.toString()];
      console.log(layouts);

      let layout;

      // Check if layout options exist for the given number of items
      if (this.layout) {
        layout = this.layout;
      } else {
        if (layouts && layouts.length > 0) {
          // Pick a random layout from the options
          let randomIndex = Math.floor(Math.random() * layouts.length);
          layout = layouts[randomIndex];
        } else {
          layout = "col-12";
        }
      }

      console.log(layout);

      let generated = this.generateHTML(items, layout);

      //   document
      //     .querySelector(`.${this.createName("all-images")}`)
      //     .addEventListener("click", (event) => {
      //       alert("clicked on view all");
      //     });

      //   document
      //     .querySelectorAll(`.${this.createName("img")}`)
      //     .forEach((container) => {
      //       container.addEventListener("click", (event) => {
      //         let imageSelector = event.target;
      //         console.log(imageSelector);
      //         alert("clicked on image" + imageSelector.getAttribute("alt"));
      //       });
      //     });

      slidersItem.innerHTML = generated.html;
      slidersContainer.appendChild(slidersItem);
    });

    console.log(slidersContainer);

    document.querySelector(this.selector).appendChild(slidersContainer);
  }
}
