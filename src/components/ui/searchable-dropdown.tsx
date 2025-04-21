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
import * as React from "react";
import "../../assets/styles.css";

interface SearchableDropdownProps<T extends { [key: string]: any }>
  extends React.ComponentPropsWithoutRef<typeof RadixSelect.Root> {
  forwardedValue?: string | number;
  onValueChange?: (value: string) => void;
  label: string;
  placeholder: string;
  searchPlaceholder: string;
  keysToMatch: string[];
  valueKey: keyof T;
  labelKey: keyof T;
  dataList: Promise<{ data: T[] }>
}

export default React.forwardRef<
  React.ElementRef<typeof RadixSelect.Root>,
  SearchableDropdownProps<any>
>(function SearchableDropdown(
  {
  forwardedValue,
  onValueChange,
  label,
  placeholder,
  searchPlaceholder,
  keysToMatch,
  valueKey,
  labelKey,
  dataList,
  ...props
}, ref) {
  const [open, setOpen] = useState(false);
  const [internalValue, setInternalValue] = useState<string | number>("0");
  const [searchValue, setSearchValue] = useState("");
 
  // Use forwardedValue if provided, otherwise use internal state
  const value = forwardedValue !== undefined ? forwardedValue : internalValue;

  //const { data } = useQuery({
  //  queryKey: queryKey,
  //  queryFn: queryFn,
  //  //refetchInterval: 120000, //in milliseconds
  //});
  

  const handleValueChange = (newValue: string) => {
    if (onValueChange) {
      onValueChange(newValue);
    } else {
      setInternalValue(newValue);
    }
  };

  const matches = useMemo(() => {
    const items = Array.isArray(dataList) ? dataList : [];
    if (!searchValue) return items;
    const filteredMatches = matchSorter(items, searchValue, { keys: keysToMatch });
  
    const selectedData = items.find(
      (item) => item[valueKey] == value
    );
  
    const finalMatches = [...filteredMatches];
    if (selectedData && !finalMatches.some(item => item[valueKey] === selectedData[valueKey])) {
      finalMatches.push(selectedData);
    }
    return finalMatches; // Make absolutely sure this is always an array
  }, [searchValue, value, dataList, keysToMatch, valueKey]);

  return (
    <RadixSelect.Root
      {...props}
      value={value.toString()}
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
        <RadixSelect.Trigger ref={ref} aria-label={label} className="select">
          <RadixSelect.Value placeholder={placeholder} />
          <RadixSelect.Icon className="select-icon">
            <ChevronUpDownIcon />
          </RadixSelect.Icon>
        </RadixSelect.Trigger>
        <RadixSelect.Content
          role="dialog"
          aria-label={label}
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
              placeholder={searchPlaceholder}
              className="combobox"
              onBlurCapture={(event) => {
                event.preventDefault();
                event.stopPropagation();
              }}
            />
          </div>
          <ComboboxList className="listbox">
            {matches?.map((item: any) => (
              <RadixSelect.Item
                key={item[valueKey]}
                value={String(item[valueKey])}
                asChild
                className="item"
              >
                <ComboboxItem>
                  <RadixSelect.ItemText>{item[labelKey]}</RadixSelect.ItemText>
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
});