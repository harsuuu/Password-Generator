//fetch all the element using query selector.
const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
//for getting random symbol for our password we create this symbol variable.
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';


//initially
//password length zero
let password = "";
//slider --> 10 pe hoga automatically that's why initiall length :  10
let passwordLength = 10;
//intially 0 check box mark krke de rha hai.
let checkCount = 0;
handleSlider();
//set strength circle color to grey
setIndicator("#ccc");


//set passwordLength --> isse call krne se UI pr bhi reflect hoga.
function handleSlider() {
    inputSlider.value = passwordLength;
    //staring m jo 10 tha ab passwordLength k according change hota rhega.
    lengthDisplay.innerText = passwordLength;

    //ye formula hai jb slider ka thumb move krenge to jha tk move kra hai usme background color change rhe baki ka peeche bala hi color rhe. 
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}
//hme min - max ke beech ka chaiye random integer to this formula-->
function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowerCase() {  
     //ASCII value se lower case find krna
       return String.fromCharCode(getRndInteger(97,123))
}

function generateUpperCase() {  
    //ASCII value se upper case find krna
    return String.fromCharCode(getRndInteger(65,91))
}

function generateSymbol() {
    //jo uper symbol string ki length hai usse random le liya. 
    const randNum = getRndInteger(0, symbols.length);
    //use character bnakr return kr diya.
    //charAt--> character at that index.
    return symbols.charAt(randNum);
}

//Rules for calculating strong and less strength password.
function calcStrength() {
    //initially sari checkboox, unchecked hai.
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    //agr uppercase, checked hai to true mark krdo.
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
      setIndicator("#0f0");
    } else if (
      (hasLower || hasUpper) &&
      (hasNum || hasSym) &&
      passwordLength >= 6
    ) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}
//copy password bala button
async function copyContent() {
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible --> COPIED acche se likha aaye uske liye kr rhe hai ye --> "active".
    copyMsg.classList.add("active");
    //copied message 2 second bala hta do.
    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);

}

function shufflePassword(array) {
    //Fisher Yates Method --> algorithm to suffle array
    for (let i = array.length - 1; i > 0; i--) {
        //find random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

//jese hi checkbox pr kuch changes aayega then ye function call aayega.
function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition --> agr sare checked hai and slider se length 1 kr rkhi hai to bo automatic 4 ho jayegi qki 4 hi checkbox hai.
    if(passwordLength < checkCount ) {
        passwordLength = checkCount;
        handleSlider();
    }
}
//sare checkbox pr evenListner lga do.
allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})


inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})


copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
    copyContent();
})

generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected to return kr jao.
    if(checkCount == 0) 
        return;
    //and count how many checbox is checked.
    //this special condition
    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // let's start the jouney to find new password
    console.log("Starting the Journey");
    //remove old password
    password = "";

    //let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    //ye uper bala to tb chlega jb sirf 4 length ka hoga
    //lekin agr length 10 ho to loop lga kr lo.
    let funcArr = [];

    if(uppercaseCheck.checked)
        funcArr.push(generateUpperCase);

    if(lowercaseCheck.checked)
        funcArr.push(generateLowerCase);

    if(numbersCheck.checked)
        funcArr.push(generateRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(generateSymbol);

    //compulsory addition --> jo jo checked bo bale aa gye.
    for(let i=0; i<funcArr.length; i++) {
        password += funcArr[i]();
    }
    console.log("Compulsory adddition done");

    //remaining adddition --> checked ke alaba jitne add krne hai.
    for(let i=0; i<passwordLength-funcArr.length; i++) {
        //random integer nikal lo and password m push krdo.
        let randIndex = getRndInteger(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        password += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");
    //shuffle the password 
    password = shufflePassword(Array.from(password));
    console.log("Shuffling done");
    //show in password in UI
    passwordDisplay.value = password;
    console.log("UI adddition done");
    //calculate strength --> jb password nikal gya.
    calcStrength();
});