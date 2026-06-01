import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TableRow, TableCell } from "@/components/ui/table";
import { GripVertical } from "lucide-react";

interface SortableTableRowProps extends Omit<React.HTMLAttributes<HTMLTableRowElement>, "id"> {
  id: string | number;
  children: React.ReactNode;
}

export function SortableTableRow({ id, children, ...props }: SortableTableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    ...(isDragging ? { position: "relative" as const, zIndex: 50, backgroundColor: "var(--background)" } : {}),
  };

  return (
    <TableRow ref={setNodeRef} style={style} {...props}>
      <TableCell className="w-12 text-center">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="cursor-grab hover:bg-muted p-1 rounded active:cursor-grabbing text-muted-foreground"
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </TableCell>
      {children}
    </TableRow>
  );
}
