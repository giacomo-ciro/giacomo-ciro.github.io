function wrapLetters() {
    const textContainers = document.querySelectorAll('#magnify p');

    textContainers.forEach(container => {
      const text = container.textContent;
      const letters = text.split('');

      const wrappedText = letters.map(letter => {
        if (letter !== ' ') {
          return `<span class="magnified">${letter}</span>`;
        } else {
          return ' ';
        }
      }).join('');

      container.innerHTML = wrappedText;
    });
  }

  wrapLetters(); // Wrap letters on page load

  // Add hover effect to magnify letters
  const magnifyLetters = document.querySelectorAll('.magnified');

  magnifyLetters.forEach(letter => {
    letter.addEventListener('mouseover', function () {
      this.style.fontSize = '1.5em'; // Adjust the magnification level as needed
    });

    letter.addEventListener('mouseout', function () {
      this.style.fontSize = '1em'; // Return to original size on mouseout
    });
  });