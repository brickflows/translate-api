// Initialize a log to store translations
let translationLog = [];

// Function to create a unique key for each translation
function createLogKey(text, sourceLang, targetLang) {
  return `${text}-${sourceLang}-${targetLang}`;
}

// Main translation function
window.function = async function (inputText, sourceLang, targetLang) {
  const apiKey = "854e72f8-5da7-4878-abe5-ed5c7e63517f:fx";

  const text = inputText.value ?? "";
  const source = sourceLang.value ?? "EN"; // Default to English
  const target = targetLang.value ?? "ES"; // Default to Spanish

  // Input validation
  if (!text || text.trim() === "") {
    return "Please enter text to translate.";
  }

  // Create a log key for the current translation request
  const logKey = createLogKey(text, source, target);

  // Check if the translation is already in the log
  const existingTranslation = translationLog.find(entry => entry.key === logKey);

  if (existingTranslation) {
    // Return the existing translation from the log
    return existingTranslation.translation;
  }

  // Helper function to translate text using DeepL API
  async function translateText(text, source, target) {
    const url = "https://api-free.deepl.com/v2/translate";
    const params = new URLSearchParams();
    params.append("auth_key", apiKey);
    params.append("text", text);
    params.append("source_lang", source);
    params.append("target_lang", target);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      return data.translations[0].text; // Adjust based on the response structure
    } catch (error) {
      throw new Error(`Translation failed: ${error.message}`);
    }
  }

  // Call the translate function
  try {
    const translation = await translateText(text, source, target);

    // Save the new translation in the log
    translationLog.push({ key: logKey, translation: translation });

    return translation;
  } catch (error) {
    console.error("Error:", error);
    return `Translation failed: ${error.message}`;
  }
};
