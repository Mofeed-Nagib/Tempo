import { Bookmark, Calendar, Flag2, HourglassEmpty } from "tabler-icons-react";

import { Button, NumberInput, Popover, Select, Slider, TextInput, Textarea } from "@mantine/core";
import { DatePicker } from "@mantine/dates";

import { classnames, formatHours } from "../../../../utils/utils";

export const TitleInput = ({ title, setTitle }) => {
  return (
    <TextInput
      value={title}
      onChange={(event) => setTitle(event.currentTarget.value)}
      placeholder="Task name"
      variant="unstyled"
      size="md"
      className="font-medium w-full"
      classNames={{ input: "leading-normal h-auto" }}
    />
  );
};

export const DescriptionInput = ({ description, setDescription }) => {
  return (
    <Textarea
      className="w-full"
      value={description}
      onChange={(event) => setDescription(event.currentTarget.value)}
      placeholder="Description"
      variant="unstyled"
      size="sm"
      autosize
      minRows={1}
      maxRows={5}
    />
  );
};

export const DateInput = ({ date, setDate }) => {
  return (
    <DatePicker
      test-id="date-input"
      label="Due Date"
      value={date}
      onChange={setDate}
      size="xs"
      placeholder="Due Date"
      allowLevelChange={false}
      firstDayOfWeek={"sunday"}
      minDate={new Date()}
      maxDate={new Date(new Date().setFullYear(new Date().getFullYear() + 1))}
      className="w-32"
      labelFormat="MMMM D"
      inputFormat="MMM D"
      icon={<Calendar size={16} />}
      renderDay={(date) => {
        const day = date.getDate();
        const today = new Date().toDateString();
        return (
          <div
            className={classnames(
              date.toDateString() === today && "ring-inset ring-2 ring-blue-500 rounded"
            )}
          >
            {day}
          </div>
        );
      }}
    />
  );
};

export const WorkloadInput = ({ workload, setWorkload }) => {
  return (
    <Popover test-id="workload-input" width={200} position="bottom" withArrow shadow="md">
      <div>
        <div className="h-[18px] text-xs font-medium">Workload</div>
        <Popover.Target>
          <Button
            className="font-normal flex items-center ml-0"
            leftIcon={<HourglassEmpty size={16} />}
            size="xs"
            variant="default"
            style={{ width: "128px", height: "30px" }}
          >
            {workload ? formatHours(workload, true) : "Set Workload"}
          </Button>
        </Popover.Target>
      </div>
      <Popover.Dropdown>
        <div className="w-full flex items-center justify-between mb-2">
          <p className="text-sm text-gray-500">Workload (hours):</p>
          <NumberInput
            test-id="workload-number-input"
            value={workload}
            onChange={setWorkload}
            size="xs"
            className="w-12"
            hideControls
          />
        </div>
        <Slider
          value={workload}
          onChange={setWorkload}
          min={1}
          max={20}
          label={null}
          step={1}
          styles={{ markLabel: { display: "none" } }}
          className="w-full flex items-center"
        />
      </Popover.Dropdown>
    </Popover>
  );
};

export const PriorityInput = ({ priority, setPriority }) => {
  return (
    <Select
      test-id="priority-input"
      clearable
      icon={<Flag2 size={16} />}
      label="Priority"
      placeholder="Set Priority"
      value={priority}
      onChange={setPriority}
      size="xs"
      className="w-32"
      data={[
        { label: "Low", value: "1" },
        { label: "Medium", value: "2" },
        { label: "High", value: "3" },
      ]}
    />
  );
};

export const LabelInput = ({ label, setLabel, labels }) => {
  return (
    <Select
      test-id="label-input"
      clearable
      icon={<Bookmark size={16} />}
      label="Label"
      placeholder="Set Label"
      value={label}
      onChange={setLabel}
      size="xs"
      data={labels.map((label) => ({
        label: label.name,
        value: label.id.toString(),
        style: { backgroundColor: label.color + "20", color: label.color },
      }))}
      className="w-32"
      itemComponent={({ label, value, ...others }) => (
        <div className="py-[1px]">
          <div {...others}>{label || value}</div>
        </div>
      )}
    />
  );
};
