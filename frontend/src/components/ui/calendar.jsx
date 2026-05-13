import * as React from "react"
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from "lucide-react"
import { DayPicker, getDefaultClassNames } from "react-day-picker";

import { cn } from "@/lib/utils"
import { Button, buttonVariants } from "@/components/ui/button"

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  captionLayout = "label",
  buttonVariant = "ghost",
  formatters,
  components,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames()

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn(
        "bg-background group/calendar p-5 [--cell-size:2.25rem] [[data-slot=card-content]_&]:bg-transparent [[data-slot=popover-content]_&]:bg-transparent",
        String.raw`rtl:**:[.rdp-button\_next>svg]:rotate-180`,
        String.raw`rtl:**:[.rdp-button\_previous>svg]:rotate-180`,
        className
      )}
      captionLayout={captionLayout}
      formatters={{
        formatMonthDropdown: (date) =>
          date.toLocaleString("default", { month: "short" }),
        ...formatters,
      }}
      classNames={{
        root: cn("w-fit", defaultClassNames.root),
        months: cn("relative flex flex-col gap-6 md:flex-row", defaultClassNames.months),
        month: cn("flex w-full flex-col gap-5", defaultClassNames.month),
        nav: cn(
          "absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1",
          defaultClassNames.nav
        ),
        button_previous: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_previous
        ),
        button_next: cn(
          buttonVariants({ variant: buttonVariant }),
          "h-[--cell-size] w-[--cell-size] select-none p-0 aria-disabled:opacity-50",
          defaultClassNames.button_next
        ),
        month_caption: cn(
          "flex h-[--cell-size] w-full items-center justify-center px-[--cell-size]",
          defaultClassNames.month_caption
        ),
        dropdowns: cn(
          "flex w-full items-center justify-center gap-2 text-sm font-medium pt-1",
          defaultClassNames.dropdowns
        ),
        dropdown_root: cn(
          "relative flex items-center bg-[var(--color-surface-raised)] rounded-md border border-[var(--color-border)] px-2.5 py-1.5 hover:border-[var(--color-border-focus)] transition-colors overflow-hidden",
          defaultClassNames.dropdown_root
        ),
        dropdown: cn("absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20", defaultClassNames.dropdown),
        caption_label: cn(
          "select-none font-semibold tracking-wide text-[var(--color-text-primary)] flex items-center gap-1 z-10 pointer-events-none",
          captionLayout === "label" ? "text-sm" : "text-sm",
          defaultClassNames.caption_label
        ),
        table: "w-full border-collapse mt-4",
        weekdays: cn("flex mb-3", defaultClassNames.weekdays),
        weekday: cn(
          "text-[var(--color-text-muted)] flex-1 select-none text-[0.7rem] font-semibold uppercase tracking-widest",
          defaultClassNames.weekday
        ),
        week: cn("mt-1.5 flex w-full", defaultClassNames.week),
        week_number_header: cn("w-[--cell-size] select-none", defaultClassNames.week_number_header),
        week_number: cn(
          "text-[var(--color-text-muted)] select-none text-[0.8rem]",
          defaultClassNames.week_number
        ),
        day: cn(
          "group/day relative aspect-square h-full w-full select-none p-0.5 text-center transition-transform hover:scale-105 [&:first-child[data-selected=true]_button]:rounded-l-md [&:last-child[data-selected=true]_button]:rounded-r-md",
          defaultClassNames.day
        ),
        range_start: cn("bg-[var(--color-primary)] text-white rounded-l-md", defaultClassNames.range_start),
        range_middle: cn("bg-[var(--color-primary-light)] text-[var(--color-text-primary)] rounded-none", defaultClassNames.range_middle),
        range_end: cn("bg-[var(--color-primary)] text-white rounded-r-md", defaultClassNames.range_end),
        today: cn(
          "bg-[var(--color-surface-raised)] text-[var(--color-primary)] font-bold rounded-md data-[selected=true]:rounded-none ring-1 ring-[var(--color-primary-muted)]",
          defaultClassNames.today
        ),
        outside: cn(
          "text-[var(--color-text-placeholder)] opacity-40 aria-selected:text-[var(--color-text-placeholder)]",
          defaultClassNames.outside
        ),
        disabled: cn("text-[var(--color-text-placeholder)] opacity-25", defaultClassNames.disabled),
        hidden: cn("invisible", defaultClassNames.hidden),
        ...classNames,
      }}
      components={{
        Root: ({ className, rootRef, ...props }) => {
          return (<div data-slot="calendar" ref={rootRef} className={cn(className)} {...props} />);
        },
        Chevron: ({ className, orientation, ...props }) => {
          if (orientation === "left") {
            return (<ChevronLeftIcon className={cn("size-4", className)} {...props} />);
          }

          if (orientation === "right") {
            return (<ChevronRightIcon className={cn("size-4", className)} {...props} />);
          }

          return (<ChevronDownIcon className={cn("size-4", className)} {...props} />);
        },
        DayButton: CalendarDayButton,
        WeekNumber: ({ children, ...props }) => {
          return (
            <td {...props}>
              <div className="flex size-[--cell-size] items-center justify-center text-center">
                {children}
              </div>
            </td>
          );
        },
        ...components,
      }}
      {...props} />
  );
}

function CalendarDayButton({
  className,
  day,
  modifiers,
  ...props
}) {
  const defaultClassNames = getDefaultClassNames()

  const ref = React.useRef(null)
  React.useEffect(() => {
    if (modifiers.focused) ref.current?.focus()
  }, [modifiers.focused])

  return (
    <Button
      ref={ref}
      variant="ghost"
      size="icon"
      data-day={day.date.toLocaleDateString()}
      data-selected-single={
        modifiers.selected &&
        !modifiers.range_start &&
        !modifiers.range_end &&
        !modifiers.range_middle
      }
      data-range-start={modifiers.range_start}
      data-range-end={modifiers.range_end}
      data-range-middle={modifiers.range_middle}
      className={cn(
        "data-[selected-single=true]:bg-[var(--color-primary)] data-[selected-single=true]:text-white data-[selected-single=true]:shadow-md data-[selected-single=true]:font-bold data-[range-middle=true]:bg-[var(--color-primary-light)] data-[range-middle=true]:text-[var(--color-text-primary)] data-[range-start=true]:bg-[var(--color-primary)] data-[range-start=true]:text-white data-[range-end=true]:bg-[var(--color-primary)] data-[range-end=true]:text-white group-data-[focused=true]/day:border-[var(--color-border-focus)] group-data-[focused=true]/day:ring-2 group-data-[focused=true]/day:ring-[var(--color-primary-muted)] flex aspect-square h-auto w-full min-w-[--cell-size] flex-col gap-1 font-medium text-[var(--color-text-secondary)] leading-none data-[range-end=true]:rounded-md data-[range-middle=true]:rounded-none data-[range-start=true]:rounded-md group-data-[focused=true]/day:relative group-data-[focused=true]/day:z-10 rounded-lg hover:bg-[var(--color-surface-raised)] hover:text-[var(--color-primary)] transition-all duration-150",
        defaultClassNames.day,
        className
      )}
      {...props} />
  );
}

export { Calendar, CalendarDayButton }