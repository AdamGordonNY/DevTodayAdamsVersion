"use client";

import { useEffect, useState } from "react";
import {
  SearchCommandDialog,
  SearchCommandEmpty,
  SearchCommandGroup,
  SearchCommandInput,
  SearchCommandItem,
  SearchCommandList,
} from "@/components/ui/search-command";
import Link from "next/link";

import { findContent } from "@/lib/actions/search.actions";

import { Layers, Search as SearchIcon } from "../ui/icons";

import SearchItem from "./SearchItem";
import { ContentItemType } from "@/lib/types.d";

const Search = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [content, setContent] = useState<ContentItemType[]>();

  // Toggle the menu when ⌘K is pressed
  useEffect(() => {
    const down = (e: {
      key: string;
      metaKey: any;
      ctrlKey: any;
      preventDefault: () => void;
    }) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  useEffect(() => {
    const getContent = async () => {
      const results = await findContent(searchTerm);
      if (results) setContent(results.content as ContentItemType[]);
    };

    const timeout = setTimeout(() => {
      getContent();
    }, 250);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  return (
    <>
      {/* SearchIcon in the Header */}
      <button
        type="button"
        aria-label={open ? "Close search dialog" : "Open search dialog"}
        className="rounded-md bg-white-200 p-2 transition outline-none hover:bg-white-100 focus-visible:ring-2 focus-visible:ring-primary-500 dark:bg-dark-700 dark:hover:bg-dark-600"
        onClick={() => setOpen((open) => !open)}
      >
        <SearchIcon aria-hidden="true" />
        <span className="sr-only">Search (Press Cmd+K)</span>
      </button>

      <SearchCommandDialog open={open} onOpenChange={setOpen}>
        <SearchCommandInput
          value={searchTerm}
          onValueChange={setSearchTerm}
          placeholder="Type a command or search..."
        />

        <SearchCommandList>
          <SearchCommandEmpty>No results found.</SearchCommandEmpty>
          <SearchCommandGroup>
            <Link href="/posts" onClick={() => setOpen((open) => !open)}>
              <SearchCommandItem>
                <Layers size={18} fill="dark:fill-white-300 fill-white-400" />
                <p>Explore all posts</p>
              </SearchCommandItem>
            </Link>
            {content &&
              content.length > 0 &&
              content.map((item) => {
                return (
                  <SearchItem key={item.id} item={item} setOpen={setOpen} />
                );
              })}
          </SearchCommandGroup>
        </SearchCommandList>
      </SearchCommandDialog>
    </>
  );
};

export default Search;
