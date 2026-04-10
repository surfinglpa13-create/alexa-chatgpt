import express from "express";

const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
  try {
   let userInput = "hola";

if (req.body.request?.type === "IntentRequest") {
  userInput =
    req.body.request.intent?.slots?.text?.value ||
    req.body.request.intent?.name ||
    "hola";
} else if (req.body.request?.type === "LaunchRequest") {
  userInput = "hola";
}

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: userInput
      })
    });

    const data = await response.json();

    console.log("OPENAI RESPONSE:", data);

 let text = "No pude generar respuesta";

if (data.output_text) {
  text = data.output_text;
} else if (data.output?.[0]?.content?.[0]?.text) {
  text = data.output[0].content[0].text;
}
    res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: text
        },
        shouldEndSession: false
      }
    });
  } catch (error) {
    console.error("ERROR:", error);

    res.json({
      version: "1.0",
      response: {
        outputSpeech: {
          type: "PlainText",
          text: "Error conectando con ChatGPT"
        }
      }
    });
  }
});

app.listen(3000, () => console.log("Server running"));
