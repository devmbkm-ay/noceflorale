// import { useState } from 'react';
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { PlusCircle, Trash2 } from "lucide-react";

interface ChildrenSectionProps {
  hasChildren: boolean;
  children: Array<{ name: string; age: string | number }>;
  onChange: (
    hasChildren: boolean,
    children: Array<{ name: string; age: string | number }>
  ) => void;
}

const ChildrenSection: React.FC<ChildrenSectionProps> = ({
  hasChildren,
  children,
  onChange,
}) => {
  const addChild = () => {
    const newChildren = [...children, { name: "", age: "" }];
    onChange(true, newChildren);
  };

  const removeChild = (index: number) => {
    const newChildren = [...children];
    newChildren.splice(index, 1);
    onChange(true, newChildren);

    // If no children left, set hasChildren to false
    if (newChildren.length === 0) {
      onChange(false, []);
    }
  };

  const updateChild = (index: number, field: "name" | "age", value: string) => {
    const newChildren = [...children];
    newChildren[index] = { ...newChildren[index], [field]: value };
    onChange(true, newChildren);
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <Label htmlFor='hasChildren'>Viendrez-vous avec des enfants?</Label>
        <input
          type='checkbox'
          id='hasChildren'
          checked={hasChildren}
          onChange={(e) =>
            onChange(
              e.target.checked,
              e.target.checked
                ? children.length
                  ? children
                  : [{ name: "", age: "" }]
                : []
            )
          }
          className='h-4 w-4'
        />
      </div>

      {hasChildren && (
        <div className='space-y-4'>
          {children.map((child, index) => (
            <div key={index} className='flex gap-3 items-end'>
              <div className='flex-1'>
                <Label htmlFor={`child-name-${index}`}>Nom de l&apos;enfant</Label>
                <Input
                  id={`child-name-${index}`}
                  value={child.name}
                  onChange={(e) => updateChild(index, "name", e.target.value)}
                  placeholder="Nom de l'enfant"
                />
              </div>
              <div className='w-24'>
                <Label htmlFor={`child-age-${index}`}>Âge</Label>
                <Input
                  id={`child-age-${index}`}
                  value={child.age}
                  onChange={(e) => updateChild(index, "age", e.target.value)}
                  placeholder='Âge'
                  type='number'
                  min='0'
                  max='18'
                />
              </div>
              <Button
                type='button'
                variant='ghost'
                size='icon'
                onClick={() => removeChild(index)}
                className='text-destructive'
              >
                <Trash2 className='h-5 w-5' />
              </Button>
            </div>
          ))}

          <Button
            type='button'
            variant='outline'
            size='sm'
            onClick={addChild}
            className='mt-2'
          >
            <PlusCircle className='h-4 w-4 mr-2' />
            Ajouter un enfant
          </Button>
        </div>
      )}
    </div>
  );
};

export default ChildrenSection;
