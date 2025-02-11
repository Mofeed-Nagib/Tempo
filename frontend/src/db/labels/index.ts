import { deleteLabel } from "./delete";
import { insertLabel } from "./insert";
import { selectLabels } from "./select";
import Label, { InsertLabel, UpdateLabel } from "./types";
import { updateLabel } from "./update";

export type { Label, InsertLabel, UpdateLabel };

export { selectLabels, insertLabel, updateLabel, deleteLabel };
