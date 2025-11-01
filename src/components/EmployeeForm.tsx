import { TrashIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import { zodResolver } from '@hookform/resolvers/zod';
import { useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';
import type { Employee } from '../types';
import { calculateCosts } from '../utils/cost';
import { formatCurrency } from '../utils/format';

const dependentSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
});

const employeeSchema = z.object({
  id: z.string(),
  name: z.string().min(1, 'Name is required'),
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

  const values = watch();
  const previewCosts = calculateCosts(values);

  const onSubmit = (data: EmployeeFormData) => {
    onSave(data);
    reset();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Employee Name
        </label>
        <input
          id="name"
          {...register('name')}
          className="input-base mt-1"
          placeholder="Employee name"
          autoComplete="off"
        />
        {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
      </div>

      <div>
        <h3 className="mb-2 text-sm font-medium">Dependents</h3>
        {fields.length > 0 && (
          <div className="space-y-2 rounded border border-gray-500 p-3">
            {fields.map((field, index) => {
              return (
                <div key={field.id} className="flex flex-col">
                  <div className="flex items-center gap-2">
                    <input
                      {...register(`dependents.${index}.name`)}
                      placeholder="Dependent name"
                      className="input-base"
                    />
                    <button
                      type="button"
                      className="button-danger border-none p-2"
                      onClick={() => remove(index)}
                      aria-label="Remove dependent"
                    >
                      <TrashIcon className="size-5" aria-hidden="true" />
                    </button>
                  </div>
                  {errors.dependents?.[index]?.name && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors.dependents[index]?.name?.message}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}

        <button
          type="button"
          className="button-base mt-2 flex items-center gap-1"
          onClick={() => append({ id: crypto.randomUUID(), name: '' })}
        >
          <UserPlusIcon className="size-5" />
          Add Dependent
        </button>
      </div>

      <div className="rounded border border-orange-300 p-3 text-sm">
        <p>
          Estimated yearly: <strong>{formatCurrency(previewCosts.totalYearly)}</strong>
        </p>
        <p>
          Per paycheck: <strong>{formatCurrency(previewCosts.perPaycheck)}</strong>
        </p>
      </div>

      <div className="flex gap-2">
        <button type="submit" className="button-base">
          Save
        </button>
        <button type="button" onClick={onCancel} className="button-base">
          Cancel
        </button>
      </div>
    </form>
  );
}
