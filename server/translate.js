module.exports = async function translate({
  googleCloudTranslate,
  message,
  lang,
}) {
  try {
    const [translation] = await googleCloudTranslate.translate(message, lang);

    return translation;
  } catch (error) {
    console.log(error);
  }
};
