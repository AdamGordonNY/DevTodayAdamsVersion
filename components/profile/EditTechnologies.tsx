import React, { useEffect, useState } from "react";
import {
  Command,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Tech } from "@prisma/client";
import TagX from "../ui/icons/TagX";
interface EditTechnologiesProps {
  techTags: string[];
  setTechTags: (tags: string[]) => void;
  uniqueTags?: Tech[];
  errors: any;
}

const EditTechnologies = ({
  setTechTags,
  errors,
  uniqueTags,
  techTags,
}: EditTechnologiesProps) => {
  const data = uniqueTags?.map((val) => val.toString());

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<string[]>([]);

  const inputRef = React.createRef<HTMLInputElement>();
  const addTag = (tag: string) => {
    if (techTags.includes(tag)) return;
    const newTags = [...techTags, tag];
    setTechTags(newTags);
    setResults([]);
  };
  const removeTag = (tag: string) => {
    const newtags = techTags.filter((t) => t !== tag);
    setTechTags(newtags);
    setResults([]);
  };
  const userTags = techTags;
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        if (inputRef.current === document.activeElement) {
          setSearch("");
          addTag(search);
        }
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, inputRef]);
  useEffect(() => {
    if (!search) {
      setResults([]);
      return;
    }
    const filteredResults = data?.filter((item) =>
      item.toLowerCase().includes(search.toLowerCase())
    );
    setResults(filteredResults || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);
  return (
    <>
      <Command
        className="border-1 flex w-full  flex-1 flex-col   "
        label="Interested Technologies"
      >
        <span className="paragraph-3-medium dark:text-white-200">
          Interested Technologies
        </span>
        <div className="flex flex-1 items-center gap-2.5 rounded-[16px]  bg-white-100 px-5 text-white-300 max-md:flex-wrap max-md:py-2.5 lg:flex-row dark:border-dark-border dark:bg-dark-800">
          {userTags.map((tag) => (
            <div key={tag} className="">
              <span
                key={tag}
                onClick={() => removeTag(tag)}
                className="caption-10 border-#C5D0E6 flex h-fit flex-1 cursor-pointer items-center  gap-x-px rounded-[20px] bg-white-200  py-1 pl-2.5 pr-1.5 !uppercase text-white-400 dark:bg-dark-700 dark:text-white-300"
              >
                {tag}{" "}
                <TagX className="size-3 items-center justify-center align-middle" />
              </span>
            </div>
          ))}

          <CommandInput
            className="border-1 paragraph-3-regular line-clamp-1 flex flex-1 gap-x-2.5 rounded-[16px] border-dark-border text-white-300 outline-none ring-0 focus-visible:ring-0 dark:bg-dark-800"
            ref={inputRef}
            value={search}
            onValueChange={(e) => setSearch(e)}
            placeholder="Enter or Search for a Tag"
          ></CommandInput>
        </div>
        <CommandList>
          {results.length !== 0 && (
            <CommandGroup>
              {results.map((result, i) => {
                if (userTags.includes(result)) return null;
                return (
                  <div
                    key={i}
                    onClick={() => {
                      addTag(result);
                      setSearch("");
                    }}
                  >
                    <CommandItem className=" z-10  flex bg-white-100 !capitalize text-white-400  !opacity-100 dark:bg-dark-800 dark:text-white-300">
                      {result}
                    </CommandItem>
                  </div>
                );
              })}
            </CommandGroup>
          )}
        </CommandList>
      </Command>
    </>
  );
};

export default EditTechnologies;
