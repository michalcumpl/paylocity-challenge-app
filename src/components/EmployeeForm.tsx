import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { clsx } from 'clsx';
import { zodResolver } from '@hookform/resolvers/zod';
import type { Employee } from '../types';
import { eligibleForDiscount } from '../utils/cost';

const dependentSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
});

const employeeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Employee name is required'),
  dependents: z.array(dependentSchema),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

type Props = {
  initial?: Employee;
  onSave: (emp: Employee) => void;
  onCancel: () => void;
};

export default function EmployeeForm({ initial, onSave, onCancel }: Props) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initial ?? { id: crypto.randomUUID(), name: '', dependents: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'dependents',
  });

  const name = watch('name');
  const hasDiscount = eligibleForDiscount(name);

  const dependents = watch('dependents') || [];

  const onSubmit = (data: EmployeeFormData) => {
    onSave(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded border p-4">
      <div>
        <label className="block text-sm font-medium">Employee Name</label>
        <input
          {...register('name')}
          className={clsx(
            'w-full rounded border p-2',
            hasDiscount ? 'border-green-500 bg-green-50' : 'mt-1 w-full rounded border p-1',
          )}
          placeholder="Employee name"
        />
        {hasDiscount && <p className="mt-1 text-xs text-green-600">🎉 10% discount</p>}
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <h3 className="mb-2 font-medium">Dependents</h3>
        {fields.map((field, index) => {
          const depName = dependents[index]?.name ?? '';
          const hasDiscount = eligibleForDiscount(depName);

          return (
            <div
              key={field.id}
              className={`flex items-center gap-2 rounded border p-2 transition-all ${
                hasDiscount ? 'border-green-500 bg-green-50' : 'border-gray-300'
              }`}
            >
              <input
                {...register(`dependents.${index}.name`)}
                placeholder="Dependent name"
                className="flex-1 rounded border p-1"
              />
              {hasDiscount && <span className="text-xs text-green-700">🎉 10% discount</span>}
              <button type="button" onClick={() => remove(index)}>
                ❌
              </button>
            </div>
          );
        })}

        <button
          type="button"
          className="mt-2 rounded border px-2 py-1"
          onClick={() => append({ id: crypto.randomUUID(), name: '' })}
        >
          ➕ Add Dependent
        </button>
      </div>

      <div className="flex gap-2">
        <button type="submit" className="rounded bg-blue-500 px-3 py-1 text-white">
          Save
        </button>
        <button type="button" onClick={onCancel} className="rounded border px-3 py-1">
          Cancel
        </button>
      </div>
    </form>
  );
}
