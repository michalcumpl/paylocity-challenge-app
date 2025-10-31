import { faker } from '@faker-js/faker';
import type { Employee, Dependent } from '../types';

function makeDependent(): Dependent {
  return {
    id: faker.string.uuid(),
    name: faker.person.firstName() + ' ' + faker.person.lastName(),
  };
}

function makeEmployee(): Employee {
  const depCount = faker.number.int({ min: 0, max: 3 });
  const dependents: Dependent[] = Array.from({ length: depCount }, () => makeDependent());
  return {
    id: faker.string.uuid(),
    name: faker.person.firstName() + ' ' + faker.person.lastName(),
    dependents,
  };
}

export const mockEmployees: Employee[] = Array.from({ length: 4259 }, () => makeEmployee());
