import express from "express";
import fetch from "node-fetch";

const app = express();
app.use(express.json());

app.post("/", async (req, res) => {
  try {
    const userInput = req.body.request.intent.slots.text.value;

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + process.env.OPENAI_API_KEY,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: userInput
      })
    });

    const data = await response.json();
    const text = data.output[0].content[0].text;

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

app.listen(3000);
