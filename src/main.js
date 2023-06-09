import { refs } from "./refs";
import { saveData, getData, deleteData, updateData } from "./api";
import { createCard } from "./markup";

import "bootstrap/dist/css/bootstrap.min.css";
import "./css/style.css";

refs.form.addEventListener("submit", onSubmit);

async function onSubmit(e) {
  e.preventDefault();

  // const { number, name, email } = e.target.elements;
  // const data = {
  //   name: name.value.trim(),
  //   number: number.value.trim(),
  //   email: email.value.trim(),
  // };

  try {
    const data = Object.fromEntries(new FormData(e.target));
    e.target.reset();
    data.createdAt = Date.now();
    await saveData(data);
    const markup = createCard([data]);
    addCard(markup);
  } catch (error) {
    console.log(error.message);
  }
}

async function init() {
  try {
    const response = await getData();
    if (!response.length) {
      return;
    }
    const markup = createCard(response);
    addCard(markup);
  } catch (error) {
    console.log(error.message);
  }
}

function addCard(markup) {
  refs.box.insertAdjacentHTML("beforeend", markup);
}

init();

refs.box.addEventListener("click", deleteCard);

async function deleteCard(e) {
  try {
    if (e.target.nodeName !== "BUTTON") {
      return;
    }
    const {cardId,card} = getInfoCard(e)
    await deleteData(cardId);
    card.remove();
  } catch (error) {
    console.log(error.message);
  }
}

refs.box.addEventListener("input", updateName);

async function updateName (e) {
  try {
    const name=e.target.textContent;
    // console.log(text)
     const {cardId} = getInfoCard(e)
    console.log(cardId) 
    await updateData(cardId, {name})

  } catch (error) {
    console.log (error.message)
    
  }
}
 
function getInfoCard (e) {
  const card = e.target.closest(".js-wrap-card");
  const cardId = card.dataset.cardid;
  return { card, cardId}
}

