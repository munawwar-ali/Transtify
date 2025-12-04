async function translateWord(word, fromLang = "en", toLang = "hi") {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
    word
  )}&langpair=${fromLang}%7C${toLang}`;
  console.log(url);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);

    if (data.responseStatus === 200) {
      return {
        success: true,
        translation: data.responseData.translatedText,
      };
    } else {
      return {
        success: false,
        error: data.responseDetails || "Translation failed",
      };
    }
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
}

async function fetchWordData(word) {
  const url = `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    const definition = data[0].meanings[0].definitions[0].definition;

    const audio = data[0].phonetics.find((p) => p.audio)?.audio || null;

    let example = "No example available";

    for (let meaning of data[0].meanings) {
      for (let def of meaning.definitions) {
        if (def.example) {
          example = def.example;
          break;
        }
      }
      if (example !== "No example available") break;
    }

    return {
      status: true,
      word: word,
      definition: definition,
      example: example,
      audio: audio,
    };
  } catch (error) {
    return {
      status: false,
      error: "Word not found",
    };
  }
}

let mnemonicDB = {};

fetch("mnemonics.json")
  .then((res) => res.json())
  .then((data) => {
    mnemonicDB = data;
  })
  .catch((err) => console.error("Error loading mnemonics:", err));

function getMnemonic(word) {
  word = word.toLowerCase().trim();

  if (mnemonicDB[word]) {
    return mnemonicDB[word];
  }

  if (word.length > 6) {
    const mid = Math.floor(word.length / 2);
    const part1 = word.slice(0, mid);
    const part2 = word.slice(mid);
    return `💡 Break it: "${part1.toUpperCase()}" + "${part2.toUpperCase()}" - Say it 5 times to remember`;
  }

  return `💡 Write "${word.toUpperCase()}" 5 times and use it in 3 sentences`;
}

const btn = document.getElementById("btn");
btn.addEventListener("click", async () => {
  const inputValue = document.getElementById("input").value.trim();
  if (!inputValue) {
    console.error("Enter a valid word");
    return;
  }
  console.log(inputValue);
  setTimeout(() => {
    document.getElementById("hide0").classList.remove("hide1");
  }, 850);

  try {
    const result = await translateWord(inputValue, "en", "hi");

    if (result.success) {
      document.getElementById("hello").innerText = result.translation;
    } else {
      console.error("Translation error:", result.error);
    }
  } catch (err) {
    console.error("Something went wrong:", err);
  }

  try {
    const result2 = await fetchWordData(inputValue);
    if (result2.status) {
      document.getElementById("defineArea").innerText = `${result2.definition}`;
      document.getElementById("audio").src = result2.audio;
      document.getElementById("exampleArea").innerText = result2.example;
      document.getElementById("define").innerText = result2.word;
    } else {
      console.error("Not working", result2.error);
    }
  } catch (err) {
    console.error("Something went wrong:", err);
  }
  const mnemonicText = getMnemonic(inputValue);
  document.getElementById("mnemo").innerText = mnemonicText;
});

const form = document.querySelector("form");
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const inputValue = document.getElementById("input").value.trim();
  if (!inputValue) {
    console.error("Enter a valid word");
    return;
  }
  console.log(inputValue);
  setTimeout(() => {
    document.getElementById("hide0").classList.remove("hide1");
  }, 850);

  try {
    const result = await translateWord(inputValue, "en", "hi");

    if (result.success) {
      document.getElementById("hello").innerText = result.translation;
    } else {
      console.error("Translation error:", result.error);
    }
  } catch (err) {
    console.error("Something went wrong:", err);
  }

  try {
    const result2 = await fetchWordData(inputValue);
    if (result2.status) {
      document.getElementById("defineArea").innerText = `${result2.definition}`;
      document.getElementById("audio").src = result2.audio;
      document.getElementById("exampleArea").innerText = result2.example;
      document.getElementById("define").innerText = result2.word;
    } else {
      console.error("Not working", result2.error);
    }
  } catch (err) {
    console.error("Something went wrong:", err);
  }

  const mnemonicText = getMnemonic(inputValue);
  document.getElementById("mnemo").innerText = mnemonicText;
});
// Close dialog when clicking "Continue"
document.getElementById("continueBtn").addEventListener("click", () => {
  document.getElementById("welcomeDialog").style.display = "none";
});
