// src/components/Editor/Editor.jsx
// SỬA LỖI KHÔNG NHẬP ĐƯỢC - ĐÚNG CẤU TRÚC BAN ĐẦU

import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import PersonalInfo from './PersonalInfo';
import Experience from './Experience';
import Education from './Education';
import Skills from './Skills';
import './EditorForm.css'; 

// SENSOR TÙY CHỈNH
class MyPointerSensor extends PointerSensor {
  static activators = [
    {
      eventName: 'onPointerDown',
      handler: ({ nativeEvent: event }) => {
        // KHÔNG kích hoạt drag khi click vào các thẻ tương tác
        const interactiveTags = ['INPUT', 'TEXTAREA', 'BUTTON', 'SELECT'];
        
        if (
          event.target.tagName &&
          interactiveTags.includes(event.target.tagName.toUpperCase())
        ) {
          return false;
        }
        
        // CHỈ cho phép drag khi click vào drag-handle
        if (!event.target.closest('.drag-handle')) {
          return false;
        }
        
        return true;
      },
    },
  ];
}

// SORTABLE ITEM - TRUYỀN dragHandleProps VÀO COMPONENT CON
function SortableItem(props) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: props.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const className = `draggable-section ${isDragging ? 'is-dragging' : ''}`;

  return (
    <div ref={setNodeRef} style={style} className={className}>
      {/* TRUYỀN dragHandleProps VÀO COMPONENT CON */}
      {React.cloneElement(props.children, {
        dragHandleProps: { ...attributes, ...listeners },
        title: props.title
      })}
    </div>
  );
}

const sectionsConfig = [
  { id: 'personal', Component: PersonalInfo, title: 'Thông tin cá nhân' },
  { id: 'experience', Component: Experience, title: 'Kinh nghiệm làm việc' },
  { id: 'education', Component: Education, title: 'Học vấn' },
  { id: 'skills', Component: Skills, title: 'Kỹ năng' },
];

const Editor = () => {
  const [sectionOrder, setSectionOrder] = useState(
    sectionsConfig.map(s => s.id)
  );
  
  const sensors = useSensors(
    useSensor(MyPointerSensor, {
      activationConstraint: {
        distance: 8, // Phải kéo 8px mới kích hoạt
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setSectionOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }

  const sortableItems = sectionOrder.filter(id => id !== 'personal');

  return (
    <div className="editor-panel">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <PersonalInfo />
        
        <SortableContext
          items={sortableItems}
          strategy={verticalListSortingStrategy}
        >
          {sortableItems.map((id) => {
            const config = sectionsConfig.find(s => s.id === id);
            if (!config) return null;
            const { Component, title } = config;

            return (
              <SortableItem key={id} id={id} title={title}>
                <Component />
              </SortableItem>
            );
          })}
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default Editor;