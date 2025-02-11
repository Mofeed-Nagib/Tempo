import { Label } from "../../db/labels";

const { Configuration, OpenAIApi } = require("openai");

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

const configuration = new Configuration({ apiKey: OPENAI_API_KEY });

const openai = new OpenAIApi(configuration);

const getPrompt = (today: string, day: string, rawValue: string, labels: Label[]) => {
  // today in format MM/DD/YYYY
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = `${tomorrow.getMonth() + 1}/${tomorrow.getDate()}/${tomorrow.getFullYear()}`;
  const thisFriday = new Date(today);
  thisFriday.setDate(thisFriday.getDate() + ((5 + 7 - thisFriday.getDay()) % 7));
  const thisFridayStr = `${
    thisFriday.getMonth() + 1
  }/${thisFriday.getDate()}/${thisFriday.getFullYear()}`;

  const labelsStr = "[" + labels.map((label) => label.name).join(", ") + "]";

  const prompt = [
    {
      role: "system",
      content:
        `You are an obedient task assistant. Today's date is ${day}, ${today}. ` +
        "Parse the following text and return a JSON object containing title (string), description (string), due_date (Date), workload (number, in hours), priority (1=low, 2=medium, 3=high), and label (string, one of provided). If a field is not present, insert null. If invalid, insert query into title. If a field is present, remove from title.",
    },
    {
      role: "user",
      content: `Labels: [], presentation due tomorrow`,
    },
    {
      role: "assistant",
      content: `{"title": "Presentation", "description": null, "due_date": "${tomorrowStr}", "workload": null, "priority": null, "label": null}`,
    },
    {
      role: "user",
      content:
        'Labels: ["math", "english"], math Project Proposal on integrals due this Friday, 3 hours of work, high importance',
    },
    {
      role: "assistant",
      content: `{"title": "Project Proposal", "description": "On integrals", "due_date": "${thisFridayStr}", "workload": 3, "priority": 3, "label": "math"}`,
    },
    {
      role: "user",
      content: `Labels: ${labelsStr}, ${rawValue}`,
    },
  ];

  // console.log(prompt);

  return prompt;
};

export default async function handler(req, res) {
  const {
    today,
    day,
    text: rawValue,
    labels,
  }: { today: string; day: string; text: string; labels: Label[] } = req.body;

  if (!rawValue) {
    res.status(400).json({ message: "No input provided" });
    return;
  }

  if (rawValue.length > 100) {
    res.status(400).json({ message: "Input too long" });
    return;
  }

  try {
    const prompt = getPrompt(today, day, rawValue, labels);
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: prompt,
      temperature: 0,
      max_tokens: 100,
      stop: ["}"],
    });

    let output = response.data.choices[0].message.content;
    output = output.endsWith("}") ? output : output + "}"; // add closing } if missing
    output = output.replace(/(\r\n|\n|\r)/gm, ""); // remove newline characters
    output = JSON.parse(output) as {
      title: string | null;
      description: string | null;
      due_date: string | null;
      workload: number | null;
      priority: number | null;
      label: string | null;
    };

    // convert label to label_id
    output.label_id = null;
    if (output.label !== null) {
      const label = labels.find((label) => label.name === output.label);
      if (label) {
        output.label_id = label.id;
      }
    }

    res.status(200).json({ message: output });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error calling ChatGPT" });
  }
}
