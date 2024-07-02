"use client";

import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const Tags = ({
  setValue,
  defaultValueTags = [],
}: {
  setValue: any;
  defaultValueTags?: string[];
}) => {
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState<string[]>(defaultValueTags);

  useEffect(() => {
    setValue("tags", tags);
  }, [setValue, tags]);

  useEffect(() => {
    const onEnter = (event: KeyboardEvent) => {
      if (event.key === "Enter" && document.activeElement?.id === "tags") {
        event.preventDefault();
        const trimmedTags = tagInput
          .trim()
          .split("s*")
          .filter((tag) => tag.length > 0);
        const newTags = [...tags, ...trimmedTags];
        const uniqueTags = Array.from(new Set(newTags));
        setTags(uniqueTags);
        setTagInput("");
      }
    };

    window.addEventListener("keydown", onEnter);
    return () => window.removeEventListener("keydown", onEnter);
  }, [tagInput, tags]);

  useEffect(() => {
    const onBackspace = (event: KeyboardEvent) => {
      if (
        event.key === "Backspace" &&
        tagInput === "" &&
        document.activeElement?.id === "tags"
      ) {
        setTags((prevTag) => prevTag.slice(0, prevTag.length - 1));
        if (tags.length > 0) {
          setTagInput(tags[tags.length - 1]);
          event.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", onBackspace);
    return () => window.removeEventListener("keydown", onBackspace);
  }, [tagInput, tags]);

  useEffect(() => {
    const isLastCharComma = tagInput[tagInput.length - 1] === ",";
    if (isLastCharComma) {
      const trimmedTags = tagInput
        .trim()
        .split(",")
        .filter((tag) => tag.length > 0);
      const newTags = [...tags, ...trimmedTags];
      const uniqueTags = Array.from(new Set(newTags));
      setTags(uniqueTags);
      setTagInput("");
    }
  }, [tagInput, tags]);

  const handleDelete = (tag: string) => {
    const filteredTags = tags.filter((tagToRemove) => tag !== tagToRemove);
    setTags(filteredTags);
    setValue("tags", filteredTags);
  };

  return (
    <section className="flex w-full flex-col">
      <Label className="paragraph-3-medium text-dark-800 dark:text-white-200">
        Add or change tags (up to 5) so readers know what your story is about
      </Label>

      <div className="paragraph-3-regular mt-3 flex w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-white-border bg-white-100 px-4 py-1 dark:border-dark-border dark:bg-dark-800 dark:text-white-200">
        {tags.length > 0 &&
          tags.map((tag, idx) => (
            <span
              key={idx}
              className="my-1 flex h-6 items-center gap-x-2 rounded-2xl bg-white-200 px-3 dark:bg-dark-700"
            >
              <p className="caption-10 pb-0 text-center uppercase text-white-400 dark:text-white-300">
                {tag}
              </p>
              <button type="button" onClick={() => handleDelete(tag)}>
                <X
                  className="flex items-center text-center text-white-400 dark:text-white-300"
                  size={12}
                />
              </button>
            </span>
          ))}

        <Input
          className="paragraph-3-regular disabled:opacity-1 flex h-6 w-fit flex-1 border-none bg-transparent py-0 placeholder:text-white-400 dark:bg-dark-800 dark:text-white-200"
          placeholder={
            tags.length >= 5
              ? "Replace a tag by deleting a tag..."
              : "Add a tag..."
          }
          type="text"
          onChange={(event) => setTagInput(event.target.value)}
          value={tagInput}
          disabled={tags.length >= 5}
          id="tags"
        />
      </div>
    </section>
  );
};

export default Tags;
