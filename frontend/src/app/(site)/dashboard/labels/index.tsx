import { Check, Edit, Refresh, Trash, X } from "tabler-icons-react";

import React, { useState } from "react";

import { ActionIcon, Button, ColorInput, Input } from "@mantine/core";

import { Modal, Tooltip } from "../../../../components/ui";
import { Label, UpdateLabel } from "../../../../db/labels";
import { randomColor } from "../../../../utils/utils";
import { usePage } from "../pageContext";

const LabelObj = ({
  label,
  updateLabel,
  setOpenDeleteModal,
}: {
  label: Label;
  updateLabel: (label: UpdateLabel) => void;
  setOpenDeleteModal: (id: number | null) => void;
}) => {
  const [name, setName] = useState(label.name);
  const [color, setColor] = useState(label.color);
  const [editMode, setEditMode] = useState(false);

  return (
    <div
      test-id="label"
      className="group w-120 max-w-full h-16 p-2 rounded-lg hover:bg-gray-50 border"
      style={{ borderColor: color, backgroundColor: color + "20" }}
    >
      {editMode ? (
        <div className="w-full h-full flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color }} />
            <Input
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
              placeholder="Label Name"
              className="w-32"
            />
            <ColorInput
              value={color}
              onChange={setColor}
              disallowInput
              withPicker={true}
              withEyeDropper={false}
              swatches={[
                "#ef4444",
                "#f97316",
                "#eab308",
                "#22c55e",
                "#14b8a6",
                "#0ea5e9",
                "#3b82f6",
                "#8b5cf6",
                "#ec4899",
                "#737373",
              ]}
              rightSection={
                <ActionIcon onClick={() => setColor(randomColor())}>
                  <Refresh size={16} />
                </ActionIcon>
              }
              closeOnColorSwatchClick={true}
              className="ml-2 w-32"
            />
          </div>
          <div className="flex">
            <Tooltip label="Save Label">
              <div>
                <Check
                  size={36}
                  color="green"
                  className="p-2 rounded-full hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    updateLabel({ id: label.id, name, color });
                    setEditMode(false);
                  }}
                />
              </div>
            </Tooltip>
            <Tooltip label="Cancel">
              <div>
                <X
                  size={36}
                  className="p-2 rounded-full text-red-500 hover:bg-gray-200 cursor-pointer"
                  onClick={() => {
                    setName(label.name);
                    setColor(label.color);
                    setEditMode(false);
                  }}
                />
              </div>
            </Tooltip>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-between">
          <div className="flex items-center">
            <div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: color }} />
            <p className="font-medium">{name}</p>
          </div>
          <div className="flex">
            <Tooltip label="Edit Label">
              <div>
                <Edit
                  test-id={`label-edit-${name}`}
                  size={36}
                  color="gray"
                  className="p-2 rounded-full hover:bg-gray-200 hidden group-hover:block cursor-pointer"
                  onClick={() => setEditMode(true)}
                />
              </div>
            </Tooltip>
            <Tooltip label="Delete Label">
              <div>
                <Trash
                  size={36}
                  className="p-2 rounded-full text-red-500 hover:bg-gray-200 hidden group-hover:block cursor-pointer"
                  onClick={() => setOpenDeleteModal(label.id)}
                />
              </div>
            </Tooltip>
          </div>
        </div>
      )}
    </div>
  );
};

const DeleteLabelModal = ({
  opened,
  setOpened,
}: {
  opened: number | null;
  setOpened: (opened: number | null) => void;
}) => {
  const { deleteLabel } = usePage();

  const removeLabel = () => {
    deleteLabel(opened);
    setOpened(null);
  };

  return (
    <Modal
      centered
      size="md"
      title="Are you sure you want to delete this label? This will disassociate all tasks with this label."
      withCloseButton={false}
      opened={opened !== null}
      onClose={() => setOpened(null)}
    >
      <div className="flex flex-col items-center">
        <div className="flex flex-row space-x-4">
          <Button onClick={() => setOpened(null)} variant="outline" color="gray">
            Cancel
          </Button>
          <Button onClick={removeLabel} className="bg-red-500 hover:bg-red-600">
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

const LabelsPage = () => {
  const [openDeleteLabelModal, setOpenDeleteLabelModal] = useState(null);

  const { labels, updateLabel, insertLabel } = usePage();
  const numLabels = labels.length;

  return (
    <div className="w-full h-full">
      <DeleteLabelModal opened={openDeleteLabelModal} setOpened={setOpenDeleteLabelModal} />
      <div className="text-2xl flex gap-1">
        <p className="font-semibold">Labels</p> ({numLabels}/5)
      </div>
      <div className="flex flex-col gap-4 mt-4">
        {labels.map((label) => (
          <LabelObj
            label={label}
            updateLabel={updateLabel}
            setOpenDeleteModal={setOpenDeleteLabelModal}
            key={`label-${label.id}`}
          />
        ))}
      </div>
      <div>
        <Button
          test-id="create-label-button"
          className="mt-4"
          onClick={() => insertLabel({ name: "New Label", description: "", color: randomColor() })}
          variant="outline"
          color="gray"
          disabled={numLabels >= 5}
        >
          Create Label
        </Button>
      </div>
    </div>
  );
};

export default LabelsPage;
