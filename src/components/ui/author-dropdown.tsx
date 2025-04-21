import {
    Combobox,
    ComboboxItem,
    ComboboxList,
    ComboboxProvider,
  } from "@ariakit/react";
  import * as RadixSelect from "@radix-ui/react-select";
  import { matchSorter } from "match-sorter";
  import { startTransition, useMemo, useState } from "react";
  import { CheckIcon, ChevronUpDownIcon, SearchIcon } from "./icons.tsx";
import * as React from "react"
import { useQuery } from "@tanstack/react-query";
import { getBookAuthors } from "@/http/api.ts";
import "../../assets/styles.css";
import { Author } from "@/types.ts";
  
interface BookAuthorSearchDropdownProps 
  extends React.ComponentPropsWithoutRef<typeof RadixSelect.Root> {
  forwardedValue?: string;
  onValueChange?: (value: string) => void;
}

export default React.forwardRef<React.ElementRef<typeof RadixSelect.Root>,
BookAuthorSearchDropdownProps>
    (function BookAuthorSearchDropdownProps({forwardedValue,onValueChange,...props}, ref) {
    const [open, setOpen] = useState(false);
    const [internalValue, setInternalValue] = useState("0");
    const [searchValue, setSearchValue] = useState("");
    // Use forwardedValue if provided, otherwise use internal state
    const value = forwardedValue !== undefined || forwardedValue != 0 ? forwardedValue : internalValue;
    

      const {data} = useQuery({
        queryKey: ['book_authors'],
        queryFn: getBookAuthors,
        staleTime: 10000, //in milliseconds
     })
    
     const handleValueChange = (newValue: string) => {
      
      if (onValueChange) {
        onValueChange(newValue);
      } else {
        setInternalValue(newValue);
      }
    };

     
     //console.log(bookCategories);
    const matches = useMemo(() => {
      if (!data?.data) return [];
    if (!searchValue) return data?.data;
      const keys = ["name", "author_id"];
      const matches = matchSorter(data?.data, searchValue, {keys});
     
      // Radix Select does not work if we don't render the selected item, so we
      // make sure to include it in the list of matches.
      const selectedData = data?.data.find((data: { author_id: string; }) => data.author_id == value);
      if (selectedData && !matches.includes(selectedData)) {
        matches.push(selectedData);
      }
      return matches;
    }, [searchValue, value,data?.data]);

    
  
    return (
      <RadixSelect.Root
      {...props}
        value={value}
        onValueChange={handleValueChange}
        open={open}
        onOpenChange={setOpen}
      >
        <ComboboxProvider
        
          open={open}
          setOpen={setOpen}
          resetValueOnHide
          includesBaseElement={false}
          setValue={(value) => {
            startTransition(() => {
              setSearchValue(value);
            });
          }}
        >
          <RadixSelect.Trigger ref={ref} aria-label="Authors" className="select">
            <RadixSelect.Value placeholder="Select an Author" />
            <RadixSelect.Icon className="select-icon">
              <ChevronUpDownIcon />
            </RadixSelect.Icon>
          </RadixSelect.Trigger>
          <RadixSelect.Content
            
            role="dialog"
            aria-label="Author"
            position="popper"
            className="popover w-100"
            sideOffset={4}
            alignOffset={-16}
          >
            <div className="combobox-wrapper">
              <div className="combobox-icon">
                <SearchIcon />
              </div>
              <Combobox
                autoSelect
                placeholder="Search Author"
                className="combobox"
                
                onBlurCapture={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
              />
            </div>
            <ComboboxList className="listbox">
              {matches.map(( author:Author) => (
                <RadixSelect.Item
                  key={author.author_id}
                  value={author.author_id}
                  asChild
                  className="item"
                >
                  <ComboboxItem >
                    <RadixSelect.ItemText>{author.name}</RadixSelect.ItemText>
                    <RadixSelect.ItemIndicator className="item-indicator">
                      <CheckIcon />
                    </RadixSelect.ItemIndicator>
                  </ComboboxItem>
                </RadixSelect.Item>
              ))}
            </ComboboxList>
          </RadixSelect.Content>
        </ComboboxProvider>
      </RadixSelect.Root>
    );
  })