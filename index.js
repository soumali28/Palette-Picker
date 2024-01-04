const pickerBtn = document.querySelector("#picker-btn");
const exportBtn = document.querySelector("#export-btn");
const clearBtn = document.querySelector("#clear-btn");
const colorList = document.querySelector(".all-colors");

let pickedColors = JSON.parse(localStorage.getItem("color-list")) || [];

let currentPopUp = null;

const copyToClipboard = async (text, element) => {
  try {
    await navigator.clipboard.writeText(text);
    element.innerText = "Copied!";
    setTimeout(() => {
      element.innerText = text;
    }, 1000);
  } catch (err) {
    alert("Failed to copy text! 1");
  }
};

const exportColor = () => {
  const colorText = pickedColors.join("\n");
  const blob = new Blob([colorText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a"); //<a></a>
  a.href = url;
  a.download = "Colors.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

const createColorPopup = (color) => {
  const popup = document.createElement("div");
  popup.classList.add("color-popup");
  popup.innerHTML = `
        <div class="color-popup-content">
            <div class="rule"></div>
            <div class="color-info">
                <div class="color-preview" style="background: ${color};"></div>
                    <div class="color-details">
                        <div class="color-value">
                            <span class="label">Hex:</span>
                            <span class="value hex" data-color="${color}">${color}</span>
                        </div>
                        <div class="color-value">
                            <span class="label">RGB:</span>
                            <span class="value rgb" data-color="${color}">${hexToRgb(
    color
  )}</span>
                        </div>
                </div>
            </div>
        </div>
    `;

  // Event listeners to copy color values to clipboard
  const colorValues = popup.querySelectorAll(".value");
  colorValues.forEach((value) => {
    value.addEventListener("click", (e) => {
      const text = e.currentTarget.innerText;
      copyToClipboard(text, e.currentTarget);
    });
  });

  return popup;
};

const showColors = () => {
  colorList.innerHTML = pickedColors
    .map(
      (color) =>
        `
            <li class="color">
                <span class="rect" style="background: ${color}; border: 1px solid ${
          color === "#ffffff" ? "#ccc" : color
        }" data-color="${color}"></span>
                <span class="value hex colorspan" data-color="${color}">${color}</span>
            </li>
        `
    )
    .join("\n");

  const colorElements = document.querySelectorAll(".color");
  colorElements.forEach((li) => {
    const colorRect = li.querySelector(".rect");
    const colorHex = li.querySelector(".value.hex");

    // Add click event to copy hex code to clipboard
    colorRect.addEventListener("click", (e) => {
      const hexCode = e.currentTarget.dataset.color;
      copyToClipboard(hexCode, "");
      colorRect.style.borderColor = "#00ff00"; // Green border to indicate success
      colorHex.innerHTML = "Copied!";

      setTimeout(() => {
        colorHex.innerHTML = hexCode;
        colorRect.style.borderColor = ""; // Revert border color
      }, 1000);

      const color = e.currentTarget.dataset.color;
      if (currentPopUp) {
        document.body.removeChild(currentPopUp);
      }
      const popup = createColorPopup(color);
      document.body.appendChild(popup);
      currentPopUp = popup;
    });

    // colorHex.addEventListener("click", (e) => {
    //   const color = e.currentTarget.dataset.color;
    //   if (currentPopUp) {
    //     document.body.removeChild(currentPopUp);
    //   }
    //   const popup = createColorPopup(color);
    //   document.body.appendChild(popup);
    //   currentPopUp = popup;
    // });
  });

  const pickedColorsContainer = document.querySelector(".color-list");
  pickedColorsContainer.classList.toggle("hide", pickedColors.length === 0);
};

const hexToRgb = (hex) => {
  const bigInt = parseInt(hex.slice(1), 16);
  const r = (bigInt >> 16) & 255;
  const g = (bigInt >> 8) & 255;
  const b = bigInt & 255;
  return `rgb(${r}, ${g}, ${b})`;
};

const activateEyeDropper = async () => {
  if (!"EyeDropper" in window) {
    alert("Sorry, the browser doesnot support Eyedropper Api");
    return;
  }
  document.body.style.display = "none";
  try {
    const { sRGBHex } = await new EyeDropper().open();
    const color = RGBAToHexA(sRGBHex).slice(0, -2);
    if (!pickedColors.includes(color)) {
      pickedColors.push(color);
      localStorage.setItem("colors-list", JSON.stringify(pickedColors));
    }

    showColors();
  } catch (error) {
    alert(error);
  } finally {
    document.body.style.display = "block";
  }
};

function RGBAToHexA(rgba, forceRemoveAlpha = false) {
  return (
    "#" +
    rgba
      .replace(/^rgba?\(|\s+|\)$/g, "") // Get's rgba / rgb string values
      .split(",") // splits them at ","
      .filter((string, index) => !forceRemoveAlpha || index !== 3)
      .map((string) => parseFloat(string)) // Converts them to numbers
      .map((number, index) => (index === 3 ? Math.round(number * 255) : number)) // Converts alpha to 255 number
      .map((number) => number.toString(16)) // Converts numbers to hex
      .map((string) => (string.length === 1 ? "0" + string : string)) // Adds 0 when length of one number is 1
      .join("")
  ); // Puts the array to togehter to a string
}
const clearAll = () => {
  pickedColors = [];
  localStorage.removeItem("colors-list");
  showColors();

  // Close the popup if it's open
  if (currentPopUp) {
    document.body.removeChild(currentPopUp);
    currentPopUp = null;
  }
};

pickerBtn.addEventListener("click", activateEyeDropper);
clearBtn.addEventListener("click", clearAll);
exportBtn.addEventListener("click", exportColor);

showColors();
