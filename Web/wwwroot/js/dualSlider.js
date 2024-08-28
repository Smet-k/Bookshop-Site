
const fromSlider = document.getElementById('fromSlider');
const toSlider = document.getElementById('toSlider');
const fromInput = document.getElementById('fromInput');
const toInput = document.getElementById('toInput');

function minSliderInput() {
    const [from, to] = getCurrentValues(fromSlider, toSlider);
    fillSlider('#C6C6C6', '#78c2ad');
    if (from > to) {
        fromSlider.value = to;
        fromInput.value = to;
    } else {
        fromInput.value = from;
    }
    updateInputValues();
}

function maxSliderInput() {
    const [from, to] = getCurrentValues(fromSlider, toSlider);
    fillSlider('#C6C6C6', '#78c2ad');
    setToggleAccessible(toSlider);
    if (from <= to) {
        toSlider.value = to;
        toInput.value = to;
    } else {
        toInput.value = from;
        toSlider.value = from;
    }
    updateInputValues();
}

function getCurrentValues(currentFrom, currentTo) {
    const from = parseInt(currentFrom.value);
    const to = parseInt(currentTo.value);
    return [from, to];
}

function fillSlider(sliderColor, rangeColor) {
    const rangeDistance = toSlider.max - toSlider.min;
    const fromPosition = fromSlider.value - toSlider.min;
    const toPosition = toSlider.value - toSlider.min;

    // main slider background color should be changed
    toSlider.style.background = `linear-gradient(
              to right,
              ${sliderColor} 0%,
              ${sliderColor} ${(fromPosition) / (rangeDistance) * 100}%,
              ${rangeColor} ${((fromPosition) / (rangeDistance)) * 100}%,
              ${rangeColor} ${(toPosition) / (rangeDistance) * 100}%,
              ${sliderColor} ${(toPosition) / (rangeDistance) * 100}%,
              ${sliderColor} 100%)`;
}

function setToggleAccessible(currentTarget) {

    if (Number(currentTarget.value) <= 0) {
        toSlider.style.zIndex = 2;
    } else {
        toSlider.style.zIndex = 0;
    }
}

function updateInputValues() {
    const [from, to] = getCurrentValues(fromSlider, toSlider);
    minValue = fromSlider.min;
    maxValue = toSlider.max
    fromInput.value = Math.max(from, minValue);
    toInput.value = Math.min(to, maxValue);
    fromSlider.min = minValue;
    fromSlider.max = maxValue;
    toSlider.max = maxValue;
    toSlider.min = minValue;
}

updateInputValues();

fillSlider('#C6C6C6', '#78c2ad');
setToggleAccessible(toSlider);

fromSlider.oninput = () => minSliderInput();
toSlider.oninput = () => maxSliderInput();