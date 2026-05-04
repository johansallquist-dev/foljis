import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Check, GripVertical, Trash2 } from "lucide-react";
import { RoutineItem } from "@/lib/types";

type Props = {
  items: RoutineItem[];
  doneIds: string[];
  onToggle: (id: string) => void;
  onRemove: (id: string) => void;
  onReorder: (items: RoutineItem[]) => void;
};

function SortableRow({
  item,
  done,
  onToggle,
  onRemove,
}: {
  item: RoutineItem;
  done: boolean;
  onToggle: () => void;
  onRemove: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
    zIndex: isDragging ? 10 : "auto",
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`w-full rounded-2xl p-4 shadow-card-soft transition-colors flex items-center gap-3 ${
        done ? "bg-calm-soft" : "bg-card"
      }`}
    >
      <button
        type="button"
        className="touch-none p-1 -ml-1 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
        aria-label="Flytta"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="w-5 h-5" />
      </button>
      <button
        type="button"
        onClick={onToggle}
        className="flex-1 flex items-center gap-3 text-left active:scale-[0.99] transition-transform"
      >
        <span className="text-3xl">{item.emoji}</span>
        <span className={`flex-1 font-medium ${done ? "line-through text-muted-foreground" : ""}`}>
          {item.label}
        </span>
        <div
          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
            done ? "bg-calm border-calm" : "border-border"
          }`}
        >
          {done && <Check className="w-5 h-5 text-calm-foreground" />}
        </div>
      </button>
      <button
        type="button"
        onClick={onRemove}
        className="p-1 text-muted-foreground hover:text-destructive transition-colors"
        aria-label="Ta bort"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}

export function SortableRoutineList({ items, doneIds, onToggle, onRemove, onReorder }: Props) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 150, tolerance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex(i => i.id === active.id);
    const newIndex = items.findIndex(i => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    onReorder(arrayMove(items, oldIndex, newIndex));
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map(item => (
            <SortableRow
              key={item.id}
              item={item}
              done={doneIds.includes(item.id)}
              onToggle={() => onToggle(item.id)}
              onRemove={() => onRemove(item.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
