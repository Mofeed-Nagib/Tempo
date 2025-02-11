import React, { useEffect, useState } from "react";

import { Button, Switch, TextInput } from "@mantine/core";
import { getHotkeyHandler, useFocusTrap } from "@mantine/hooks";

import { usePage } from "../pageContext";
import {
  DateInput,
  DescriptionInput,
  LabelInput,
  PriorityInput,
  TitleInput,
  WorkloadInput,
} from "./shared";

const option1 = "Enable ChatGPT to automatically parse your task (Experimental)";
const option2 = "Automatically parse your task";
const option3 = "AI-powered task creation";
const labelOptions = [option1, option2, option3];

const GPTMagic = async (labels, debouncedValue = null, rawValue = null) => {
  const today = new Date(); // MM/DD/YYYY
  const todayStr = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
  const response = await fetch("/api/create-task", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      today: todayStr,
      day: today.toLocaleDateString("en-US", { weekday: "long" }),
      labels: labels,
      text: debouncedValue ?? rawValue,
    }),
  });
  return response;
};

const CreateInline = () => {
  const { insertTask, labels, metrics, updateMetric } = usePage();
  const focusTrap = useFocusTrap();

  const [rawValue, setRawValue] = useState("");
  const [debouncedValue, setDebouncedValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [gptRan, setGptRan] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState(new Date());
  const [workload, setWorkload] = useState(1);
  const [priority, setPriority] = useState("2");
  const [label, setLabel] = useState(null);

  const [text, setText] = useState(option1);

  const option_1 = metrics.find((metric) => metric.id == 1);
  const option_2 = metrics.find((metric) => metric.id == 2);
  const option_3 = metrics.find((metric) => metric.id == 3);

  const option_1_reward = option_1.reward;
  const option_2_reward = option_2.reward;
  const option_3_reward = option_3.reward;

  const option_1_total = option_1.total;
  const option_2_total = option_2.total;
  const option_3_total = option_3.total;

  const rewards = [
    option_1_reward / option_1_total,
    option_2_reward / option_2_total,
    option_3_reward / option_3_total,
  ];

  const updateTotalCount = (text: string) => {
    if (text == option1) {
      const metric = metrics.find((metric) => metric.id == 1);
      if (metric) {
        updateMetric({
          id: 1,
          total: metric.total + 1,
          reward: metric.reward,
        });
      }
    } else if (text == option2) {
      const metric = metrics.find((metric) => metric.id == 2);
      if (metric) {
        updateMetric({
          id: 2,
          total: metric.total + 1,
          reward: metric.reward,
        });
      }
    } else if (text == option3) {
      const metric = metrics.find((metric) => metric.id == 3);
      if (metric) {
        updateMetric({
          id: 3,
          total: metric.total + 1,
          reward: metric.reward,
        });
      }
    }
  };

  // bandit algorithm for metrics milestone
  if (sessionStorage.getItem("switch_text") == null) {
    if (Math.random() < 0.3) {
      const selectedLabel = labelOptions[Math.floor(Math.random() * labelOptions.length)];
      sessionStorage.setItem("switch_text", selectedLabel);
      updateTotalCount(sessionStorage.getItem("switch_text"));
      // useEffect(() => setText(selectedLabel), []);
    } else {
      const selectedLabel = labelOptions[rewards.indexOf(Math.max(...rewards))];
      sessionStorage.setItem("switch_text", selectedLabel);
      updateTotalCount(sessionStorage.getItem("switch_text"));
      // useEffect(() => setText(selectedLabel), []);
    }
  }

  const resetState = () => {
    setRawValue("");
    setDebouncedValue("");
    setLoading(false);

    setTitle("");
    setDescription("");
    setDueDate(new Date());
    setWorkload(1);
    setPriority("2");
    setLabel(null);
    setGptRan(false);
  };

  // useEffect(() => {
  //   updateTotalCount(sessionStorage.getItem("switch_text"));
  // }, [sessionStorage.getItem("switch_text")]);

  const updateReward = (text: string) => {
    if (text == option1) {
      const metric = metrics.find((metric) => metric.id == 1);
      if (metric) {
        updateMetric({
          id: 1,
          total: metric.total,
          reward: metric.reward + 1,
        });
      }
    } else if (text == option2) {
      const metric = metrics.find((metric) => metric.id == 2);
      if (metric) {
        updateMetric({
          id: 2,
          total: metric.total,
          reward: metric.reward + 1,
        });
      }
    } else if (text == option3) {
      const metric = metrics.find((metric) => metric.id == 3);
      if (metric) {
        updateMetric({
          id: 3,
          total: metric.total,
          reward: metric.reward + 1,
        });
      }
    }
  };

  const switchOnChange = (switch_event, text) => {
    setChecked(switch_event);
    updateReward(text);
  };

  // window.addEventListener("beforeunload", handleBeforeUnload);

  // const handleBeforeUnload = (event) => {
  //   sessionStorage.clear();
  // };

  useEffect(() => {
    if (rawValue === "") {
      return resetState();
    }

    if (!checked) {
      setTitle(rawValue);
    } else {
      setTitle("");
    }

    const timeout = setTimeout(() => {
      setLoading(true);
      setDebouncedValue(rawValue);
    }, 500);

    return () => clearTimeout(timeout);
  }, [rawValue, checked]);

  const callGPTMagic = async (state) => {
    console.log(state);

    const response = await GPTMagic(state.labels, state.rawValue);
    const data = await response.json();
    console.log(data);
    const message = data?.message;
    console.log(message);

    const task = {
      title: message?.title ?? (state.title || state.rawValue),
      description: message?.description ?? state.description,
      start_date: new Date().toISOString(),
      end_date: message?.due_date
        ? new Date(message?.due_date).toISOString()
        : state.dueDate.toISOString(),
      expected_duration: message?.workload ? parseInt(message?.workload) : parseInt(state.workload),
      priority: message?.priority ? parseInt(message?.priority) : parseInt(state.priority),
      label: message?.label_id ? parseInt(message?.label_id) : parseInt(state.label),
    };

    insertTask(task);
    return message;
  };

  useEffect(() => {
    const queryChatGPT = async () => {
      // setLoading(false);
      const response = await GPTMagic(labels, debouncedValue);

      const data = await response.json();
      const message = data?.message;

      setTitle(message?.title ?? debouncedValue);
      setDescription(message?.description ?? "");
      setDueDate(message?.due_date ? new Date(message?.due_date) : new Date());
      setWorkload(message?.workload ?? 1);
      setPriority(message?.priority?.toString() ?? "2");
      setLabel(message?.label_id?.toString() ?? null);
      setGptRan(true);
    };

    if (debouncedValue && checked) {
      queryChatGPT();
    }
  }, [debouncedValue, labels, checked]);

  const valid = (title || rawValue) && dueDate && workload > 0 && priority;

  const createTask = async () => {
    if (!valid) return;
    if (!gptRan) {
      const currentState = {
        title: title,
        rawValue: rawValue,
        dueDate: dueDate,
        workload: workload,
        priority: priority,
        label: label,
        description: description,
        debouncedValue: debouncedValue,
        labels: labels,
      };

      if (checked) {
        console.log("called");
        callGPTMagic(currentState);
        resetState();
        setRawValue("");
        return;
      }
    }
    console.log("Didn't trigger GPT");

    const task = {
      title: title || rawValue,
      description: description,
      start_date: new Date().toISOString(),
      end_date: dueDate.toISOString(),
      expected_duration: workload,
      priority: parseInt(priority),
      label: parseInt(label),
    };

    insertTask(task);
    resetState();
    setRawValue("");
  };

  const switch_text = sessionStorage.getItem("switch_text");

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-end">
        <TextInput
          test-id="create-task-input"
          label="Create a Task"
          placeholder="Just start typing..."
          className="w-80"
          value={rawValue}
          onChange={(event) => {
            setRawValue(event.currentTarget.value);
            setGptRan(false);
          }}
          ref={focusTrap}
          onKeyPress={getHotkeyHandler([["Enter", createTask]])}
        />
        <Button
          test-id="create-task-button"
          onClick={() => {
            createTask();
          }}
          disabled={!valid}
          // loading={checked && (loading || rawValue !== debouncedValue)}
          className="ml-2"
        >
          Create Task
        </Button>
      </div>
      <div className="flex items-center mt-2">
        <Switch
          test-id="gpt-switch"
          checked={checked}
          onChange={(event) => switchOnChange(event.currentTarget.checked, switch_text)}
          label={switch_text}
        />
      </div>
      {rawValue?.length > 0 && (
        <div className="p-2 m-2 mt-4 border-2 border-dashed border-gray-400 rounded-xl bg-gray-50">
          <TitleInput title={title || rawValue} setTitle={setTitle} />
          <DescriptionInput description={description} setDescription={setDescription} />
          <div className="w-full flex items-end justify-start gap-1 mt-2">
            <DateInput date={dueDate} setDate={setDueDate} />
            <WorkloadInput workload={workload} setWorkload={setWorkload} />
            <PriorityInput priority={priority} setPriority={setPriority} />
            <LabelInput label={label} setLabel={setLabel} labels={labels} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CreateInline;
