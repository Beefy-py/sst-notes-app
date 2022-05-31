import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoaderButton from "../common/LoaderButton";
import { onError } from "../lib/errorLib";
import { config } from "../config";
import { API } from "aws-amplify";
import { s3Upload } from "../lib/awsLib";

export default function NewNote() {
  const file = useRef(null);
  const nav = useNavigate();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  function handleFileChange(event) {
    file.current = event.target.files[0];
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (file.current && file.current.size > config.MAX_ATTACHMENT_SIZE) {
      alert(
        `Please pick a file smaller than ${
          config.MAX_ATTACHMENT_SIZE / 1000000
        } MB.`
      );
      return;
    }

    setLoading(true);

    try {
      const attachment = file.current ? await s3Upload(file.current) : null;

      await createNote({ content, attachment });
      nav("/notes");
    } catch (err) {
      onError(err);
      setLoading(false);
    }
  }

  function createNote(note) {
    return API.post("notes", "/notes", {
      body: note,
    });
  }

  console.log(file.current);

  return (
    <div className="NewNote">
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label
            for="content"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
          >
            Note Content
          </label>
          <textarea
            type="text"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="block p-4 w-full text-gray-900 bg-gray-50 rounded-lg border border-gray-300 sm:text-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        <div className=" w-full mb-6">
          <label
            class="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300"
            for="file_input"
          >
            Attachment
          </label>
          <input
            class="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
            id="file_input"
            onChange={handleFileChange}
            type="file"
          />
        </div>
        <LoaderButton text="Create" isLoading={loading} />
      </form>
    </div>
  );
}
