const toyCollection = document.getElementById('toy-collection');

function createToyCard(toy) {
  const card = document.createElement('div');
  card.className = 'card';

  card.innerHTML = `
    <h2>${toy.name}</h2>
    <img src="${toy.image}" class="toy-avatar" />
    <p>${toy.likes} Likes</p>
    <button class="like-btn" id="${toy.id}">Like ❤️</button>
  `;

  // Attach event listener to the like button here for immediate interactivity
  const likeButton = card.querySelector('.like-btn');
  likeButton.addEventListener('click', () => {
    increaseLikes(toy, card);
  });

  return card;
}

function loadToys() {
  fetch('http://localhost:3000/toys')
    .then(res => res.json())
    .then(toys => {
      toys.forEach(toy => {
        const toyCard = createToyCard(toy);
        toyCollection.appendChild(toyCard);
      });
    })
    .catch(err => console.error('Error loading toys:', err));
}

document.addEventListener('DOMContentLoaded', loadToys);

const toyForm = document.querySelector('form.add-toy-form'); // or your actual form selector

toyForm.addEventListener('submit', event => {
  event.preventDefault();

  const nameInput = toyForm.querySelector('input[name="name"]');
  const imageInput = toyForm.querySelector('input[name="image"]');

  const newToy = {
    name: nameInput.value,
    image: imageInput.value,
    likes: 0
  };

  fetch('http://localhost:3000/toys', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(newToy)
  })
    .then(res => res.json())
    .then(toy => {
      const toyCard = createToyCard(toy);
      toyCollection.appendChild(toyCard);
      toyForm.reset(); // clear form inputs
    })
    .catch(err => console.error('Error adding toy:', err));
});

function increaseLikes(toy, card) {
  const newLikes = toy.likes + 1;

  fetch(`http://localhost:3000/toys/${toy.id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ likes: newLikes })
  })
    .then(res => res.json())
    .then(updatedToy => {
      toy.likes = updatedToy.likes; // update local toy object

      // Update the likes count in the card's <p> tag
      const likesP = card.querySelector('p');
      likesP.textContent = `${updatedToy.likes} Likes`;
    })
    .catch(err => console.error('Error updating likes:', err));
}

const addBtn = document.querySelector('#new-toy-btn');
const toyFormContainer = document.querySelector('.container');

addBtn.addEventListener('click', () => {
  toyFormContainer.classList.toggle('hidden');
});
