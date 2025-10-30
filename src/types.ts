export type Dependent = {
  id: string;
  name: string;
};

export type Employee = {
  id: string;
  name: string;
  dependents: Dependent[];
};
