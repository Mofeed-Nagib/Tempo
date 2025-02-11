import { watchCalendar } from "src/components/calendar";
import { useSupabase } from "src/components/supabase-provider";

import { useState } from "react";

import { Button, Select, Slider } from "@mantine/core";

const SettingsPage = () => {
  const [days, setDays] = useState([]);

  const marks = [
    { value: 0, label: "1" },
    { value: 1, label: "2" },
    { value: 2, label: "3" },
    { value: 3, label: "4" },
    { value: 4, label: "5" },
    { value: 5, label: "6" },
    { value: 6, label: "7" },
    { value: 7, label: "8" },
    { value: 8, label: "9" },
    { value: 9, label: "10" },
    { value: 10, label: "11" },
    { value: 11, label: "12" },
    { value: 12, label: "13" },
    { value: 13, label: "14" },
    { value: 14, label: "15" },
    { value: 15, label: "16" },
  ];

  const evenMarks = marks.filter((mark) => mark.value % 2 === 1);
  const { supabase, user, calendarToken } = useSupabase();

  return (
    <div className="w-full h-full">
      <div className="text-2xl flex gap-1 pb-8">
        <p className="font-semibold">Settings</p>
      </div>
      <div className="flex items-center">
        <Button onClick={() => watchCalendar(supabase, calendarToken, "primary", user.user_id)}>
          AutoSync with Google Calendar
        </Button>
      </div>
      <div className="flex flex-col pt-8">
        <p>Select the days you would like to work.</p>
        <Button.Group>
          <Button
            variant={days.includes(0) ? "filled" : "default"}
            onClick={() =>
              setDays(days.includes(0) ? days.filter((day) => day !== 0) : [...days, 0])
            }
          >
            Sunday
          </Button>
          <Button
            variant={days.includes(1) ? "filled" : "default"}
            onClick={() =>
              setDays(days.includes(1) ? days.filter((day) => day !== 1) : [...days, 1])
            }
          >
            Monday
          </Button>
          <Button
            variant={days.includes(2) ? "filled" : "default"}
            onClick={() =>
              setDays(days.includes(2) ? days.filter((day) => day !== 2) : [...days, 2])
            }
          >
            Tuesday
          </Button>
          <Button
            variant={days.includes(3) ? "filled" : "default"}
            onClick={() =>
              setDays(days.includes(3) ? days.filter((day) => day !== 3) : [...days, 3])
            }
          >
            Wednesday
          </Button>
          <Button
            variant={days.includes(4) ? "filled" : "default"}
            onClick={() =>
              setDays(days.includes(4) ? days.filter((day) => day !== 4) : [...days, 4])
            }
          >
            Thursday
          </Button>
          <Button
            variant={days.includes(5) ? "filled" : "default"}
            onClick={() =>
              setDays(days.includes(5) ? days.filter((day) => day !== 5) : [...days, 5])
            }
          >
            Friday
          </Button>
          <Button
            variant={days.includes(6) ? "filled" : "default"}
            onClick={() =>
              setDays(days.includes(6) ? days.filter((day) => day !== 6) : [...days, 6])
            }
          >
            Saturday
          </Button>
        </Button.Group>
      </div>
      <div className="flex flex-col pt-8">
        <p>Select the time frame you would like to work.</p>
        <div className="flex gap-2 gap-x-10">
          <Select
            className="w-56"
            classNames={{
              label: "font-semibold",
            }}
            data={[
              "5:00",
              "5:30",
              "6:00",
              "6:30",
              "7:00",
              "7:30",
              "8:00",
              "8:30",
              "9:00",
              "9:30",
              "10:00",
              "10:30",
              "11:00",
              "11:30",
              "12:00",
            ]}
            placeholder="Pick one"
            searchable
            maxDropdownHeight={195}
            label="Start Time (5:00 AM - 12:00 PM)"
            radius="md"
            withAsterisk
          />
          <Select
            className="w-56"
            classNames={{
              label: "font-semibold",
            }}
            data={[
              "5:00",
              "5:30",
              "6:00",
              "6:30",
              "7:00",
              "7:30",
              "8:00",
              "8:30",
              "9:00",
              "9:30",
              "10:00",
              "10:30",
              "11:00",
              "11:30",
              "12:00",
            ]}
            placeholder="Pick one"
            searchable
            maxDropdownHeight={195}
            label="End Time (5:00 PM - 12:00 AM)"
            radius="md"
            withAsterisk
          />
        </div>
      </div>
      <div className="flex flex-col pt-8">
        <p>Select the daily number of hours you would like to work.</p>
        <Slider
          className="w-1/4 pt-2"
          marks={evenMarks}
          defaultValue={7}
          min={0}
          max={15}
          step={1}
          radius="md"
          label={(val) =>
            marks?.find((mark) => mark.value === val)?.label + (val === 0 ? " hour" : " hours")
          }
        />
      </div>
      <div className="flex flex-col pt-12">
        <p>Select your buffer time between events.</p>
        <Select
          className="w-56"
          data={[
            "0 minutes",
            "5 minutes",
            "10 minutes",
            "15 minutes",
            "20 minutes",
            "25 minutes",
            "30 minutes",
          ]}
          maxDropdownHeight={195}
          placeholder="Pick one"
          radius="md"
        />
      </div>
    </div>
  );
};

export default SettingsPage;
