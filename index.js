const pickerBtn = document.querySelector("#picker-btn");
const exportBtn = document.querySelector("#export-btn");
const clearBtn = document.querySelector("#clear-btn");
const colorList = document.querySelector(".all-colors");

let pickedColors = JSON.parse(localStorage.getItem("color-list")) || [];

let currentPopup = null;

const copyToClipboard = async (text, element) => {
  try {
    //navigator -> interface that represents the state and the identity of the user agent.
    await navigator.clipboard.writeText(text); //returns clipboard object with read and write access
    element.innerText = "Copied!";
    setTimeout(() => {
      element.innerText = text;
    }, 1000);
  } catch (err) {
    alert("Failed to copy text");
  }
};

const exportColor = () => {
  //converts the array into a string then joins \n to get it in new line
  const colorText = pickedColors.join("\n");
  const blob = new Blob([colorText], { type: "text/plain" });
  const url = URL.createObjectURL(blob); //generates a unique url
  const a = document.createElement("a"); // <a></a>
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
        <span class="close-popup">x</span>
        <div class="color-info">
            <div class="color-preview" style="background: ${color};"></div>
                <div class="color-details">
                    <div class="color-value">
                        <span class="label">Hex:</span>
                        <span class="value hex" data-color="${color}">${color}</span>
                    </div>
                    <div class="color-value">
                        <span class="label">RGB:</span>
                        <span class="value rgb" data-color="${color}">${hexToRgb(color)}</span>
                    </div>
            </div>
        </div>
        </div>
    `;

    //close the button inside popup
    
};
