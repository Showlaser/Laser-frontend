import { Button, FormLabel } from "@mui/material";
import SelectList from "components/select-list";
import { OnTrue } from "components/shared/on-true";
import { RegisteredLaser } from "models/components/shared/registered-laser";
import { SDCardFile } from "models/components/shared/sd-card-file";
import { useEffect, useState } from "react";
import { deleteSDCardFile, getSDCardFiles } from "services/logic/showlaser-manager";

export type ShowlaserSDCardProps = {
  selectedRegisteredShowlaser: RegisteredLaser | undefined;
};

export default function ShowlaserSDCard({ selectedRegisteredShowlaser }: ShowlaserSDCardProps) {
  const [selectedFilename, setSelectedFilename] = useState<string[] | null>(null);
  const [files, setFiles] = useState<SDCardFile[] | null>(null);
  const file = files?.find((file) => file.filename === selectedFilename?.at(0));

  const prettifyJson = (json: string | undefined): string => {
    if (json === undefined) {
      return "";
    }

    try {
      return JSON.stringify(JSON.parse(json), null, 2);
    } catch {
      return json;
    }
  };

  useEffect(() => {
    if (files === null && selectedRegisteredShowlaser?.uuid !== undefined) {
      getSDCardFiles(selectedRegisteredShowlaser?.uuid).then((files) => {
        if (files !== undefined) {
          setFiles(files);
        }
      });
    }
  }, []);

  const onDeleteSDCardFile = () => {
    if (selectedRegisteredShowlaser?.uuid !== undefined && file !== undefined) {
      deleteSDCardFile(selectedRegisteredShowlaser.uuid, file.filename);
    }
  };

  return (
    <div style={{ marginTop: "15px" }}>
      <FormLabel>SD card</FormLabel>
      <SelectList
        allowSelectMultiple={false}
        onSelect={setSelectedFilename}
        items={
          files?.map((file: SDCardFile) => ({
            uuid: file.filename,
            name: file.filename,
          })) ?? []
        }
      />
      <OnTrue onTrue={(selectedFilename?.length ?? 0) > 0}>
        <>
          <textarea
            style={{ width: "100%", height: "250px" }}
            readOnly={true}
            value={prettifyJson(file?.fileJson)}
          />
          <br />
          <Button
            disabled={selectedRegisteredShowlaser === undefined}
            color="error"
            size="small"
            variant="text"
            onClick={onDeleteSDCardFile}
            style={{ marginTop: "10px" }}
          >
            Remove selected file
          </Button>
        </>
      </OnTrue>
    </div>
  );
}
