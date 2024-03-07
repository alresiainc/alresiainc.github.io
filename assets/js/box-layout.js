class BoxLayout {
  constructor(selector, options = { header, fullScreenButton, pagination }) {
    this.pluginName = "BoxLayout";
    this.pluginShortName = "Bxl";
    this.selector = selector;
    this.layout = options?.data?.layout;
    this.data = options?.data || { items: ["https://via.placeholder.com/400"] };
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

  viewImages(element) {
    console.log(element);
    this.closeViewer();

    let pre = document.createElement("div");
    pre.className = `${this.createName("pre")}`;
    pre.style.position = "fixed";
    pre.style.top = "0";
    pre.style.left = "0";
    pre.style.zIndex = "99999";
    pre.style.overflow = "hidden";
    pre.style.width = "100%";
    pre.style.height = "100%";
    document.querySelector("body").appendChild(pre);

    let preBody = document.createElement("div");
    preBody.className = `${this.createName("pre-body")}`;
    preBody.style.position = "fixed";
    preBody.style.top = "0";
    preBody.style.left = "0";
    preBody.style.zIndex = "99999";
    preBody.style.overflow = "hidden";
    preBody.style.width = "100%";
    preBody.style.height = "100%";
    preBody.style.backgroundColor = "#0b0b0b";
    preBody.style.opacity = "0.8";

    let preContainer = document.createElement("div");
    preContainer.className = `${this.createName("pre-container")}`;
    preContainer.style.position = "fixed";
    preContainer.style.top = "0";
    preContainer.style.left = "0";
    preContainer.style.zIndex = "99999";
    preContainer.style.overflow = "hidden";
    preContainer.style.width = "100%";
    preContainer.style.height = "100%";

    let preContent = document.createElement("div");
    preContent.className = `${this.createName("pre-content")}`;
    preContent.style.position = "relative";
    preContent.style.zIndex = "99999";
    preContent.style.overflow = "hidden";
    preContent.style.verticalAlign = "middle";
    preContent.style.margin = "0px 50px";
    preContent.style.height = "100%";
    preContent.style.backgroundColor = "#ffffff";

    let closeButton = document.createElement("button");
    closeButton.className = `${this.createName("close-button")}`;
    closeButton.style.position = "absolute";
    closeButton.style.top = "0";
    closeButton.style.right = "0";
    closeButton.style.padding = "7px 13px";
    closeButton.style.backgroundColor = "#eaeaea";
    closeButton.style.border = "0";
    closeButton.style.zIndex = "99999";
    closeButton.innerText = "X";
    closeButton.addEventListener("click", () => this.closeViewer());
    preContent.appendChild(closeButton);

    let preContentItmes = document.createElement("div");
    preContentItmes.className = `${this.createName("pre-content-items")}`;
    preContentItmes.style.margin = "10px 15px";

    let imageContainer = document.createElement("div");
    imageContainer.className = `${this.createName("image-container")}`;
    imageContainer.style.display = "flex";
    imageContainer.style.position = "relative";
    imageContainer.style.justifyContent = "center";
    imageContainer.style.alignItems = "center";
    imageContainer.style.margin = "auto";

    let imageWrapper = document.createElement("div");
    imageWrapper.className = `${this.createName("image-wrapper")}`;
    imageWrapper.style.margin = "0px 50px";
    imageWrapper.style.width = "100%";
    imageWrapper.style.height = "450px";
    imageWrapper.style.display = "flex";
    imageWrapper.style.justifyContent = "center";
    imageWrapper.style.flexDirection = "column";
    imageWrapper.style.alignItems = "center";

    let image = document.createElement("img");
    image.className = `${this.createName("image")}`;
    image.src = element.src;
    // image.style.width = "100%";
    image.style.height = "100%";
    // image.addEventListener("click", () => this.closeViewer());
    imageWrapper.appendChild(image);

    let imageTitle = document.createElement("div");
    imageTitle.className = `${this.createName("image-title")}`;
    imageTitle.innerText = `${element.alt}`;

    imageWrapper.appendChild(imageTitle);

    let prevButton = document.createElement("button");
    prevButton.className = `${this.createName("prev-button")}`;
    prevButton.style.position = "absolute";
    prevButton.style.top = "50%";
    prevButton.style.left = "0";
    prevButton.style.padding = "7px 13px";
    prevButton.style.borderRadius = "5px";
    prevButton.style.backgroundColor = "#eaeaea";
    prevButton.style.border = "0";
    prevButton.innerText = "Prev";

    // prevButton.addEventListener("click", () => {
    //   let itemIndex = parseInt(element.getAttribute("data-item-index"));
    //   let container = element.closest(`.${this.createName("container")}`);
    //   let prevImage = container.querySelector(
    //     `img[data-item-index="${itemIndex - 1}"]`
    //   );
    //   if (prevImage) {
    //     image.src = prevImage.src;
    //   } else {
    //     last = container.querySelectorAll(`img[data-item-index]`).length;
    //     image.src = container.querySelector(
    //       `img[data-item-index="${last - 1}"]`
    //     );
    //   }
    // });
    prevButton.addEventListener("click", () => this.viewPrev(element, image));

    let nextButton = document.createElement("button");
    nextButton.className = `${this.createName("next-button")}`;
    nextButton.style.position = "absolute";
    nextButton.style.top = "50%";
    nextButton.style.padding = "7px 13px";
    nextButton.style.borderRadius = "5px";
    nextButton.style.backgroundColor = "#eaeaea";
    nextButton.style.right = "0";
    nextButton.style.border = "0";
    nextButton.innerText = "Next";

    // nextButton.addEventListener("click", () => {
    //   let itemIndex = parseInt(element.getAttribute("data-item-index"));
    //   let container = element.closest(`.${this.createName("container")}`);
    //   let prevImage = container.querySelector(
    //     `img[data-item-index="${itemIndex + 1}"]`
    //   );
    //   if (prevImage) {
    //     image.src = prevImage.src;
    //   } else {
    //     image.src = container.querySelector(`img[data-item-index="0"]`);
    //   }
    // });
    nextButton.addEventListener("click", () => this.viewNext(element, image));

    imageContainer.appendChild(prevButton);
    imageContainer.appendChild(imageWrapper);
    imageContainer.appendChild(nextButton);

    preContentItmes.appendChild(imageContainer);
    preContent.appendChild(preContentItmes);
    preContainer.appendChild(preContent);

    pre.appendChild(preBody);
    pre.appendChild(preContainer);
  }

  viewNext(element, img) {
    console.log(img);
    console.log(element);
    let itemIndex = parseInt(element.getAttribute("data-item-index"));
    let container = element.closest(`.${this.createName("container")}`);
    let nextImage = container.querySelector(
      `img[data-item-index="${itemIndex + 1}"]`
    );
    console.log(nextImage);
    if (nextImage) {
      // img.src = nextImage.src;
      this.viewImages(nextImage);
    } else {
      let firstImage = container.querySelector(`img[data-item-index="0"]`);
      // img.src = firstImage.src;
      this.viewImages(firstImage);
    }
  }

  viewPrev(element, img) {
    console.log(img);
    console.log(element);
    let itemIndex = parseInt(element.getAttribute("data-item-index"));
    let container = element.closest(`.${this.createName("container")}`);
    let prevImage = container.querySelector(
      `img[data-item-index="${itemIndex - 1}"]`
    );
    console.log(prevImage);
    if (prevImage) {
      // img.src = prevImage.src;
      this.viewImages(prevImage);
    } else {
      let last = container.querySelectorAll(`img[data-item-index]`).length;
      let lastImage = container.querySelector(
        `img[data-item-index="${last - 1}"]`
      );
      // img.src = lastImage.src;
      this.viewImages(lastImage);
    }
  }

  closeViewer() {
    let pre = document.querySelector(`.${this.createName("pre")}`);
    if (pre) {
      pre.remove();
    }
  }

  generateHTML(layout, startIndex = 0) {
    let display;
    let showed = startIndex + 1;
    let itemIndex = startIndex;
    let items = this.data.items;
    const cols = this.customSplit(layout);
    let html;
    // html = `<div style="display: flex;flex-wrap: wrap;width: 100%;height: 100%;" class="${this.createName(
    //   "row"
    // )}">`;
    let row = document.createElement("div");
    row.className = `${this.createName("row")}`;
    row.style.display = "flex";
    row.style.flexWrap = "wrap";
    row.style.width = "100%";
    row.style.height = "100%";

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

        // html += `<div style="flex-shrink: 0;max-width: 100%;flex: 0 0 auto;width:${this.getWidth(
        //   colNum
        // )}%;" class="${this.createName("col")}">`;
        let colDiv = document.createElement("div");
        colDiv.className = `${this.createName("col")}`;
        colDiv.style.flexShrink = 0;
        colDiv.style.flex = "0 0 auto";
        colDiv.style.maxWidth = "100%";
        colDiv.style.width = `${this.getWidth(colNum)}%`;
        colDiv.style.height = "100%";

        // Column contains content

        // html += `<!-- Content for column: ${colNum} -->`;
        // colDiv.appendChild(`<!-- Content for column: ${colNum} -->`);
        let startIndex = col.indexOf("<") + 1;
        let lastIndex = col.indexOf(">");
        let subCol = col.substring(startIndex, lastIndex);

        // html += this.generateHTML(subCol);
        let subHtml = this.generateHTML(subCol, itemIndex);
        // html += subHtml.html;
        colDiv.appendChild(subHtml.html);
        itemIndex = subHtml.itemIndex;
        // html += `<!-- End content for column: ${colNum} -->`;
        // colDiv.appendChild(`<!-- End content for column: ${colNum} -->`);
        console.log(colDiv);
        row.appendChild(colDiv);

        // html += "</div>"; // Close column
      } else {
        let colNum = col.split("-")[1];

        let colDiv = document.createElement("div");
        colDiv.className = `${this.createName("col")}`;
        colDiv.style.flexShrink = 0;
        colDiv.style.flex = "0 0 auto";
        colDiv.style.maxWidth = "100%";
        colDiv.style.width = `${this.getWidth(colNum)}%`;

        let imgContainer = document.createElement("div");
        imgContainer.className = `${this.createName("img-container")}`;
        imgContainer.style.position = "relative";
        imgContainer.style.width = "100%";
        imgContainer.style.height = "100%";
        imgContainer.style.backgroundImage = `url(${items[itemIndex]})`;

        let img = document.createElement("img");
        img.className = `${this.createName("img")}`;
        img.src = `${items[itemIndex]}`;
        img.alt = `Item ${itemIndex + 1}`;
        img.setAttribute("data-item-index", `${itemIndex}`);
        img.style.width = "100%";
        img.style.height = "100%";
        img.width = "100%";
        img.height = "100%";
        imgContainer.appendChild(img);
        img.addEventListener("click", () => this.viewImages(img, items));

        if (itemIndex + 1 == this.maxShow && items.length - this.maxShow > 0) {
          let images = document.createElement("div");
          images.className = `${this.createName("images")}`;
          images.src = `${items[itemIndex]}`;
          images.alt = `item-${itemIndex + 1}`;
          images.style.position = "absolute";
          images.style.backgroundColor = "rgb(0, 0, 0, 0.5)";
          images.style.top = "0";
          images.style.left = "0";
          images.style.height = "100%";
          images.style.width = "100%";
          images.style.display = "flex";
          images.style.alignItems = "center";
          images.style.justifyContent = "center";
          images.innerHTML = `<span style=" border-color:white;color:white;">+${
            items.length - this.maxShow
          }</span>`;
          images.addEventListener("click", () => this.viewImages(img, items));

          imgContainer.appendChild(images);
        }

        colDiv.appendChild(imgContainer);
        row.appendChild(colDiv);
        itemIndex++;
      }
    });

    if (itemIndex == this.maxShow && items.length > itemIndex) {
      for (let index = itemIndex; index < items.length; index++) {
        let colNum = "12";

        let colDiv = document.createElement("div");
        colDiv.className = `${this.createName("col")}`;
        colDiv.style.flexShrink = 0;
        colDiv.style.display = "none";
        colDiv.style.flex = "0 0 auto";
        colDiv.style.maxWidth = "100%";
        colDiv.style.width = `${this.getWidth(colNum)}%`;

        let imgContainer = document.createElement("div");
        imgContainer.className = `${this.createName("img-container")}`;
        imgContainer.style.position = "relative";
        imgContainer.style.width = "100%";
        imgContainer.style.height = "100%";
        imgContainer.style.backgroundImage = `url(${items[index]})`;

        let img = document.createElement("img");
        img.className = `${this.createName("img")}`;
        img.src = `${items[index]}`;
        img.alt = `Item ${index + 1}`;
        img.setAttribute("data-item-index", `${index}`);
        img.style.width = "100%";
        img.style.height = "100%";
        img.width = "100%";
        img.height = "100%";
        imgContainer.appendChild(img);
        colDiv.appendChild(imgContainer);
        row.appendChild(colDiv);
        itemIndex = index;
      }
    }

    // html += "</div>"; // Close row

    // return html;
    console.log(row);
    html = row;
    return { html, itemIndex: itemIndex };
  }

  isElement = (object) => {
    if (!object || typeof object !== "object") {
      return false;
    }

    if (typeof object.jquery !== "undefined") {
      object = object[0];
    }

    return typeof object.nodeType !== "undefined";
  };

  init() {
    let items = this.data.items;
    // Get the number of items
    let numItems = parseInt(
      items.length > this.maxShow ? this.maxShow : items.length
    );

    // Get the layout options for the given number of items
    let layouts = this.customLayout[numItems.toString()];
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

    let container = document.createElement("div");
    container.className = `${this.createName("container")}`;

    let generated = this.generateHTML(layout);

    container.appendChild(generated.html);

    if (this.isElement(this.selector)) {
      this.selector.appendChild(container);
    } else if (typeof object === "string" && object.length > 0) {
      document.querySelector(this.selector).appendChild(container);
    } else {
      document.querySelector(this.selector).appendChild(container);
    }

    // document
    //   .querySelector(`.${this.createName("all-images")}`)
    //   .addEventListener("click", (event) => {
    //     alert("clicked on view all");
    //   });

    // document
    //   .querySelectorAll(`.${this.createName("img")}`)
    //   .forEach((container) => {
    //     container.addEventListener("click", (event) => {
    //       let imageSelector = event.target;
    //       console.log(imageSelector);
    //       alert("clicked on image" + imageSelector.getAttribute("alt"));
    //     });
    //   });
  }
}
