import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import { getDatabase, ref, push, onValue, remove } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const firebaseConfig = {
    databaseURL: "https://praiseappfirebase-default-rtdb.firebaseio.com/"
  };

  const app = initializeApp(firebaseConfig)
  const database = getDatabase(app)
  const messagesInDB = ref(database, "praiseMessages")

const textInput = document.querySelector(".text-input");
const publishBtn = document.querySelector(".publish-btn");
const messagesDiv = document.querySelector(".endorsements")
const inputFrom = document.querySelector("#from")
const inputTo = document.querySelector("#to")

publishBtn.addEventListener("click", function() {
    const inputValue = textInput.value;
    const fromValue = inputFrom.value;
    const toValue = inputTo.value;
    let message = {
        from: fromValue,
        to: toValue,
        message: inputValue
    }

    if (textInput.value && inputFrom.value && inputTo.value) {
        
        push(messagesInDB, message)
        textInput.value = ""
        inputFrom.value = ""
        inputTo.value = ""
    } else {
       
         textInput.placeholder = `Please write your endorsement message!`
    }


   

})

onValue(messagesInDB, function(snapshot) {
    // Clear the messagesDiv before appending new items
    clearMsgDiv();

    // Check if snapshot value is null (i.e., database is empty)
    if (snapshot.val() === null) {
        // If database is empty, display a message
        messagesDiv.innerHTML = `<p style="color: white;">No items here......yet</p>`;
    } else {
        // If database has items, iterate over them and append to messagesDiv
        let itemsArray = Object.entries(snapshot.val());
        console.log(itemsArray)
        for (let i = itemsArray.length - 1; i >= 0; i--) {
            appendToBody(itemsArray[i]);
        }
    }
});


function appendToBody(item) {
    
    let msgParagraph = document.createElement('div');

    let itemId = item[0];
    let itemMessage = item[1].message
    let itemFrom = item[1].from;
    let itemTo = item[1].to
    msgParagraph.classList.add('messageInput')
    msgParagraph.innerHTML += `<p class="to-from">To: ${itemTo}</p> <p class="msg-body">${itemMessage}</p><p class="to-from">From ${itemFrom}</p>`
    messagesDiv.append(msgParagraph)

    msgParagraph.addEventListener("click", function() {

        

       let exactLocationOfItemInDB = ref(database, `praiseMessages/${itemId}`)
       remove(exactLocationOfItemInDB)
    })

}

function clearMsgDiv() {
    messagesDiv.innerHTML = ""
}


